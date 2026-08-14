export const aiAgents = [
  { id: 'ai_1', businessId: 'biz_8f21', business: 'Harbour View Hotel', name: 'Harbour View receptionist', status: 'Online', knowledgeMode: 'Shared', promptMode: 'Shared', channels: ['voice', 'whatsapp', 'web'], languages: ['English', 'French', 'German'], personality: 'Hospitality', handoff: true, knowledgeItems: 42, aiMinutes: 1180, conversations: 3410, lastActive: '2026-08-15T07:41:00Z' },
  { id: 'ai_2', businessId: 'biz_3a77', business: 'Cedar Family Clinic', name: 'Cedar Clinic receptionist', status: 'Online', knowledgeMode: 'Shared', promptMode: 'Channel-specific', channels: ['voice', 'whatsapp'], languages: ['French', 'English'], personality: 'Healthcare', handoff: true, knowledgeItems: 61, aiMinutes: 980, conversations: 1870, lastActive: '2026-08-15T06:58:00Z' },
  { id: 'ai_3', businessId: 'biz_5c12', business: 'Bistro Lumière', name: 'Bistro assistant', status: 'Online', knowledgeMode: 'Shared', promptMode: 'Shared', channels: ['voice', 'instagram'], languages: ['French'], personality: 'Friendly', handoff: false, knowledgeItems: 18, aiMinutes: 240, conversations: 903, lastActive: '2026-08-14T21:10:00Z' },
  { id: 'ai_4', businessId: 'biz_9d04', business: 'Northlight Properties', name: 'Northlight concierge', status: 'Online', knowledgeMode: 'Channel-specific', promptMode: 'Channel-specific', channels: ['voice', 'whatsapp', 'instagram', 'web'], languages: ['Swedish', 'English'], personality: 'Professional', handoff: true, knowledgeItems: 88, aiMinutes: 2410, conversations: 4980, lastActive: '2026-08-15T07:02:00Z' },
  { id: 'ai_5', businessId: 'biz_7b55', business: 'Studio Belle Peau', name: 'Studio assistant', status: 'Online', knowledgeMode: 'Shared', promptMode: 'Shared', channels: ['instagram'], languages: ['French'], personality: 'Casual', handoff: false, knowledgeItems: 9, aiMinutes: 40, conversations: 214, lastActive: '2026-08-15T05:44:00Z' },
  { id: 'ai_6', businessId: 'biz_2e88', business: 'Meridian Legal', name: 'Meridian front desk', status: 'Online', knowledgeMode: 'Shared', promptMode: 'Shared', channels: ['voice', 'web'], languages: ['English'], personality: 'Formal', handoff: true, knowledgeItems: 54, aiMinutes: 1320, conversations: 1420, lastActive: '2026-08-14T18:20:00Z' },
  { id: 'ai_7', businessId: 'biz_4f31', business: 'AutoPrime Garage', name: 'AutoPrime assistant', status: 'Paused', knowledgeMode: 'Shared', promptMode: 'Shared', channels: ['voice'], languages: ['Dutch', 'English'], personality: 'Professional', handoff: true, knowledgeItems: 22, aiMinutes: 310, conversations: 402, lastActive: '2026-07-28T16:12:00Z' },
  { id: 'ai_8', businessId: 'biz_8h22', business: 'Alpine Chalet Rentals', name: 'Alpine concierge', status: 'Online', knowledgeMode: 'Shared', promptMode: 'Shared', channels: ['voice', 'whatsapp', 'web'], languages: ['German', 'English', 'French'], personality: 'Hospitality', handoff: true, knowledgeItems: 47, aiMinutes: 1640, conversations: 2240, lastActive: '2026-08-15T03:18:00Z' },
  { id: 'ai_9', businessId: 'biz_5k47', business: 'Karim Consulting', name: 'Karim front desk', status: 'Online', knowledgeMode: 'Shared', promptMode: 'Shared', channels: ['voice', 'whatsapp', 'web'], languages: ['English', 'Arabic'], personality: 'Professional', handoff: true, knowledgeItems: 39, aiMinutes: 1490, conversations: 3120, lastActive: '2026-08-15T07:12:00Z' },
  { id: 'ai_10', businessId: 'biz_1c63', business: 'Atelier Petit', name: 'Atelier assistant', status: 'Needs setup', knowledgeMode: 'Shared', promptMode: 'Shared', channels: [], languages: ['French'], personality: 'Friendly', handoff: false, knowledgeItems: 2, aiMinutes: 0, conversations: 18, lastActive: '2026-08-12T14:32:00Z' },
]

