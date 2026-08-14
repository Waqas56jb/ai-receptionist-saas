/** AI configuration, knowledge base and channel agent settings (demo data). */

export const aiConfig = {
  enabled: true,
  status: 'online',
  knowledgeMode: 'shared', // 'shared' | 'separate'
  promptMode: 'shared', // 'shared' | 'separate'
  defaultLanguage: 'en',
  supportedLanguages: ['en', 'fr', 'de'],
  responseStyle: 'Balanced',
  personality: 'Hospitality',
  tone: 'Warm',
  responseLength: 'Balanced',
  humanHandoff: true,
  handoffNumber: '+33 4 91 22 18 40',
  businessHoursBehaviour: 'Answer everything and book directly',
  afterHoursBehaviour: 'Answer questions, capture leads, no direct booking',
  lastTrainedAt: '2026-08-14T16:20:00Z',
}

export const prompts = {
  system:
    'You are the AI receptionist for Harbour View Hotel, a 42-room boutique hotel on the old port in Marseille. Answer guest questions using only the information in the knowledge base. Be warm, concise and never invent availability or prices.',
  businessRules:
    'Always confirm the guest\'s dates before quoting a price.\nAlways mention that breakfast is included with Deluxe and Junior Suite rooms.\nAlways offer the airport transfer when a guest mentions a flight.',
  restrictions:
    'Never confirm a booking without the guest\'s full name and contact number.\nNever quote a discount that is not in the knowledge base.\nNever discuss other guests or share personal data.',
  escalation:
    'Transfer to a human when: the guest asks for a group booking of six rooms or more, mentions a complaint, asks about an existing reservation you cannot find, or asks twice for a person.',
  booking:
    'Collect: arrival date, departure date, number of guests, room preference, full name, phone and email. Confirm the total before creating the booking. Bookings over €500 need a 30% deposit.',
  leadQualification:
    'Collect: name, phone, email, travel dates, party size, reason for stay and how they found us. Mark the lead as qualified when dates and party size are known.',
}

export const promptVersions = [
  { id: 'v12', label: 'Version 12', current: true, author: 'Camille Laurent', createdAt: '2026-08-14T16:20:00Z', note: 'Added deposit rule for bookings over €500' },
  { id: 'v11', label: 'Version 11', current: false, author: 'Marc Dubois', createdAt: '2026-08-06T11:05:00Z', note: 'Softened the greeting, added spa upsell' },
  { id: 'v10', label: 'Version 10', current: false, author: 'Camille Laurent', createdAt: '2026-07-22T09:48:00Z', note: 'Escalation rules for complaints' },
  { id: 'v9', label: 'Version 9', current: false, author: 'Camille Laurent', createdAt: '2026-07-02T15:30:00Z', note: 'First multilingual version' },
]

export const personalities = ['Professional', 'Friendly', 'Formal', 'Casual', 'Hospitality', 'Healthcare', 'Sales']
export const tones = ['Professional', 'Warm', 'Concise', 'Detailed']
export const responseLengths = ['Short', 'Balanced', 'Detailed']

