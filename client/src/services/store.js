/**
 * In-memory session store seeded from the mock data files. Edits made in the
 * portal survive navigation for the length of the browser session, which is
 * what makes the demo feel like a real product.
 */
import * as biz from '../data/mock/business'
import * as ai from '../data/mock/ai'
import * as comms from '../data/mock/communication'
import * as crm from '../data/mock/crm'
import * as insights from '../data/mock/insights'
import * as platform from '../data/mock/platform'
import { clone } from './mockClient'

export const store = {
  business: clone(biz.business),
  businessHours: clone(biz.businessHours),
  services: clone(biz.services),
  products: clone(biz.products),
  policies: clone(biz.policies),
  bookingRules: clone(biz.bookingRules),
  amenities: clone(biz.amenities),
  user: clone(biz.currentUser),
  team: clone(biz.teamMembers),
  sessions: clone(biz.sessions),
  loginHistory: clone(biz.loginHistory),

  aiConfig: clone(ai.aiConfig),
  prompts: clone(ai.prompts),
  promptVersions: clone(ai.promptVersions),
  knowledgeItems: clone(ai.knowledgeItems),
  documents: clone(ai.documents),
  websiteSources: clone(ai.websiteSources),
  channels: clone(ai.channels),
  credentials: clone(ai.credentials),
  voiceSettings: clone(ai.voiceSettings),
  whatsappSettings: clone(ai.whatsappSettings),
  instagramSettings: clone(ai.instagramSettings),

  conversations: clone(comms.conversations),
  calls: clone(comms.calls),
  messages: clone(comms.messages),
  transcripts: clone(comms.transcripts),

  contacts: clone(crm.contacts),
  leads: clone(crm.leads),
  bookings: clone(crm.bookings),

  subscription: clone(insights.subscription),
  invoices: clone(insights.invoices),
  usage: clone(insights.usage),

  notifications: clone(platform.notifications),
  notificationPreferences: clone(platform.notificationPreferences),
}

export { biz, ai, comms, crm, insights, platform }
