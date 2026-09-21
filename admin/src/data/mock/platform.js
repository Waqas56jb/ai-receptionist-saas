export const platformSummary = {
  businesses: { total: 0, active: 0, trial: 0, suspended: 0, pending: 0, newThisMonth: 0 },
  users: { total: 0, active: 0, invited: 0, suspended: 0, blocked: 0, newThisMonth: 0 },
  revenue: { mrr: 0, arr: 0, totalRevenue: 0, currentMonth: 0, previousMonth: 0, growthPct: 0 },
  ai: { calls: 0, minutes: 0, messages: 0, conversations: 0, resolutionRate: 0 },
  channels: { voice: 0, whatsapp: 0, instagram: 0, web: 0 },
}

export const growthSeries = []
export const revenueByPlan = []
export const channelDistribution = [
  { name: 'WhatsApp', value: 0, color: '#FF7A00' },
  { name: 'Website', value: 0, color: '#60a5fa' },
]
export const subscriptionMovement = []
export const platformHealth = []
export const recentActivity = []
export const notifications = []

export const ticketStatuses = ['Open', 'In Progress', 'Waiting', 'Resolved', 'Closed']
export const ticketPriorities = ['Low', 'Medium', 'High', 'Urgent']
export const tickets = []
export const announcements = []
export const auditLogs = []

export const platformSettings = {
  general: { platformName: 'DEVMARK Receptionist', supportEmail: '', contactEmail: '', timezone: 'Africa/Djibouti', currency: 'USD' },
  ai: { defaultLanguage: 'English', defaultPersonality: 'Professional', maxAiMinutesPerCall: 15, maxKnowledgeDocs: 500, provider: 'OpenAI' },
  communication: { voiceProvider: '', whatsappProvider: 'WhatsApp QR (live session)', instagramProvider: '', recordCalls: false, storeTranscripts: false },
  billing: { currency: 'USD', taxRate: 0, taxLabel: 'Tax', invoicePrefix: 'INV', dunningRetries: 3 },
  notifications: { failedPayments: true, newBusiness: true, usageAlerts: true, aiErrors: true, weeklyDigest: false },
  security: { minPasswordLength: 12, requireTwoFactor: false, sessionHours: 12, lockoutAttempts: 5 },
}

export const integrations = []

export const featureFlags = [
  { id: 'whatsapp', name: 'WhatsApp', description: 'WhatsApp Business messaging.', enabled: true, plans: ['Starter', 'Professional', 'Enterprise'] },
  { id: 'web', name: 'Website widget', description: 'Embedded text and voice agent.', enabled: true, plans: ['Starter', 'Professional', 'Enterprise'] },
  { id: 'crm', name: 'CRM', description: 'Contacts and lead pipeline.', enabled: true, plans: ['Starter', 'Professional', 'Enterprise'] },
  { id: 'analytics', name: 'Analytics', description: 'Business-level reporting.', enabled: true, plans: ['Professional', 'Enterprise'] },
  { id: 'ai-training', name: 'AI training', description: 'Document upload and website import.', enabled: true, plans: ['Starter', 'Professional', 'Enterprise'] },
]

export const maintenance = {
  enabled: false,
  message: 'We are performing scheduled maintenance. The portal will be back shortly.',
  start: '',
  end: '',
  audience: 'All businesses',
}