export const voiceConnections = [
  { id: 'vc_1', businessId: 'biz_8f21', business: 'Harbour View Hotel', number: '+33 4 91 22 18 40', provider: 'Twilio', credential: 'AC••••••••7C41', status: 'Connected', enabled: true, calls: 1284, minutes: 3620, lastActivity: '2026-08-15T07:41:00Z' },
  { id: 'vc_2', businessId: 'biz_3a77', business: 'Cedar Family Clinic', number: '+33 1 44 55 66 77', provider: 'Twilio', credential: 'AC••••••••2B18', status: 'Connected', enabled: true, calls: 942, minutes: 2410, lastActivity: '2026-08-15T06:58:00Z' },
  { id: 'vc_3', businessId: 'biz_9d04', business: 'Northlight Properties', number: '+46 8 122 44 90', provider: 'Twilio', credential: 'AC••••••••9F55', status: 'Connected', enabled: true, calls: 2140, minutes: 6180, lastActivity: '2026-08-15T07:02:00Z' },
  { id: 'vc_4', businessId: 'biz_2e88', business: 'Meridian Legal', number: '+44 20 7946 0102', provider: 'Twilio', credential: 'AC••••••••4D12', status: 'Connected', enabled: true, calls: 1103, minutes: 3140, lastActivity: '2026-08-14T18:20:00Z' },
  { id: 'vc_5', businessId: 'biz_4f31', business: 'AutoPrime Garage', number: '+31 20 344 88 90', provider: 'Twilio', credential: 'AC••••••••7A03', status: 'Disabled', enabled: false, calls: 331, minutes: 820, lastActivity: '2026-07-28T16:12:00Z' },
  { id: 'vc_6', businessId: 'biz_8h22', business: 'Alpine Chalet Rentals', number: '+41 27 966 12 00', provider: 'Twilio', credential: 'AC••••••••6E90', status: 'Connected', enabled: true, calls: 1520, minutes: 4380, lastActivity: '2026-08-15T03:18:00Z' },
  { id: 'vc_7', businessId: 'biz_5k47', business: 'Karim Consulting', number: '+971 4 355 88 20', provider: 'Twilio', credential: 'AC••••••••1C77', status: 'Connected', enabled: true, calls: 1830, minutes: 5210, lastActivity: '2026-08-15T07:12:00Z' },
  { id: 'vc_8', businessId: 'biz_6a19', business: 'Lakeview Dental', number: '+39 02 8901 4455', provider: 'Twilio', credential: 'AC••••••••3B44', status: 'Warning', enabled: true, calls: 876, minutes: 2140, lastActivity: '2026-08-15T04:31:00Z', warning: 'Webhook returned 5xx twice in the last hour' },
]