export const knowledgeItems = [
  { id: 'kb_1', title: 'Room types and rates 2026', category: 'Services', status: 'Active', source: 'Manual', updatedAt: '2026-08-12T10:20:00Z', body: 'Deluxe King €180, Twin Classic €145, Junior Suite €265. All rates include breakfast and city tax is €2.20 per person per night.' },
  { id: 'kb_2', title: 'Cancellation policy', category: 'Policies', status: 'Active', source: 'Document', updatedAt: '2026-07-28T10:00:00Z', body: 'Free cancellation up to 48 hours before arrival. Later cancellations are charged the first night.' },
  { id: 'kb_3', title: 'Is breakfast included?', category: 'FAQs', status: 'Active', source: 'Manual', updatedAt: '2026-08-01T08:15:00Z', body: 'Yes — breakfast is included with every room and served from 07:00 to 10:30 in the rooftop restaurant.' },
  { id: 'kb_4', title: 'Do you have parking?', category: 'FAQs', status: 'Active', source: 'Website', updatedAt: '2026-08-03T12:44:00Z', body: 'Private parking is available on site for €22 per night. Spaces must be reserved in advance.' },
  { id: 'kb_5', title: 'Spa day pass', category: 'Products', status: 'Active', source: 'Manual', updatedAt: '2026-07-19T16:00:00Z', body: 'Pool, sauna and hammam access for €45 per person, 10:00–20:00. Free for Junior Suite guests.' },
  { id: 'kb_6', title: 'Hotel description and amenities', category: 'Business Info', status: 'Active', source: 'Manual', updatedAt: '2026-06-30T09:00:00Z', body: '42 rooms, rooftop restaurant, spa, conference room for 24, 24h reception, pet friendly, free Wi-Fi.' },
  { id: 'kb_7', title: 'Airport transfer details', category: 'Services', status: 'Active', source: 'Manual', updatedAt: '2026-07-11T11:30:00Z', body: 'Private car to or from Marseille Provence Airport, €55 per trip, 25–40 minutes depending on traffic.' },
  { id: 'kb_8', title: 'Group booking rules', category: 'Policies', status: 'Draft', source: 'Manual', updatedAt: '2026-08-13T14:05:00Z', body: 'Six rooms or more must be handled by a human agent. Deposit of 30% applies.' },
  { id: 'kb_9', title: 'Restaurant opening hours', category: 'Business Info', status: 'Active', source: 'Website', updatedAt: '2026-08-03T12:44:00Z', body: 'Rooftop restaurant: breakfast 07:00–10:30, dinner 19:00–22:30. Closed Sunday evening.' },
  { id: 'kb_10', title: 'Late check-out', category: 'Products', status: 'Disabled', source: 'Manual', updatedAt: '2026-05-20T10:10:00Z', body: 'Check-out extended to 16:00 for €30, subject to availability.' },
]

export const knowledgeCategories = ['Business Info', 'FAQs', 'Services', 'Products', 'Policies', 'Documents', 'Website Content']

export const documents = [
  { id: 'doc_1', name: 'room-rates-2026.pdf', type: 'PDF', size: 421888, uploadedAt: '2026-08-12T10:18:00Z', status: 'Indexed', pages: 4 },
  { id: 'doc_2', name: 'guest-policies.pdf', type: 'PDF', size: 192512, uploadedAt: '2026-07-28T09:58:00Z', status: 'Indexed', pages: 2 },
  { id: 'doc_3', name: 'faq-common-questions.docx', type: 'DOCX', size: 98304, uploadedAt: '2026-08-01T08:12:00Z', status: 'Indexed', pages: 3 },
  { id: 'doc_4', name: 'restaurant-menu.pdf', type: 'PDF', size: 655360, uploadedAt: '2026-08-15T06:40:00Z', status: 'Processing', pages: 6 },
  { id: 'doc_5', name: 'conference-packages.csv', type: 'CSV', size: 20480, uploadedAt: '2026-06-18T13:22:00Z', status: 'Failed', pages: null },
]

export const websiteSources = [
  { id: 'web_1', url: 'https://harbourview.example.com', pages: 18, status: 'Indexed', importedAt: '2026-08-03T12:44:00Z' },
  { id: 'web_2', url: 'https://harbourview.example.com/spa', pages: 3, status: 'Indexed', importedAt: '2026-07-19T15:52:00Z' },
]

export const channels = [
  {
    id: 'voice',
    name: 'Voice',
    description: 'Answer business calls 24/7 with a natural voice.',
    connected: true,
    enabled: true,
    configured: true,
    identifier: '+33 4 91 22 18 40',
    provider: 'Twilio',
    lastConnectedAt: '2026-07-02T09:15:00Z',
    route: '/app/voice-agent',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    description: 'Reply to WhatsApp conversations instantly.',
    connected: true,
    enabled: true,
    configured: true,
    identifier: '+33 6 44 90 11 27',
    provider: 'Meta WhatsApp Business',
    lastConnectedAt: '2026-07-14T11:40:00Z',
    route: '/app/whatsapp-agent',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Handle direct messages from your Instagram profile.',
    connected: false,
    enabled: false,
    configured: false,
    identifier: null,
    provider: 'Meta Instagram Messaging',
    lastConnectedAt: null,
    route: '/app/instagram-agent',
  },
  {
    id: 'web',
    name: 'Website',
    description: 'Answer questions from visitors on your own site.',
    connected: true,
    enabled: true,
    configured: true,
    identifier: 'harbourview.example.com',
    provider: 'Web widget',
    lastConnectedAt: '2026-08-01T10:05:00Z',
    route: '/app/channels',
  },
]

