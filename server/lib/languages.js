/**
 * Languages the AI receptionist speaks. English is the default; every other
 * language is answered in its own language and script.
 *
 * twilio: Twilio <Gather> speech code. Languages without reliable Twilio speech
 *         recognition use <Record> + Whisper instead (see voiceTwilio.js).
 * whisper: ISO-639-1 hint for OpenAI transcription (null = let Whisper detect).
 * lowResource: small models drift into a neighbouring language, so replies use
 *              OPENAI_MODEL_MULTILINGUAL (see chatModelFor).
 */
const LANGUAGES = {
  en: { name: 'English', native: 'English', script: 'Latin', twilio: 'en-US', whisper: 'en' },
  fr: { name: 'French', native: 'Français', script: 'Latin', twilio: 'fr-FR', whisper: 'fr' },
  ar: { name: 'Arabic', native: 'العربية', script: 'Arabic', twilio: 'ar-AE', whisper: 'ar' },
  so: { name: 'Somali', native: 'Soomaali', script: 'Latin (standard Somali orthography)', twilio: null, whisper: 'so', lowResource: true },
  am: { name: 'Amharic', native: 'አማርኛ', script: "Ethiopic / Ge'ez (ፊደል)", twilio: null, whisper: 'am', lowResource: true },
  aa: { name: 'Afar', native: 'Qafar af', script: 'Latin (Qafar orthography)', twilio: null, whisper: null, lowResource: true },
}

const DEFAULT_LANGUAGE = 'en'
const ALL_CODES = Object.keys(LANGUAGES)

const NAME_TO_CODE = Object.fromEntries(
  Object.entries(LANGUAGES).flatMap(([code, meta]) => [
    [code, code],
    [meta.name.toLowerCase(), code],
    [meta.native.toLowerCase(), code],
  ]),
)
Object.assign(NAME_TO_CODE, { ethiopian: 'am', qafar: 'aa', soomaali: 'so' })

function normalizeLanguage(value, fallback = DEFAULT_LANGUAGE) {
  const raw = String(value || '').trim().toLowerCase()
  if (!raw) return fallback
  if (NAME_TO_CODE[raw]) return NAME_TO_CODE[raw]
  const short = raw.slice(0, 2)
  return LANGUAGES[short] ? short : fallback
}

function languageName(code) {
  return LANGUAGES[normalizeLanguage(code)].name
}

const WORDS = {
  so: ['waxaan', 'waxa', 'maxaa', 'fadlan', 'mahadsanid', 'mahadsan', 'haa', 'maya', 'waa', 'iyo', 'ayaan', 'ayuu', 'sidee', 'immisa', 'xagee', 'goorma', 'salaan', 'nabad', 'ballan', 'qiimaha', 'subax', 'wanaagsan', 'caawin', 'rabaa', 'doonayaa', 'ahay', 'tahay', 'hadda', 'berri', 'maanta', 'ma', 'aan', 'ka', 'ku', 'soo', 'kala', 'waan', 'xafiiska', 'lacag', 'isku'],
  aa: ['qafar', 'nagay', 'nagai', 'makai', 'makay', 'maaqo', 'maaqoonu', 'mahaa', 'macaay', 'macaa', 'yoo', 'kaa', 'atu', 'anu', 'nanu', 'isin', 'usuk', 'tet', 'kee', 'elle', 'edde', 'abe', 'abinaan', 'akkele', 'sinni', 'gexe', 'gexxa', 'faxa', 'faxxa', 'iyya', 'ittam', 'yeexege', 'xiqe', 'gadda', 'meqe', 'meqeh', 'qaxa', 'baaxo', 'ellecabo'],
  fr: ['bonjour', 'bonsoir', 'merci', 'je', 'vous', 'nous', 'est', 'pour', 'avec', 'rendez-vous', 'svp', 'combien', 'quand', 'où', 'oui', 'le', 'la', 'les', 'des', 'une', 'suis', 'voudrais', 'pouvez', "c'est", 'aujourd’hui', 'demain'],
  en: ['the', 'is', 'are', 'what', 'when', 'where', 'how', 'can', 'i', 'you', 'my', 'please', 'thanks', 'thank', 'hello', 'hi', 'book', 'appointment', 'price', 'open', 'want', 'need', 'do', 'have', 'today', 'tomorrow'],
}