export const whatsappConnections = [
  { id: 'wa_1', businessId: 'biz_8f21', business: 'Harbour View Hotel', account: 'Harbour View Hotel', number: '+33 6 44 90 11 27', credential: 'EAA••••••••9K02', status: 'Connected', enabled: true, messages: 2140, lastActivity: '2026-08-15T07:12:00Z' },
  { id: 'wa_2', businessId: 'biz_3a77', business: 'Cedar Family Clinic', account: 'Cedar Clinic', number: '+33 6 55 71 30 12', credential: 'EAA••••••••3M41', status: 'Connected', enabled: true, messages: 1870, lastActivity: '2026-08-15T06:58:00Z' },
  { id: 'wa_3', businessId: 'biz_9d04', business: 'Northlight Properties', account: 'Northlight', number: '+46 70 555 21 08', credential: 'EAA••••••••8P19', status: 'Connected', enabled: true, messages: 3240, lastActivity: '2026-08-15T07:02:00Z' },
  { id: 'wa_4', businessId: 'biz_8h22', business: 'Alpine Chalet Rentals', account: 'Alpine Chalet', number: '+41 79 220 44 11', credential: 'EAA••••••••5R73', status: 'Connected', enabled: true, messages: 1580, lastActivity: '2026-08-15T03:18:00Z' },
  { id: 'wa_5', businessId: 'biz_5k47', business: 'Karim Consulting', account: 'Karim Consulting', number: '+971 50 220 11 88', credential: 'EAA••••••••2W60', status: 'Connected', enabled: true, messages: 2410, lastActivity: '2026-08-15T07:12:00Z' },
  { id: 'wa_6', businessId: 'biz_9w66', business: 'Maison Fleurie', account: 'Maison Fleurie', number: '+212 6 61 22 44 90', credential: 'EAA••••••••7H28', status: 'Failed', enabled: true, messages: 1980, lastActivity: '2026-08-14T22:05:00Z', warning: 'Access token expired — business must reconnect' },
  { id: 'wa_7', businessId: 'biz_6a19', business: 'Lakeview Dental', account: 'Lakeview Dental', number: '+39 340 118 22 09', credential: 'EAA••••••••4T51', status: 'Connected', enabled: true, messages: 1610, lastActivity: '2026-08-15T04:31:00Z' },
]

export const instagramConnections = [
  { id: 'ig_1', businessId: 'biz_5c12', business: 'Bistro Lumière', account: '@bistrolumiere', credential: 'IGQ••••••••8B12', status: 'Connected', enabled: true, messages: 903, lastActivity: '2026-08-14T21:10:00Z' },
  { id: 'ig_2', businessId: 'biz_9d04', business: 'Northlight Properties', account: '@northlightproperties', credential: 'IGQ••••••••2K90', status: 'Connected', enabled: true, messages: 740, lastActivity: '2026-08-15T06:20:00Z' },
  { id: 'ig_3', businessId: 'biz_7b55', business: 'Studio Belle Peau', account: '@studiobellepeau', credential: 'IGQ••••••••5D33', status: 'Connected', enabled: true, messages: 214, lastActivity: '2026-08-15T05:44:00Z' },
  { id: 'ig_4', businessId: 'biz_3p90', business: 'Verde Garden Centre', account: '@verdegarden', credential: 'IGQ••••••••9L07', status: 'Connected', enabled: true, messages: 520, lastActivity: '2026-08-14T18:24:00Z' },
  { id: 'ig_5', businessId: 'biz_9w66', business: 'Maison Fleurie', account: '@maisonfleurie', credential: 'IGQ••••••••1X64', status: 'Disabled', enabled: false, messages: 700, lastActivity: '2026-08-10T12:00:00Z' },
]

