/** Notifications, notification preferences and help content (demo data). */

export const notifications = [
  { id: 'nt_1', type: 'lead', title: 'New lead received', body: 'Daniel Reyes — same-day Deluxe King booking enquiry.', at: '2026-08-15T07:41:00Z', read: false, href: '/app/leads' },
  { id: 'nt_2', type: 'booking', title: 'New booking received', body: 'Junior Suite, 22–25 August, Priya Nair.', at: '2026-08-15T06:12:00Z', read: false, href: '/app/bookings' },
  { id: 'nt_3', type: 'ai', title: 'AI training completed', body: 'guest-policies.pdf finished indexing and is now live.', at: '2026-08-14T16:22:00Z', read: false, href: '/app/ai-training' },
  { id: 'nt_4', type: 'usage', title: 'Usage approaching limit', body: 'You have used 71% of this month\'s message allowance.', at: '2026-08-14T09:00:00Z', read: true, href: '/app/usage' },
  { id: 'nt_5', type: 'channel', title: 'WhatsApp connection successful', body: 'Your WhatsApp Business number is live and receiving messages.', at: '2026-08-02T08:22:00Z', read: true, href: '/app/whatsapp-agent' },
  { id: 'nt_6', type: 'escalation', title: 'Human escalation', body: 'Group booking enquiry from Sofia Lindqvist was transferred to your team.', at: '2026-08-14T15:03:00Z', read: true, href: '/app/conversations' },
  { id: 'nt_7', type: 'error', title: 'Document failed to process', body: 'conference-packages.csv could not be indexed. Try re-uploading it.', at: '2026-06-18T13:25:00Z', read: true, href: '/app/ai-training' },
]

export const notificationPreferences = {
  email: {
    newLead: true,
    newBooking: true,
    missedCall: true,
    humanEscalation: true,
    aiError: true,
    usageLimit: true,
    weeklySummary: true,
  },
  inApp: {
    newLead: true,
    newBooking: true,
    missedCall: false,
    humanEscalation: true,
    aiError: true,
    usageLimit: true,
  },
}

export const notificationLabels = {
  newLead: { title: 'New lead', description: 'When the AI captures and qualifies a new lead.' },
  newBooking: { title: 'New booking', description: 'When a booking is created from any channel.' },
  missedCall: { title: 'Missed call', description: 'When a call is not answered or goes to voicemail.' },
  humanEscalation: { title: 'Human escalation', description: 'When the AI transfers a conversation to your team.' },
  aiError: { title: 'AI error', description: 'When training fails or a channel stops responding.' },
  usageLimit: { title: 'Usage limit', description: 'When you reach 80% and 100% of a plan allowance.' },
  weeklySummary: { title: 'Weekly summary', description: 'A Monday digest of calls, messages, leads and bookings.' },
}

export const helpArticles = [
  { id: 'h1', category: 'Getting started', title: 'Setting up your AI receptionist', description: 'Business profile, hours and your first knowledge upload.', minutes: 6 },
  { id: 'h2', category: 'Getting started', title: 'Connecting your phone number', description: 'Forward an existing number or use a new Twilio number.', minutes: 8 },
  { id: 'h3', category: 'AI training', title: 'Writing effective system instructions', description: 'How prompt structure changes the way your AI answers.', minutes: 10 },
  { id: 'h4', category: 'AI training', title: 'Shared vs channel-specific configuration', description: 'When to split knowledge and prompts per channel.', minutes: 5 },
  { id: 'h5', category: 'Channels', title: 'Connecting WhatsApp Business', description: 'Meta app setup, phone number ID and webhook verification.', minutes: 12 },
  { id: 'h6', category: 'Channels', title: 'Connecting Instagram messaging', description: 'Linking a professional account and granting permissions.', minutes: 9 },
  { id: 'h7', category: 'CRM', title: 'Working with leads and bookings', description: 'Lead scoring, statuses and moving deals forward.', minutes: 7 },
  { id: 'h8', category: 'Account', title: 'Roles and team permissions', description: 'What each role can see and change in the portal.', minutes: 4 },
]

export const faqs = [
  { id: 'f1', q: 'Do my customers need to install an app?', a: 'No. They call or message you exactly as they do today — the AI answers on your existing phone number and messaging accounts.' },
  { id: 'f2', q: 'What happens outside business hours?', a: 'You decide. The AI can answer everything, or only answer questions and capture leads without confirming bookings.' },
  { id: 'f3', q: 'Can I take over a conversation myself?', a: 'Yes. Open any conversation and choose Human takeover — the AI stops replying immediately on that thread.' },
  { id: 'f4', q: 'Where does the AI get its answers?', a: 'Only from your knowledge base: the business information you enter, documents you upload and pages you import from your website.' },
  { id: 'f5', q: 'Is my data shared with other businesses?', a: 'No. Each business has its own isolated knowledge base and conversation history.' },
  { id: 'f6', q: 'Can each channel behave differently?', a: 'Yes. Choose channel-specific configuration to give Voice, WhatsApp and Instagram their own knowledge and prompts.' },
]

export const supportChannels = [
  { id: 's1', title: 'Email support', description: 'Answered within one business day.', action: 'support@example.com' },
  { id: 's2', title: 'Live chat', description: 'Monday to Friday, 09:00–18:00 CET.', action: 'Start a chat' },
  { id: 's3', title: 'Report an issue', description: 'Something broken? Send us the details.', action: 'Report issue' },
]
