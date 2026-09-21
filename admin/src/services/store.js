/**
 * In-session admin store. Starts empty so the console only shows live API data.
 */
import { clone } from './mockClient'

export const store = {
  admins: [],
  adminSessions: [],
  securityEvents: [],
  loginAttempts: [],

  businesses: [],
  businessNotes: {},

  users: [],
  userNotes: {},

  plans: [
    {
      id: 'plan_starter',
      name: 'Starter',
      description: 'For small businesses taking their first messages with AI.',
      monthlyPrice: 0,
      annualPrice: 0,
      trialDays: 14,
      status: 'Active',
      limits: { calls: 0, aiMinutes: 0, messages: 0, documents: 20, storageGb: 2, users: 3 },
      features: { voice: false, whatsapp: true, instagram: false, analytics: true, crm: true },
      subscribers: 0,
      mrr: 0,
      createdAt: null,
    },
    {
      id: 'plan_professional',
      name: 'Professional',
      description: 'For growing businesses handling customers across every channel.',
      monthlyPrice: 0,
      annualPrice: 0,
      trialDays: 14,
      status: 'Active',
      limits: { calls: 0, aiMinutes: 0, messages: 0, documents: 50, storageGb: 10, users: 10 },
      features: { voice: false, whatsapp: true, instagram: false, analytics: true, crm: true },
      subscribers: 0,
      mrr: 0,
      createdAt: null,
    },
    {
      id: 'plan_enterprise',
      name: 'Enterprise',
      description: 'For multi-location businesses and teams with custom requirements.',
      monthlyPrice: 0,
      annualPrice: 0,
      trialDays: 30,
      status: 'Active',
      limits: { calls: 0, aiMinutes: 0, messages: 0, documents: 500, storageGb: 100, users: 50 },
      features: { voice: false, whatsapp: true, instagram: false, analytics: true, crm: true },
      subscribers: 0,
      mrr: 0,
      createdAt: null,
    },
  ],
  subscriptions: [],
  payments: [],
  invoices: [],

  aiAgents: [],
  voice: [],
  whatsapp: [],
  instagram: [],
  conversations: [],
  calls: [],
  messages: [],
  transcripts: [],

  notifications: [],
  tickets: [],
  announcements: [],
  auditLogs: [],
  settings: {
    general: { platformName: 'DEVMARK Receptionist', supportEmail: '', contactEmail: '', timezone: 'Africa/Djibouti', currency: 'USD' },
    ai: { defaultLanguage: 'English', defaultPersonality: 'Professional', maxAiMinutesPerCall: 15, maxKnowledgeDocs: 500, provider: 'OpenAI' },
    communication: { voiceProvider: '', whatsappProvider: 'WhatsApp QR (live session)', instagramProvider: '', recordCalls: false, storeTranscripts: false },
    billing: { currency: 'USD', taxRate: 0, taxLabel: 'Tax', invoicePrefix: 'INV', dunningRetries: 3 },
    notifications: { failedPayments: true, newBusiness: true, usageAlerts: true, aiErrors: true, weeklyDigest: false },
    security: { minPasswordLength: 12, requireTwoFactor: false, sessionHours: 12, lockoutAttempts: 5 },
  },
  integrations: [],
  featureFlags: [
    { id: 'whatsapp', name: 'WhatsApp', description: 'WhatsApp Business messaging.', enabled: true, plans: ['Starter', 'Professional', 'Enterprise'] },
    { id: 'web', name: 'Website widget', description: 'Embedded text and voice agent.', enabled: true, plans: ['Starter', 'Professional', 'Enterprise'] },
    { id: 'crm', name: 'CRM', description: 'Contacts and lead pipeline.', enabled: true, plans: ['Starter', 'Professional', 'Enterprise'] },
    { id: 'analytics', name: 'Analytics', description: 'Business-level reporting.', enabled: true, plans: ['Professional', 'Enterprise'] },
    { id: 'ai-training', name: 'AI training', description: 'Document upload and website import.', enabled: true, plans: ['Starter', 'Professional', 'Enterprise'] },
  ],
  maintenance: { enabled: false, message: '' },
}

export const businessData = {
  industries: [
    'Bank',
    'Microfinance Institution',
    'Insurance Company',
    'Hospital',
    'Medical Clinic',
    'Pharmacy',
    'Restaurant',
    'Café',
    'Hotel',
    'University',
    'Training Center',
    'Supermarket',
    'Telecommunications',
    'IT Company',
    'Logistics Company',
    'Travel Agency',
    'Construction Company',
    'Law Firm',
    'Government Institution',
    'Real Estate Agency',
  ],
  statuses: ['Active', 'Pending', 'Suspended', 'Blocked'],
  businessStatuses: ['Active', 'Trial', 'Suspended', 'Pending', 'Deleted'],
}
export const userData = {
  statuses: ['Active', 'Invited', 'Suspended', 'Blocked'],
  roles: ['Owner', 'Admin', 'Manager', 'Agent / Staff'],
  userRoles: ['Owner', 'Admin', 'Manager', 'Agent / Staff'],
  userStatuses: ['Active', 'Invited', 'Suspended', 'Blocked'],
  userLoginHistory: {},
}
export const revenueData = {
  plans: [],
  subscriptionStatuses: ['Active', 'Trial', 'Past Due', 'Cancelled', 'Suspended', 'Expired'],
  paymentStatuses: ['Successful', 'Pending', 'Failed', 'Refunded'],
  invoiceStatuses: ['Paid', 'Open', 'Overdue', 'Void', 'Refunded'],
}
export const commsData = {}
export const platformData = {
  ticketStatuses: ['Open', 'In Progress', 'Waiting', 'Resolved', 'Closed'],
  ticketPriorities: ['Low', 'Medium', 'High', 'Urgent'],
}

export function writeAudit({ admin, action, resource, resourceId, resourceName, detail, result = 'Success' }) {
  store.auditLogs = [
    {
      id: `log_${Date.now()}`,
      admin: admin || 'Admin',
      adminId: null,
      action,
      resource,
      resourceId,
      resourceName,
      ip: '',
      at: new Date().toISOString(),
      result,
      detail,
    },
    ...store.auditLogs,
  ]
}

export { clone }