/** Saved credentials are represented by masked previews only — never real values. */
export const credentials = {
  twilio: [
    { key: 'accountSid', label: 'Account SID', saved: true, preview: 'AC••••••••••7C41', updatedAt: '2026-07-02T09:15:00Z', hint: 'Starts with AC. Found on your Twilio console dashboard.' },
    { key: 'apiKeySid', label: 'API Key SID', saved: true, preview: 'SK••••••••••11B9', updatedAt: '2026-07-02T09:15:00Z', hint: 'Recommended for production instead of the Auth Token.' },
    { key: 'apiKeySecret', label: 'API Key Secret', saved: true, preview: 'sk_••••••••••8F21', updatedAt: '2026-07-02T09:15:00Z', hint: 'Shown by Twilio only once, when the key is created.' },
    { key: 'authToken', label: 'Auth Token', saved: false, preview: null, updatedAt: null, hint: 'Testing only — it grants full account access.' },
  ],
  whatsapp: [
    { key: 'metaAppId', label: 'Meta App ID', saved: true, preview: '••••••••3092', updatedAt: '2026-07-14T11:40:00Z', hint: 'From your Meta app dashboard.' },
    { key: 'metaAppSecret', label: 'Meta App Secret', saved: true, preview: 'sk_••••••••••4D77', updatedAt: '2026-07-14T11:40:00Z', hint: 'Treated as a secret and never displayed again.' },
    { key: 'wabaId', label: 'WhatsApp Business Account ID', saved: true, preview: '••••••••5521', updatedAt: '2026-07-14T11:40:00Z', hint: 'The WABA that owns your phone number.' },
    { key: 'phoneNumberId', label: 'Phone Number ID', saved: true, preview: '••••••••8814', updatedAt: '2026-07-14T11:40:00Z', hint: 'Numeric ID of the sending number, not the number itself.' },
    { key: 'accessToken', label: 'Access Token', saved: true, preview: 'EAA••••••••••9K02', updatedAt: '2026-08-02T08:20:00Z', hint: 'Use a permanent system-user token in production.' },
    { key: 'verifyToken', label: 'Webhook Verify Token', saved: true, preview: '••••••••A17F', updatedAt: '2026-07-14T11:40:00Z', hint: 'Any string you choose — Meta echoes it back to verify the webhook.' },
  ],
  instagram: [
    { key: 'metaAppId', label: 'Meta App ID', saved: false, preview: null, updatedAt: null, hint: 'From your Meta app dashboard.' },
    { key: 'metaAppSecret', label: 'Meta App Secret', saved: false, preview: null, updatedAt: null, hint: 'Treated as a secret and never displayed again.' },
    { key: 'igAccountId', label: 'Instagram Business Account ID', saved: false, preview: null, updatedAt: null, hint: 'The professional account linked to your Facebook Page.' },
    { key: 'pageId', label: 'Facebook Page ID', saved: false, preview: null, updatedAt: null, hint: 'The Page connected to the Instagram account.' },
    { key: 'accessToken', label: 'Access Token', saved: false, preview: null, updatedAt: null, hint: 'Page access token with instagram_manage_messages.' },
    { key: 'verifyToken', label: 'Webhook Verify Token', saved: false, preview: null, updatedAt: null, hint: 'Any string you choose — Meta echoes it back to verify the webhook.' },
  ],
}

export const webhookUrls = {
  voice: 'https://api.example.com/webhooks/twilio/voice/biz_8f21',
  whatsapp: 'https://api.example.com/webhooks/whatsapp/biz_8f21',
  instagram: 'https://api.example.com/webhooks/instagram/biz_8f21',
}