export const conversations = [
  { id: 'cnv_1', businessId: 'biz_8f21', business: 'Harbour View Hotel', customer: 'Daniel Reyes', channel: 'voice', handledBy: 'AI', status: 'Open', lastMessage: 'Deluxe King with parking, arriving today.', at: '2026-08-15T07:41:00Z', outcome: 'Booking created' },
  { id: 'cnv_2', businessId: 'biz_3a77', business: 'Cedar Family Clinic', customer: 'Aisha Karim', channel: 'whatsapp', handledBy: 'AI', status: 'Open', lastMessage: 'The next available appointment is Thursday at 14:30.', at: '2026-08-15T07:12:00Z', outcome: 'Appointment offered' },
  { id: 'cnv_3', businessId: 'biz_9d04', business: 'Northlight Properties', customer: 'Sofia Lindqvist', channel: 'voice', handledBy: 'Human', status: 'Escalated', lastMessage: 'Passed to a team member — viewing request for 12 units.', at: '2026-08-14T15:09:00Z', outcome: 'Transferred' },
  { id: 'cnv_4', businessId: 'biz_5c12', business: 'Bistro Lumière', customer: 'Marco Bianchi', channel: 'instagram', handledBy: 'AI', status: 'Resolved', lastMessage: 'Nous ouvrons à 19h du mardi au samedi.', at: '2026-08-14T18:24:00Z', outcome: 'Information given' },
  { id: 'cnv_5', businessId: 'biz_8h22', business: 'Alpine Chalet Rentals', customer: 'Thomas Weber', channel: 'web', handledBy: 'AI', status: 'Resolved', lastMessage: 'Leider sind wir an diesem Wochenende ausgebucht.', at: '2026-08-13T20:08:00Z', outcome: 'No availability' },
  { id: 'cnv_6', businessId: 'biz_5k47', business: 'Karim Consulting', customer: 'Priya Nair', channel: 'whatsapp', handledBy: 'AI', status: 'Open', lastMessage: 'I have booked your consultation for 22 August.', at: '2026-08-13T09:26:00Z', outcome: 'Booking created' },
  { id: 'cnv_7', businessId: 'biz_2e88', business: 'Meridian Legal', customer: 'Ahmed Belkacem', channel: 'voice', handledBy: 'AI', status: 'Open', lastMessage: 'A solicitor will call you back before 17:00.', at: '2026-08-12T22:44:00Z', outcome: 'Lead captured' },
  { id: 'cnv_8', businessId: 'biz_6a19', business: 'Lakeview Dental', customer: 'Elena Rossi', channel: 'whatsapp', handledBy: 'AI', status: 'Resolved', lastMessage: 'La pulizia dentale costa 90 euro.', at: '2026-08-11T16:34:00Z', outcome: 'Information given' },
  { id: 'cnv_9', businessId: 'biz_9w66', business: 'Maison Fleurie', customer: 'Nora Haddad', channel: 'instagram', handledBy: 'AI', status: 'Open', lastMessage: 'Nous livrons dans tout Casablanca.', at: '2026-08-15T06:10:00Z', outcome: 'Lead captured' },
  { id: 'cnv_10', businessId: 'biz_2r38', business: 'Riverside Vets', customer: 'James Whitfield', channel: 'voice', handledBy: 'Human', status: 'Escalated', lastMessage: 'Complaint logged and escalated.', at: '2026-08-05T10:05:00Z', outcome: 'Complaint' },
]

export const calls = [
  { id: 'call_1', businessId: 'biz_8f21', business: 'Harbour View Hotel', customer: 'Daniel Reyes', phone: '+33 6 12 44 87 90', at: '2026-08-15T07:38:00Z', duration: 186, status: 'Completed', aiHandled: true, transferred: false, recording: true, transcriptId: 'tr_1' },
  { id: 'call_2', businessId: 'biz_9d04', business: 'Northlight Properties', customer: 'Sofia Lindqvist', phone: '+46 70 555 21 08', at: '2026-08-14T15:02:00Z', duration: 421, status: 'Completed', aiHandled: true, transferred: true, recording: true, transcriptId: 'tr_2' },
  { id: 'call_3', businessId: 'biz_2e88', business: 'Meridian Legal', customer: 'Ahmed Belkacem', phone: '+33 7 88 21 55 40', at: '2026-08-12T22:41:00Z', duration: 154, status: 'Completed', aiHandled: true, transferred: false, recording: true, transcriptId: 'tr_3' },
  { id: 'call_4', businessId: 'biz_3a77', business: 'Cedar Family Clinic', customer: 'Unknown caller', phone: '+33 6 90 11 02 74', at: '2026-08-12T19:12:00Z', duration: 0, status: 'Missed', aiHandled: false, transferred: false, recording: false, transcriptId: null },
  { id: 'call_5', businessId: 'biz_6a19', business: 'Lakeview Dental', customer: 'Elena Rossi', phone: '+39 340 118 22 09', at: '2026-08-11T16:30:00Z', duration: 267, status: 'Completed', aiHandled: true, transferred: false, recording: true, transcriptId: 'tr_4' },
  { id: 'call_6', businessId: 'biz_8h22', business: 'Alpine Chalet Rentals', customer: 'Peter Janssen', phone: '+31 6 2244 8890', at: '2026-08-11T10:04:00Z', duration: 92, status: 'Completed', aiHandled: true, transferred: false, recording: true, transcriptId: 'tr_5' },
  { id: 'call_7', businessId: 'biz_5k47', business: 'Karim Consulting', customer: 'Unknown caller', phone: '+971 50 990 44 21', at: '2026-08-10T23:55:00Z', duration: 18, status: 'Voicemail', aiHandled: true, transferred: false, recording: true, transcriptId: null },
  { id: 'call_8', businessId: 'biz_8f21', business: 'Harbour View Hotel', customer: 'Aisha Karim', phone: '+971 50 220 11 88', at: '2026-08-10T13:18:00Z', duration: 310, status: 'Completed', aiHandled: true, transferred: true, recording: true, transcriptId: null },
  { id: 'call_9', businessId: 'biz_2r38', business: 'Riverside Vets', customer: 'Nora Haddad', phone: '+33 6 55 71 30 12', at: '2026-08-05T09:40:00Z', duration: 143, status: 'Completed', aiHandled: true, transferred: false, recording: false, transcriptId: null },
  { id: 'call_10', businessId: 'biz_4f31', business: 'AutoPrime Garage', customer: 'Unknown caller', phone: '+31 6 12 90 44 21', at: '2026-07-28T18:02:00Z', duration: 0, status: 'Missed', aiHandled: false, transferred: false, recording: false, transcriptId: null },
]

