/**
 * In-session store. Starts empty so the portal only shows real account data.
 */
import * as biz from '../data/mock/business'
import * as ai from '../data/mock/ai'
import * as crm from '../data/mock/crm'
import * as insights from '../data/mock/insights'
import * as platform from '../data/mock/platform'

const emptyHours = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => ({
  day,
  open: false,
  from: '09:00',
  to: '17:00',
  allDay: false,
}))

export const store = {
  business: {
    id: null,
    name: '',
    type: '',
    description: '',
    website: '',
    email: '',
    phone: '',
    address: '',
    country: '',
    timezone: '',
    logo: null,
    currency: 'USD',
    createdAt: null,
  },
  businessHours: emptyHours,
  services: [],
  products: [],
  policies: [],
  bookingRules: [],
  amenities: [],
  user: { id: null, name: '', email: '', role: 'Owner', phone: '', avatar: null, twoFactor: false },
  team: [],
  sessions: [],
  loginHistory: [],

  aiConfig: {
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
  },
  prompts: {
    system: '',
    businessRules: '',
    restrictions: '',
    escalation: '',
    booking: '',
    leadQualification: '',
  },
  promptVersions: [],
  knowledgeItems: [],
  documents: [],
  websiteSources: [],
  channels: [
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
    {
      id: 'voice',
      name: 'Voice',
      description: 'Answer inbound calls and place outbound calls with Twilio.',
      connected: false,
      enabled: true,
      configured: false,
      identifier: null,
      provider: 'Twilio',
      lastConnectedAt: null,
      route: '/app/voice-agent',
    },
  ],
  credentials: { whatsapp: [] },
  voiceSettings: {},
  whatsappSettings: {
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
  },
  instagramSettings: {},

  conversations: [],
  calls: [],
  messages: [],
  transcripts: [],

  contacts: [],
  leads: [],
  bookings: [],

  subscription: { plan: 'Starter', status: 'Active', billingCycle: 'Monthly', renewsOn: null, seats: 1, paymentMethod: null },
  invoices: [],
  usage: { planName: 'Starter', cycleStart: null, cycleEnd: null, metrics: [] },

  notifications: [],
  notificationPreferences: {
    email: { newLead: true, humanEscalation: true, aiError: true, usageLimit: true, weeklySummary: false },
    inApp: { newLead: true, humanEscalation: true, aiError: true },
  },
}

export { biz, ai, crm, insights, platform }