export const voiceSettings = {
  enabled: true,
  businessNumber: '+33 4 91 22 18 40',
  twilioNumber: '+33 9 87 65 43 21',
  callerId: 'Harbour View Hotel',
  voice: 'Aria — warm female',
  language: 'en',
  speakingSpeed: 1,
  voiceStyle: 'Conversational',
  greeting: 'Good day, Harbour View Hotel — how can I help you?',
  goodbye: 'Thank you for calling Harbour View Hotel. Have a lovely day.',
  interruptions: true,
  silenceTimeout: 6,
  autoAnswer: true,
  humanTransfer: true,
  voicemailFallback: true,
  recording: true,
  transcription: true,
  voiceInstructions:
    'Speak in short sentences. Confirm dates by repeating them back. If the line is unclear, ask the caller to repeat rather than guessing.',
  emergencyInstructions:
    'If a caller reports a fire, medical emergency or security incident, transfer immediately to +33 4 91 22 18 40 and do not continue the conversation.',
}

export const voices = [
  'Aria — warm female',
  'Elise — soft female',
  'Julien — neutral male',
  'Marcus — deep male',
  'Nina — bright female',
]

export const voiceStyles = ['Conversational', 'Professional', 'Calm', 'Energetic']

export const whatsappSettings = {
  enabled: true,
  displayName: 'Harbour View Hotel',
  businessNumber: '+33 6 44 90 11 27',
  greeting: 'Hello! You have reached Harbour View Hotel. How can I help you today?',
  instructions: 'Keep replies under three sentences. Use the guest\'s name once you know it. Send prices as a short list.',
  knowledgeSource: 'shared',
  promptSource: 'shared',
  language: 'en',
  tone: 'Warm',
  responseLength: 'Short',
  humanHandoff: true,
  respectBusinessHours: true,
  afterHoursMessage: 'Thanks for your message! Our team is offline right now, but I can still answer questions and take your details.',
  automation: {
    autoReply: true,
    leadCapture: true,
    bookingEnquiries: true,
    faqHandling: true,
    humanEscalation: true,
  },
}

export const instagramSettings = {
  enabled: false,
  accountHandle: '',
  greeting: 'Hi! Thanks for messaging Harbour View Hotel — how can I help?',
  instructions: 'Be friendly and brief. Point guests to the booking link when they are ready to book.',
  knowledgeSource: 'shared',
  promptSource: 'shared',
  language: 'en',
  tone: 'Friendly',
  responseLength: 'Short',
  humanHandoff: true,
  respectBusinessHours: false,
  automation: {
    dmAutoReply: true,
    faqResponses: true,
    leadCapture: true,
    productEnquiries: true,
    bookingEnquiries: true,
    humanEscalation: true,
  },
}

export const channelKnowledge = {
  voice: { items: 24, updatedAt: '2026-08-12T10:20:00Z' },
  whatsapp: { items: 18, updatedAt: '2026-08-09T14:02:00Z' },
  instagram: { items: 0, updatedAt: null },
}

/** Canned replies for the AI testing playground. */
export const testResponses = [
  {
    match: ['room', 'available', 'availability', 'book', 'night'],
    reply:
      'Yes — we have a Deluxe King Room available at €180 per night, breakfast included. Could you confirm your arrival and departure dates and how many guests will be staying?',
  },
  { match: ['breakfast'], reply: 'Breakfast is included with every room and is served in the rooftop restaurant from 07:00 to 10:30.' },
  { match: ['park', 'parking', 'car'], reply: 'We have private parking on site for €22 per night. I can reserve a space for you — shall I?' },
  { match: ['cancel', 'refund'], reply: 'Cancellation is free up to 48 hours before arrival. After that, the first night is charged.' },
  { match: ['pet', 'dog', 'cat'], reply: 'Small pets are very welcome at €20 per night, and assistance animals stay free of charge.' },
  { match: ['spa', 'pool', 'sauna'], reply: 'The spa day pass is €45 per person and includes the pool, sauna and hammam from 10:00 to 20:00.' },
  { match: ['airport', 'transfer', 'flight'], reply: 'We offer a private airport transfer for €55 each way. The journey takes 25 to 40 minutes depending on traffic.' },
  { match: ['check-in', 'check in', 'checkout', 'check-out'], reply: 'Check-in is from 15:00 and check-out is by 11:00. Late check-out until 16:00 is €30 when available.' },
  { match: ['group', 'wedding', 'conference'], reply: 'For six rooms or more I will pass you to a member of our team — may I take your name and number?' },
]

export const testFallback =
  'I could not find that in the knowledge base, so I would rather not guess. Would you like me to pass this to a member of the team?'
