/**
 * Conversation memory for the WhatsApp receptionist: business clock, recent
 * thread as chat turns, structured profile/state extraction and the memory
 * block the reply model reads. Pure helpers — all I/O stays in server.js.
 */

const HISTORY_LIMIT = 20

const INTENTS = [
  'appointment_booking',
  'appointment_modification',
  'appointment_cancellation',
  'pricing',
  'service_inquiry',
  'business_info',
  'location',
  'opening_hours',
  'support',
  'complaint',
  'contact_request',
  'human_request',
  'general',
]

function validTimezone(tz) {
  if (!tz) return false
  try {
    new Intl.DateTimeFormat('en', { timeZone: tz })
    return true
  } catch {
    return false
  }
}

/** Current date/time in the business timezone (falls back to DEFAULT_TIMEZONE, then UTC). */
function businessClock(timezone, at = new Date()) {
  const tz = validTimezone(timezone) ? timezone : validTimezone(process.env.DEFAULT_TIMEZONE) ? process.env.DEFAULT_TIMEZONE : 'UTC'
  const day = (date) => new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)
  const weekday = (date) => new Intl.DateTimeFormat('en-GB', { timeZone: tz, weekday: 'long' }).format(date)
  const tomorrow = new Date(at.getTime() + 24 * 60 * 60 * 1000)
  // Explicit date → weekday list so models never compute weekdays themselves.
  const upcoming = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(at.getTime() + i * 24 * 60 * 60 * 1000)
    return `${weekday(date)} ${day(date)}${i === 0 ? ' (today)' : i === 1 ? ' (tomorrow)' : ''}`
  })
  return {
    upcoming,
    timezone: tz,
    date: day(at),
    time: new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(at),
    weekday: weekday(at),
    tomorrow: day(tomorrow),
    tomorrowWeekday: weekday(tomorrow),
  }
}

function messageText(row) {
  return String(row.transcription || row.body || '').trim()
}

/** Stored message rows (oldest first) → chat turns for the reply model. */
function historyToChat(rows) {
  return rows
    .map((row) => {
      const text = messageText(row)
      if (!text) return null
      if (row.direction === 'in') {
        return { role: 'user', content: row.type === 'voice' ? `[voice note] ${text}` : text }
      }
      return { role: 'assistant', content: row.type === 'human' ? `[team member] ${text}` : text }
    })
    .filter(Boolean)
    .slice(-HISTORY_LIMIT)
}

function parseJson(value, fallback = {}) {
  if (value && typeof value === 'object') return value
  try {
    const parsed = JSON.parse(value || '')
    return parsed && typeof parsed === 'object' ? parsed : fallback
  } catch {
    return fallback
  }
}