/**
 * Best-effort language guess for a customer message. Returns a language code
 * or null when the text is too short or ambiguous (the model then decides).
 */
function detectLanguage(text) {
  const value = String(text || '')
  if (!value.trim()) return null
  if (/[ሀ-፿ᎀ-᎟ⶀ-⷟]/.test(value)) return 'am'
  // Urdu / Persian letters share the Arabic block — let the model pick the language instead of forcing Arabic.
  if (/[ٹڈڑںےۓہھپچژگکی]/.test(value)) return null
  if (/[؀-ۿݐ-ݿ]/.test(value)) return 'ar'
  const tokens = value.toLowerCase().normalize('NFC').split(/[^a-zà-ÿ’'-]+/).filter(Boolean)
  if (!tokens.length) return null
  const scores = Object.fromEntries(
    Object.entries(WORDS).map(([code, list]) => [code, tokens.reduce((sum, word) => sum + (list.includes(word) ? 1 : 0), 0)]),
  )
  // Afar and Somali share letters (c, x, q) and some short words; long vowels
  // "aa/ee/oo" plus Afar-only words tip the balance.
  const ranked = Object.entries(scores).sort((a, b) => b[1] - a[1])
  const [bestCode, bestScore] = ranked[0]
  if (bestScore === 0) return null
  if (ranked[1] && ranked[1][1] === bestScore) return null
  return bestCode
}

/** Delivery hint for the text-to-speech voice. */
function speechInstructions(lang) {
  const code = lang && LANGUAGES[normalizeLanguage(lang, '')] ? normalizeLanguage(lang) : null
  const target = code ? `${LANGUAGES[code].name} (${LANGUAGES[code].native})` : 'the same language as the text'
  return `Speak in ${target} with natural, native pronunciation. Warm, friendly and clear, like a helpful receptionist. Read numbers, prices and times the way a native speaker says them.`
}

/** Chat model for a reply language: Somali, Amharic and Afar need a stronger model to stay in-language. */
function chatModelFor(lang) {
  const base = process.env.OPENAI_MODEL || 'gpt-4o-mini'
  const code = lang ? normalizeLanguage(lang) : null
  if (code && LANGUAGES[code].lowResource) return process.env.OPENAI_MODEL_MULTILINGUAL || 'gpt-4.1'
  return base
}

/** Instructions appended to every AI system prompt. */
function languageRules({ defaultLanguage = DEFAULT_LANGUAGE, detected = null, spoken = false } = {}) {
  const fallback = languageName(defaultLanguage)
  const list = ALL_CODES.map((code) => `${LANGUAGES[code].name} (${LANGUAGES[code].native})`).join(', ')
  const lines = [
    `LANGUAGE RULES (very important):`,
    `- You are fluent in: ${list}. English is the platform default.`,
    `- Detect the language of the customer's latest message and reply ENTIRELY in that same language. Do not mix languages and do not switch unless the customer switches.`,
    `- Amharic: always write in Ethiopic (Ge'ez) script, e.g. "ሰላም! እንዴት ልረዳዎት እችላለሁ?". Never answer an Amharic speaker in Latin letters.`,
    `- Afar (Qafar af): write in the official Latin Qafar orthography (c = ʕ, q = ʔ-like, x = ḍ, long vowels doubled). Never answer an Afar speaker in Somali, Amharic or Oromo: no Somali words (haddii, fadlan, waxaan, su'aalo) and no Ethiopic letters in an Afar reply.`,
    `- Somali: standard Latin Somali orthography (c, x, q, doubled long vowels).`,
    `- Arabic: Modern Standard Arabic unless the customer clearly writes in a dialect.`,
    `- The business knowledge may be written in English or another language. Translate the facts faithfully into the customer's language; keep prices, numbers, names, phone numbers, emails and links exactly as written.`,
    `- Any other language works the same way: if the customer writes or speaks Urdu, Hindi, Oromo, Tigrinya, Swahili, Turkish or anything else, reply in that language.`,
    `- If the message has no clear language (only a number, emoji or a name), reply in ${fallback}.`,
  ]
  if (detected && LANGUAGES[detected]) {
    lines.push(`- The customer's latest message appears to be in ${LANGUAGES[detected].name}. Reply in ${LANGUAGES[detected].name} unless the message is clearly another language.`)
  }
  if (spoken) {
    lines.push(`- This text will be read aloud by a voice engine: write numbers and times in a way that sounds natural in the customer's language.`)
  }
  return lines.join('\n')
}

/** Fixed system phrases. Afar is filled at runtime by the model (see localizePhrase in server.js). */
const PHRASES = {
  followUp: {
    en: 'Thank you for your message. A team member will follow up shortly.',
    fr: 'Merci pour votre message. Un membre de l’équipe vous répondra rapidement.',
    ar: 'شكرًا على رسالتك. سيتواصل معك أحد أعضاء الفريق قريبًا.',
    so: 'Mahadsanid fariintaada. Xubin ka mid ah kooxda ayaa dhowaan kula soo xiriiri doona.',
    am: 'ስለ መልእክትዎ እናመሰግናለን። ከቡድናችን አንድ አባል በቅርቡ ያገኝዎታል።',
  },
  thanks: {
    en: 'Thanks — we will get back to you.',
    fr: 'Merci — nous revenons vers vous rapidement.',
    ar: 'شكرًا — سنعود إليك قريبًا.',
    so: 'Mahadsanid — dhowaan ayaan kuu soo jawaabi doonnaa.',
    am: 'እናመሰግናለን — በቅርቡ እንመልስልዎታለን።',
  },
  trouble: {
    en: 'Sorry, I am having a little trouble right now. Please send that again in a moment.',
    fr: 'Désolé, je rencontre un petit problème. Merci de renvoyer votre message dans un instant.',
    ar: 'عذرًا، أواجه مشكلة بسيطة الآن. يرجى إرسال رسالتك مرة أخرى بعد قليل.',
    so: 'Raali ahow, hadda dhib yar ayaa i haysta. Fadlan mar kale soo dir daqiiqad kadib.',
    am: 'ይቅርታ፣ አሁን ትንሽ ችግር አጋጥሞኛል። እባክዎ ትንሽ ቆይተው እንደገና ይላኩ።',
  },
  greeting: {
    en: 'Hello, thank you for calling. How can I help you today?',
    fr: 'Bonjour, merci de votre appel. Comment puis-je vous aider aujourd’hui ?',
    ar: 'مرحبًا، شكرًا لاتصالك. كيف يمكنني مساعدتك اليوم؟',
    so: 'Soo dhawow, mahadsanid wacitaankaaga. Sideen kuu caawin karaa maanta?',
    am: 'ሰላም፣ ስለደወሉ እናመሰግናለን። ዛሬ እንዴት ልረዳዎት እችላለሁ?',
  },
  outboundGreeting: {
    en: 'Hello, this is the AI receptionist calling. How can I help?',
    fr: 'Bonjour, ici la réceptionniste IA. Comment puis-je vous aider ?',
    ar: 'مرحبًا، معك موظفة الاستقبال الذكية. كيف يمكنني مساعدتك؟',
    so: 'Salaan, waxaa ku soo wacaya soo-dhoweeyaha AI. Sideen kuu caawin karaa?',
    am: 'ሰላም፣ የAI እንግዳ ተቀባይ ነኝ የምደውለው። እንዴት ልረዳዎት እችላለሁ?',
  },
  goodbye: {
    en: 'Thank you for calling. Goodbye.',
    fr: 'Merci de votre appel. Au revoir.',
    ar: 'شكرًا لاتصالك. مع السلامة.',
    so: 'Mahadsanid wacitaankaaga. Nabad gelyo.',
    am: 'ስለደወሉ እናመሰግናለን። ደህና ይሁኑ።',
  },
  hold: {
    en: 'Please hold while I connect you to the team.',
    fr: 'Veuillez patienter, je vous mets en relation avec l’équipe.',
    ar: 'يرجى الانتظار بينما أوصلك بالفريق.',
    so: 'Fadlan sug inta aan kugu xirayo kooxda.',
    am: 'እባክዎ ይጠብቁ፣ ከቡድናችን ጋር አገናኝዎታለሁ።',
  },
  cannotTransfer: {
    en: 'I cannot transfer this call right now. I will ask the team to call you back.',
    fr: 'Je ne peux pas transférer l’appel pour le moment. Je vais demander à l’équipe de vous rappeler.',
    ar: 'لا أستطيع تحويل المكالمة الآن. سأطلب من الفريق معاودة الاتصال بك.',
    so: 'Hadda ma wareejin karo wacitaanka. Waxaan kooxda ka codsan doonaa inay dib kuu soo wacaan.',
    am: 'አሁን ጥሪውን ማስተላለፍ አልችልም። ቡድኑ መልሶ እንዲደውልልዎ እጠይቃለሁ።',
  },
  didNotCatch: {
    en: 'Sorry, I did not catch that. How can I help?',
    fr: 'Désolé, je n’ai pas bien entendu. Comment puis-je vous aider ?',
    ar: 'عذرًا، لم أسمعك جيدًا. كيف يمكنني مساعدتك؟',
    so: 'Raali ahow, si fiican uma maqlin. Sideen kuu caawin karaa?',
    am: 'ይቅርታ፣ በደንብ አልሰማሁም። እንዴት ልረዳዎት እችላለሁ?',
  },
  tryAgain: {
    en: 'Let me try that again. How can I help?',
    fr: 'Je réessaie. Comment puis-je vous aider ?',
    ar: 'دعني أحاول مرة أخرى. كيف يمكنني مساعدتك؟',
    so: 'Aan mar kale isku dayo. Sideen kuu caawin karaa?',
    am: 'እንደገና ልሞክር። እንዴት ልረዳዎት እችላለሁ?',
  },
  leaveMessage: {
    en: 'Please leave a message after the tone.',
    fr: 'Veuillez laisser un message après le bip.',
    ar: 'يرجى ترك رسالة بعد سماع الصفارة.',
    so: 'Fadlan fariin ka tag codka kadib.',
    am: 'እባክዎ ከድምፁ በኋላ መልእክት ይተዉ።',
  },
  unavailable: {
    en: 'The receptionist is unavailable right now. Please try again later.',
    fr: 'La réception n’est pas disponible pour le moment. Veuillez réessayer plus tard.',
    ar: 'موظف الاستقبال غير متاح الآن. يرجى المحاولة لاحقًا.',
    so: 'Soo-dhoweeyaha hadda lama heli karo. Fadlan mar dambe isku day.',
    am: 'እንግዳ ተቀባዩ አሁን አይገኝም። እባክዎ ቆይተው ይሞክሩ።',
  },
  thankYouGoodbye: {
    en: 'Thank you. Goodbye.',
    fr: 'Merci. Au revoir.',
    ar: 'شكرًا لك. مع السلامة.',
    so: 'Mahadsanid. Nabad gelyo.',
    am: 'እናመሰግናለን። ደህና ይሁኑ።',
  },
  widgetGreeting: {
    en: 'Hi — I am the AI receptionist for {name}. How can I help?',
    fr: 'Bonjour — je suis la réceptionniste IA de {name}. Comment puis-je vous aider ?',
    ar: 'مرحبًا — أنا موظفة الاستقبال الذكية لدى {name}. كيف يمكنني مساعدتك؟',
    so: 'Salaan — waxaan ahay soo-dhoweeyaha AI ee {name}. Sideen kuu caawin karaa?',
    am: 'ሰላም — እኔ የ{name} AI እንግዳ ተቀባይ ነኝ። እንዴት ልረዳዎት እችላለሁ?',
  },
  widgetGreetingOpen: {
    en: 'Hi — I am the AI receptionist for {name}. Ask me anything and I will pass it to the team if I do not know.',
    fr: 'Bonjour — je suis la réceptionniste IA de {name}. Posez-moi vos questions ; si je ne sais pas, je transmets à l’équipe.',
    ar: 'مرحبًا — أنا موظفة الاستقبال الذكية لدى {name}. اسألني أي شيء، وإن لم أعرف الإجابة سأحوّلها إلى الفريق.',
    so: 'Salaan — waxaan ahay soo-dhoweeyaha AI ee {name}. I weydii wax kasta; haddii aanan garanayn, kooxda ayaan u gudbin doonaa.',
    am: 'ሰላም — እኔ የ{name} AI እንግዳ ተቀባይ ነኝ። ማንኛውንም ይጠይቁኝ፤ መልሱን ካላወቅሁ ለቡድኑ አስተላልፋለሁ።',
  },
  widgetHello: {
    en: 'Hello — how can I help you today?',
    fr: 'Bonjour — comment puis-je vous aider aujourd’hui ?',
    ar: 'مرحبًا — كيف يمكنني مساعدتك اليوم؟',
    so: 'Salaan — sideen kuu caawin karaa maanta?',
    am: 'ሰላም — ዛሬ እንዴት ልረዳዎት እችላለሁ?',
  },
  widgetSubtitle: {
    en: 'Chat or talk — trained on this business',
    fr: 'Écrivez ou parlez — formée sur cette entreprise',
    ar: 'اكتب أو تحدث — مدرّبة على هذا النشاط',
    so: 'Qor ama la hadal — lagu tababaray ganacsigan',
    am: 'ይጻፉ ወይም ይናገሩ — በዚህ ንግድ ላይ የሰለጠነ',
  },
  widgetPlaceholder: {
    en: 'Type a message…',
    fr: 'Écrivez un message…',
    ar: 'اكتب رسالة…',
    so: 'Qor fariin…',
    am: 'መልእክት ይጻፉ…',
  },
  widgetSend: { en: 'Send', fr: 'Envoyer', ar: 'إرسال', so: 'Dir', am: 'ላክ' },
  widgetConnecting: {
    en: 'Connecting voice…',
    fr: 'Connexion vocale…',
    ar: 'جارٍ الاتصال الصوتي…',
    so: 'Codka waa la xirayaa…',
    am: 'ድምፅ በመገናኘት ላይ…',
  },
  widgetVoiceHint: {
    en: 'Speak naturally. The 3D agent listens and replies in real time.',
    fr: 'Parlez naturellement. L’agent 3D écoute et répond en temps réel.',
    ar: 'تحدث بشكل طبيعي. الوكيل ثلاثي الأبعاد يستمع ويرد فورًا.',
    so: 'Si dabiici ah u hadal. Wakiilka 3D wuu dhageysanayaa oo isla markiiba ku jawaabayaa.',
    am: 'በተፈጥሮ ይናገሩ። የ3D ወኪሉ ያዳምጣል፣ ወዲያውኑም ይመልሳል።',
  },
  widgetEndVoice: { en: 'End voice', fr: 'Terminer la voix', ar: 'إنهاء الصوت', so: 'Jooji codka', am: 'ድምፅ አቁም' },
  widgetListening: { en: 'Listening…', fr: 'À l’écoute…', ar: 'أستمع…', so: 'Waan dhageysanayaa…', am: 'እያዳመጥኩ ነው…' },
  widgetThinking: { en: 'Thinking…', fr: 'Réflexion…', ar: 'أفكر…', so: 'Waan ka fikirayaa…', am: 'እያሰብኩ ነው…' },
  widgetSpeechTurns: {
    en: 'Hold on — using speech turns',
    fr: 'Un instant — mode tour de parole',
    ar: 'لحظة — سنتحدث بالتناوب',
    so: 'Sug — waxaan u hadlaynaa si isu xigta',
    am: 'ትንሽ ይጠብቁ — በተራ እንነጋገራለን',
  },
  widgetMicUnavailable: {
    en: 'Microphone or voice is unavailable',
    fr: 'Micro ou voix indisponible',
    ar: 'الميكروفون أو الصوت غير متاح',
    so: 'Makarafoonka ama codku lama heli karo',
    am: 'ማይክሮፎን ወይም ድምፅ አይገኝም',
  },
  couldNotHear: {
    en: 'I could not hear that. Please try again.',
    fr: 'Je n’ai pas pu entendre. Veuillez réessayer.',
    ar: 'لم أتمكن من سماع ذلك. يرجى المحاولة مرة أخرى.',
    so: 'Taas ma maqlin. Fadlan mar kale isku day.',
    am: 'ያንን መስማት አልቻልኩም። እባክዎ እንደገና ይሞክሩ።',
  },
}

/** Static phrase lookup; returns null when a translation is not bundled (e.g. Afar). */
function phrase(key, lang) {
  const row = PHRASES[key]
  if (!row) return null
  return row[normalizeLanguage(lang)] || null
}

/** True when a configured text is still the stock English phrase (so it can be localised). */
function isStockPhrase(key, text) {
  return !text || String(text).trim() === PHRASES[key]?.en
}

const HUMAN_WORDS = [
  // English / French
  'human', 'agent', 'person', 'operator', 'representative', 'transfer', 'real person', 'reception', 'humain', 'conseiller', 'opérateur',
  // Arabic
  'موظف', 'التحدث مع شخص', 'تحويل المكالمة', 'خدمة العملاء', 'انسان حقيقي', 'إنسان حقيقي',
  // Somali
  'shaqaale', 'qof la hadlo', 'qof dhab ah', 'wareeji', 'hawlwadeen',
  // Amharic
  'ኦፕሬተር', 'ከሰው ጋር', 'ሰው አናግሩኝ', 'ሠራተኛ', 'ሰራተኛ', 'አስተላልፉኝ', 'አገናኙኝ',
]

const HANGUP_WORDS = [
  'goodbye', 'good bye', 'bye', "that's all", 'that is all', 'no thanks', 'hang up', 'end call', 'end the call', 'au revoir',
  'مع السلامة', 'وداعا', 'وداعًا',
  'nabad gelyo', 'nabadgelyo', 'nabad galyo', 'waa intaas',
  'ደህና ሁን', 'ደህና ሁኚ', 'ደህና ይሁኑ', 'ቻው',
]

function includesWord(text, words) {
  const value = ` ${String(text || '').toLowerCase().replace(/[.,!?؟።፣]/g, ' ')} `
  return words.some((word) => {
    if (/^[a-z' ]+$/.test(word)) return value.includes(` ${word} `)
    return value.includes(word)
  })
}

function wantsHumanAny(text) {
  return includesWord(text, HUMAN_WORDS) || /\bspeak to (someone|a person|staff|manager)\b/i.test(String(text || ''))
}

function wantsHangupAny(text) {
  return includesWord(text, HANGUP_WORDS)
}

module.exports = {
  LANGUAGES,
  ALL_CODES,
  DEFAULT_LANGUAGE,
  normalizeLanguage,
  languageName,
  detectLanguage,
  languageRules,
  chatModelFor,
  speechInstructions,
  phrase,
  isStockPhrase,
  wantsHumanAny,
  wantsHangupAny,
}
