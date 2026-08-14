/**
 * In-memory session store seeded from the mock files. Edits made in the console
 * survive navigation for the length of the browser session.
 */
import * as adminsData from '../data/mock/admins'
import * as businessData from '../data/mock/businesses'
import * as userData from '../data/mock/users'
import * as revenueData from '../data/mock/revenue'
import * as commsData from '../data/mock/comms'
import * as platformData from '../data/mock/platform'
import { clone } from './mockClient'

export const store = {
  admins: clone(adminsData.admins),
  adminSessions: clone(adminsData.adminSessions),
  securityEvents: clone(adminsData.securityEvents),
  loginAttempts: clone(adminsData.loginAttempts),

  businesses: clone(businessData.businesses),
  businessNotes: clone(businessData.businessNotes),

  users: clone(userData.users),
  userNotes: clone(userData.userNotes),

  plans: clone(revenueData.plans),
  subscriptions: clone(revenueData.subscriptions),
  payments: clone(revenueData.payments),
  invoices: clone(revenueData.invoices),

  aiAgents: clone(commsData.aiAgents),
  voice: clone(commsData.voiceConnections),
  whatsapp: clone(commsData.whatsappConnections),
  instagram: clone(commsData.instagramConnections),
  conversations: clone(commsData.conversations),
  calls: clone(commsData.calls),
  messages: clone(commsData.messages),
  transcripts: clone(commsData.transcripts),

  notifications: clone(platformData.notifications),
  tickets: clone(platformData.tickets),
  announcements: clone(platformData.announcements),
  auditLogs: clone(platformData.auditLogs),
  settings: clone(platformData.settings || platformData.platformSettings),
  integrations: clone(platformData.integrations),
  featureFlags: clone(platformData.featureFlags),
  maintenance: clone(platformData.maintenance),
}

export { adminsData, businessData, userData, revenueData, commsData, platformData }

/** Every destructive admin action writes a line here, as the real system will. */
export function writeAudit({ admin, action, resource, resourceId, resourceName, detail, result = 'Success' }) {
  store.auditLogs = [
    {
      id: `log_${Date.now()}`,
      admin: admin || 'Saqib Rahman',
      adminId: 'adm_1',
      action,
      resource,
      resourceId,
      resourceName,
      ip: '103.244.•••.•••',
      at: new Date().toISOString(),
      result,
      detail,
    },
    ...store.auditLogs,
  ]
}