export const messages = [
  { id: 'msg_1', businessId: 'biz_3a77', business: 'Cedar Family Clinic', customer: 'Aisha Karim', channel: 'whatsapp', at: '2026-08-15T07:11:00Z', text: 'Do you have an appointment this week?', aiResponse: 'The next available appointment is Thursday at 14:30.', status: 'Answered' },
  { id: 'msg_2', businessId: 'biz_9w66', business: 'Maison Fleurie', customer: 'Nora Haddad', channel: 'instagram', at: '2026-08-15T06:10:00Z', text: 'Livrez-vous à Casablanca ?', aiResponse: 'Oui, nous livrons dans tout Casablanca.', status: 'Answered' },
  { id: 'msg_3', businessId: 'biz_5c12', business: 'Bistro Lumière', customer: 'Marco Bianchi', channel: 'instagram', at: '2026-08-14T18:20:00Z', text: 'À quelle heure ouvrez-vous ?', aiResponse: 'Nous ouvrons à 19h du mardi au samedi.', status: 'Answered' },
  { id: 'msg_4', businessId: 'biz_8h22', business: 'Alpine Chalet Rentals', customer: 'Thomas Weber', channel: 'web', at: '2026-08-13T20:05:00Z', text: 'Haben Sie am Wochenende frei?', aiResponse: 'Leider sind wir an diesem Wochenende ausgebucht.', status: 'Answered' },
  { id: 'msg_5', businessId: 'biz_5k47', business: 'Karim Consulting', customer: 'Priya Nair', channel: 'whatsapp', at: '2026-08-13T09:25:00Z', text: 'Can I book a consultation?', aiResponse: 'I have booked your consultation for 22 August.', status: 'Answered' },
  { id: 'msg_6', businessId: 'biz_9d04', business: 'Northlight Properties', customer: 'Oliver Grant', channel: 'instagram', at: '2026-08-11T19:02:00Z', text: 'Are pets allowed in the apartments?', aiResponse: 'Most of our apartments are pet friendly.', status: 'Answered' },
  { id: 'msg_7', businessId: 'biz_6a19', business: 'Lakeview Dental', customer: 'Fatima Zahra', channel: 'whatsapp', at: '2026-08-10T08:44:00Z', text: 'Quanto costa la pulizia dentale?', aiResponse: 'La pulizia dentale costa 90 euro.', status: 'Escalated' },
  { id: 'msg_8', businessId: 'biz_3p90', business: 'Verde Garden Centre', customer: 'Chloé Petit', channel: 'web', at: '2026-08-09T14:30:00Z', text: 'Do you deliver plants?', aiResponse: 'Yes, we deliver within Rome for €12.', status: 'Answered' },
]

