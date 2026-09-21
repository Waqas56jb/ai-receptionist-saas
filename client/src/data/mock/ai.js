/** AI option lists and empty defaults. Live knowledge and chats come from the API. */

export const aiConfig = {
  enabled: true,
  status: 'online',
  knowledgeMode: 'shared',
  promptMode: 'shared',
  defaultLanguage: 'en',
  supportedLanguages: ['en'],
  responseStyle: 'Balanced',
  personality: 'Professional',
  tone: 'Professional',
  responseLength: 'Balanced',
  humanHandoff: true,
  handoffNumber: '',
  businessHoursBehaviour: 'Answer questions, capture leads, no direct booking',
  afterHoursBehaviour: 'Answer questions, capture leads, no direct booking',
  lastTrainedAt: null,
}

export const prompts = {
  system: '',
  businessRules: '',
  restrictions: '',
  escalation: '',
  booking: '',
  leadQualification: '',
}

export const promptVersions = []

export const personalities = ['Professional', 'Friendly', 'Formal', 'Casual', 'Hospitality', 'Healthcare', 'Sales']
export const tones = ['Professional', 'Warm', 'Concise', 'Detailed']
export const responseLengths = ['Short', 'Balanced', 'Detailed']

export const knowledgeItems = []
export const knowledgeCategories = ['Business Info', 'FAQs', 'Services', 'Products', 'Policies', 'Documents', 'Website Content']
export const documents = []
export const websiteSources = []

export const channels = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    description: 'Reply to WhatsApp conversations instantly.',
    connected: false,
    enabled: true,
    configured: false,
    identifier: null,
    provider: 'WhatsApp',
    lastConnectedAt: null,
    route: '/app/whatsapp-agent',
  },
  {
    id: 'web',
    name: 'Website',
    description: 'Answer visitors on your own site with text or voice.',
    connected: false,
    enabled: true,
    configured: false,
    identifier: null,
    provider: 'Web widget',
    lastConnectedAt: null,
    route: '/app/website-widget',
  },
]

export const credentials = { whatsapp: [] }
export const webhookUrls = { whatsapp: '', web: '' }

export const voiceSettings = {}
export const voices = ['Aria — warm female', 'Elise — soft female', 'Julien — neutral male', 'Marcus — deep male', 'Nina — bright female']
export const voiceStyles = ['Conversational', 'Professional', 'Calm', 'Energetic']

export const whatsappSettings = {
  enabled: true,
  displayName: '',
  businessNumber: '',
  greeting: '',
  instructions: '',
  knowledgeSource: 'shared',
  promptSource: 'shared',
  language: 'en',
  tone: 'Professional',
  responseLength: 'Short',
  humanHandoff: true,
  respectBusinessHours: true,
  afterHoursMessage: '',
  automation: {
    autoReply: true,
    leadCapture: true,
    bookingEnquiries: true,
    faqHandling: true,
    humanEscalation: true,
  },
}

export const instagramSettings = {}

export const channelKnowledge = {
  whatsapp: { items: 0, updatedAt: null },
  web: { items: 0, updatedAt: null },
}

export const testResponses = []
export const testFallback = 'No matching knowledge yet. Add items in Knowledge Base to train replies.'