function extractionMessages({ clock, profile, state, history, latest, latestType, bookings }) {
  const system = `You keep structured memory for a business WhatsApp receptionist. Read the recent conversation and the customer's LATEST message, then return JSON only:
{
  "language": "English name of the language of the LATEST customer message, e.g. English, Arabic, Somali, Amharic, Afar, French, Urdu",
  "intent": one of ${JSON.stringify(INTENTS)},
  "stage": "short snake_case stage of the workflow, e.g. collecting_booking_details, awaiting_time, awaiting_date, booking_requested, answered, handoff",
  "profile": { "name": null, "email": null, "company": null, "location": null, "notes": null },
  "booking": { "action": "none" | "request" | "modify" | "cancel", "service": null, "date": null, "time": null, "guests": null, "ready": false },
  "missing": ["fields still needed for the current task, e.g. date, time, name"],
  "handoff": false
}
Rules:
- Business date now: ${clock.weekday} ${clock.date}, time ${clock.time} (${clock.timezone}). Tomorrow is ${clock.tomorrowWeekday} ${clock.tomorrow}. Next 14 days: ${clock.upcoming.join('; ')}. Always take weekday dates from this list. Convert relative dates (today, tomorrow, next Monday, "kal", "berri", "غدا", "ነገ", "demain") to YYYY-MM-DD and times to 24-hour HH:MM. "4 baje"/"4 PM"/"saacadda 4" in an afternoon context is 16:00; if AM/PM is genuinely unclear keep the literal hour and add "time_period" to missing. Amharic speakers often use Ethiopian time, where the day's hours start at 6:00: "ጠዋት 3 ሰዓት" = 09:00, "ከሰዓት 10 ሰዓት" = 16:00, "ምሽት 2 ሰዓት" = 20:00 — convert Ethiopian-time hours to international 24-hour time.
- Merge with the previous state: keep earlier values unless the customer changed them. A short reply like "yes", "at 4" or "tomorrow" continues the previous topic.
- profile: only facts the customer stated about themselves; null for anything unknown. Never invent.
- booking.action: "request" when the customer wants to book/reserve/make an appointment; "modify" to change an existing request; "cancel" to cancel; otherwise "none" (asking about prices or hours is not a booking).
- booking.ready = true only when the customer wants the booking AND both date and time are known. The service is optional: leave it null when not stated and do not put it in "missing" unless the business clearly requires it.
- Speech transcripts can contain small spelling mistakes (e.g. Amharic "ነጋ" for "ነገ" = tomorrow); read them for meaning.
- handoff = true only when the customer explicitly asks to talk to a human, staff member, manager or receptionist.`
  const user = JSON.stringify({
    previous_profile: profile || {},
    previous_state: state || {},
    customer_bookings: (bookings || []).map((b) => ({ date: b.date, time: b.time, service: b.service, status: b.status })),
    recent_messages: history.slice(-10).map((turn) => ({ from: turn.role === 'user' ? 'customer' : 'business', text: turn.content })),
    latest_message: { type: latestType, text: latest },
  })
  return [
    { role: 'system', content: system },
    { role: 'user', content: user },
  ]
}

function cleanValue(value, max = 120) {
  if (value === null || value === undefined) return null
  const text = String(value).trim()
  if (!text || text.toLowerCase() === 'null' || text.toLowerCase() === 'unknown') return null
  return text.slice(0, max)
}

/** Normalise the extractor's JSON and merge it into the stored profile/state. */
function mergeExtraction(raw, previousProfile = {}, previousState = {}) {
  const data = parseJson(raw, {})
  const profile = { ...previousProfile }
  for (const key of ['name', 'email', 'company', 'location', 'notes']) {
    const value = cleanValue(data.profile?.[key], key === 'notes' ? 400 : 120)
    if (value) profile[key] = value
  }
  const prevBooking = previousState.booking || {}
  const date = cleanValue(data.booking?.date, 10)
  const time = cleanValue(data.booking?.time, 5)
  const booking = {
    service: cleanValue(data.booking?.service) || prevBooking.service || null,
    date: /^\d{4}-\d{2}-\d{2}$/.test(date || '') ? date : prevBooking.date || null,
    time: /^\d{2}:\d{2}$/.test(time || '') ? time : prevBooking.time || null,
    guests: Number(data.booking?.guests) > 0 ? Number(data.booking.guests) : prevBooking.guests || null,
  }
  let action = ['request', 'modify', 'cancel'].includes(data.booking?.action) ? data.booking.action : 'none'
  const state = {
    intent: INTENTS.includes(data.intent) ? data.intent : previousState.intent || 'general',
    stage: cleanValue(data.stage, 60) || previousState.stage || null,
    language: cleanValue(data.language, 40) || previousState.language || null,
    booking,
    missing: Array.isArray(data.missing) ? data.missing.map((m) => cleanValue(m, 40)).filter(Boolean).slice(0, 6) : [],
  }
  // A follow-up like "at 4 PM" often comes back as action "none"; the booking intent carries it.
  if (action === 'none' && (state.intent === 'appointment_booking' || state.intent === 'appointment_modification')) {
    action = state.intent === 'appointment_booking' ? 'request' : 'modify'
  }
  return {
    profile,
    state,
    action,
    // Decided here, not by the model: a booking wish plus a known date and time is enough.
    ready: (action === 'request' || action === 'modify') && Boolean(booking.date && booking.time),
    handoff: data.handoff === true,
    language: state.language,
  }
}