export const transcripts = [
  {
    id: 'tr_1', callId: 'call_1', businessId: 'biz_8f21', business: 'Harbour View Hotel', customer: 'Daniel Reyes', channel: 'voice',
    at: '2026-08-15T07:38:00Z', duration: 186, outcome: 'Booking created', language: 'English',
    lines: [
      { at: 0, from: 'ai', text: 'Good day, Harbour View Hotel — how can I help you?' },
      { at: 4, from: 'customer', text: 'Hi, do you have a room available for tonight?' },
      { at: 9, from: 'ai', text: 'Yes — we have a Deluxe King Room available tonight at 180 euros, breakfast included.' },
      { at: 21, from: 'customer', text: 'That works. Is parking available?' },
      { at: 26, from: 'ai', text: 'We do have private parking at 22 euros per night. Shall I reserve a space?' },
      { at: 38, from: 'customer', text: 'Yes please. Daniel Reyes.' },
      { at: 58, from: 'ai', text: 'Thank you Daniel — Deluxe King with parking, arriving today.' },
    ],
  },
  {
    id: 'tr_2', callId: 'call_2', businessId: 'biz_9d04', business: 'Northlight Properties', customer: 'Sofia Lindqvist', channel: 'voice',
    at: '2026-08-14T15:02:00Z', duration: 421, outcome: 'Transferred to team', language: 'English',
    lines: [
      { at: 0, from: 'ai', text: 'Northlight Properties, how can I help?' },
      { at: 5, from: 'customer', text: 'I need viewings for twelve units in September.' },
      { at: 11, from: 'ai', text: 'For six units or more I will pass you to a member of our team.' },
      { at: 24, from: 'customer', text: 'Sofia Lindqvist, plus forty-six seventy...' },
      { at: 55, from: 'human', text: 'Hello Sofia, this is Anna from Northlight — I can help with that.' },
    ],
  },
  {
    id: 'tr_3', callId: 'call_3', businessId: 'biz_2e88', business: 'Meridian Legal', customer: 'Ahmed Belkacem', channel: 'voice',
    at: '2026-08-12T22:41:00Z', duration: 154, outcome: 'Lead captured', language: 'English',
    lines: [
      { at: 0, from: 'ai', text: 'Good evening, Meridian Legal.' },
      { at: 5, from: 'customer', text: 'I need advice on a commercial lease.' },
      { at: 10, from: 'ai', text: 'A solicitor will call you back before 17:00 tomorrow. May I take your number?' },
      { at: 26, from: 'customer', text: 'Yes, of course.' },
    ],
  },
  {
    id: 'tr_4', callId: 'call_5', businessId: 'biz_6a19', business: 'Lakeview Dental', customer: 'Elena Rossi', channel: 'voice',
    at: '2026-08-11T16:30:00Z', duration: 267, outcome: 'Appointment booked', language: 'Italian',
    lines: [
      { at: 0, from: 'ai', text: 'Buonasera, Lakeview Dental.' },
      { at: 6, from: 'customer', text: 'Vorrei prenotare una pulizia dentale.' },
      { at: 12, from: 'ai', text: 'Certamente. Abbiamo disponibilità giovedì alle 15:00.' },
      { at: 28, from: 'customer', text: 'Perfetto.' },
    ],
  },
  {
    id: 'tr_5', callId: 'call_6', businessId: 'biz_8h22', business: 'Alpine Chalet Rentals', customer: 'Peter Janssen', channel: 'voice',
    at: '2026-08-11T10:04:00Z', duration: 92, outcome: 'Information given', language: 'English',
    lines: [
      { at: 0, from: 'ai', text: 'Good morning, Alpine Chalet Rentals.' },
      { at: 5, from: 'customer', text: 'Is the chalet ski-in ski-out?' },
      { at: 9, from: 'ai', text: 'Yes, it sits directly on the Sunnegga piste.' },
      { at: 20, from: 'customer', text: 'Perfect, thank you.' },
    ],
  },
]