function listLine(label, value) {
  return value ? `${label}: ${value}` : null
}

/** System block with memory, clock, action result and WhatsApp conduct rules for the reply model. */
function memoryBlock({ clock, profile = {}, state = {}, phone, bookings = [], actionResult = '', handoff = false }) {
  const known = [
    listLine('Name', profile.name),
    listLine('WhatsApp number', phone),
    listLine('Email', profile.email),
    listLine('Company', profile.company),
    listLine('Location', profile.location),
    listLine('Notes', profile.notes),
  ].filter(Boolean)
  const b = state.booking || {}
  const collected = [listLine('service', b.service), listLine('date', b.date), listLine('time', b.time), listLine('guests', b.guests)].filter(Boolean)
  const lines = [
    `CURRENT DATE AND TIME (business timezone ${clock.timezone}): ${clock.weekday} ${clock.date}, ${clock.time}. Tomorrow is ${clock.tomorrowWeekday} ${clock.tomorrow}.
CALENDAR (use it, never compute weekdays yourself): ${clock.upcoming.join('; ')}.`,
    `KNOWN CUSTOMER INFO (never ask again for these): ${known.length ? known.join('; ') : 'nothing yet'}.`,
    `CONVERSATION STATE: intent ${state.intent || 'general'}${state.stage ? `, stage ${state.stage}` : ''}${collected.length ? `; collected ${collected.join(', ')}` : ''}${state.missing?.length ? `; still missing ${state.missing.join(', ')}` : ''}.`,
  ]
  if (state.language) lines.push(`LANGUAGE OF THE CURRENT MESSAGE: ${state.language}.`)
  if (bookings.length) {
    lines.push(
      `CUSTOMER'S BOOKINGS:\n${bookings
        .map((row) => `- ${row.service || 'Appointment'} on ${row.date} at ${row.time}: ${row.status === 'Confirmed' ? 'CONFIRMED by the team' : row.status === 'Pending' ? 'PENDING request — NOT confirmed yet, the team still has to confirm it' : row.status}`)
        .join('\n')}`,
    )
  }
  if (actionResult) lines.push(`ACTION RESULT (tell the customer this accurately): ${actionResult}`)
  if (handoff) {
    lines.push('HANDOFF: The customer asked for a person. Tell them naturally, in their language, that you are passing the conversation to the team and someone will reply here soon. Do not try to answer anything else.')
  }
  lines.push(`WHATSAPP RECEPTIONIST RULES:
- The earlier messages are this same WhatsApp thread (text and voice notes). Use them to understand short follow-ups like "yes", "at 4" or "tomorrow" — do not ask what they refer to when the thread makes it clear.
- Reply in the language of the customer's CURRENT message; if they switch language, switch with them. For mixed messages use the dominant language.
- Sound like a professional human receptionist: natural, warm, concise. Never mention databases, systems, memory or being an AI language model.
- Ask only for information that is still missing, at most one or two questions at a time.
- You cannot check availability or confirm bookings. Never say a booking is confirmed, scheduled, booked or reserved, or that a slot is free, unless it is listed above as CONFIRMED by the team. A PENDING booking is always "a request waiting for the team's confirmation". When a request is saved, say it has been received and the team will confirm it.
- Opening days and hours come only from the business knowledge; check a requested day against the CALENDAR and those hours carefully before saying the business is closed. A day range wraps through the week in order (Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday): "Saturday to Thursday" means Saturday, Sunday, Monday, Tuesday, Wednesday and Thursday — only Friday is excluded.
- The service is optional for a booking request. Do not hold a request back because the service is unknown; you may ask about it once, but a date and time are enough for the team.
- Never claim an action happened unless the ACTION RESULT above says so. If no booking is listed above and there is no ACTION RESULT, do not say a request was received, noted or saved — ask for what is still missing instead.`)
  return lines.join('\n\n')
}

module.exports = {
  HISTORY_LIMIT,
  businessClock,
  historyToChat,
  extractionMessages,
  mergeExtraction,
  memoryBlock,
  parseJson,
}
