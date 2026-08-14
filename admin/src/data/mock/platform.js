export const platformSummary = {
  businesses: { total: 15, active: 11, trial: 2, suspended: 2, pending: 1, newThisMonth: 3 },
  users: { total: 20, active: 16, invited: 2, suspended: 1, blocked: 1, newThisMonth: 4 },
  revenue: { mrr: 2585, arr: 31020, totalRevenue: 41870, currentMonth: 2585, previousMonth: 2356, growthPct: 9.7 },
  ai: { calls: 11248, minutes: 30840, messages: 24160, conversations: 35408, resolutionRate: 91.4 },
  channels: { voice: 8, whatsapp: 7, instagram: 5, web: 6 },
}

export const growthSeries = [
  { date: 'Mar', businesses: 4, users: 6, revenue: 632, calls: 1420, messages: 2100, minutes: 3800 },
  { date: 'Apr', businesses: 6, users: 9, revenue: 869, calls: 2140, messages: 3240, minutes: 5600 },
  { date: 'May', businesses: 8, users: 12, revenue: 1176, calls: 3010, messages: 4680, minutes: 7900 },
  { date: 'Jun', businesses: 10, users: 15, revenue: 1682, calls: 4120, messages: 6320, minutes: 10400 },
  { date: 'Jul', businesses: 13, users: 18, revenue: 2356, calls: 5480, messages: 8940, minutes: 14200 },
  { date: 'Aug', businesses: 15, users: 20, revenue: 2585, calls: 6180, messages: 10420, minutes: 16100 },
]

export const revenueByPlan = [
  { name: 'Professional', value: 1192, color: '#2F4EDB' },
  { name: 'Enterprise', value: 998, color: '#6E8FFA' },
  { name: 'Starter', value: 395, color: '#9AB4FF' },
]

export const channelDistribution = [
  { name: 'Voice', value: 8, color: '#2F4EDB' },
  { name: 'WhatsApp', value: 7, color: '#10B981' },
  { name: 'Web', value: 6, color: '#38BDF8' },
  { name: 'Instagram', value: 5, color: '#D946EF' },
]

export const subscriptionMovement = [
  { date: 'Mar', new: 2, upgrades: 0, downgrades: 0, churn: 0 },
  { date: 'Apr', new: 2, upgrades: 1, downgrades: 0, churn: 0 },
  { date: 'May', new: 2, upgrades: 1, downgrades: 1, churn: 0 },
  { date: 'Jun', new: 2, upgrades: 2, downgrades: 0, churn: 1 },
  { date: 'Jul', new: 3, upgrades: 1, downgrades: 1, churn: 1 },
  { date: 'Aug', new: 2, upgrades: 2, downgrades: 0, churn: 1 },
]

export const platformHealth = [
  { id: 'api', name: 'API', status: 'Operational', detail: 'p95 latency 142 ms', uptime: '99.98%' },
  { id: 'ai', name: 'AI service', status: 'Operational', detail: 'Average response 1.4 s', uptime: '99.95%' },
  { id: 'voice', name: 'Voice (Twilio)', status: 'Warning', detail: 'Elevated webhook errors for 1 business', uptime: '99.61%' },
  { id: 'whatsapp', name: 'WhatsApp (Meta)', status: 'Warning', detail: '1 account has an expired token', uptime: '99.80%' },
  { id: 'instagram', name: 'Instagram (Meta)', status: 'Operational', detail: 'All accounts responding', uptime: '99.92%' },
  { id: 'database', name: 'Database', status: 'Operational', detail: 'Replication lag 40 ms', uptime: '99.99%' },
  { id: 'queue', name: 'Job queue', status: 'Operational', detail: '18 jobs pending', uptime: '99.97%' },
]

export const recentActivity = [
  { id: 'act_1', type: 'business.created', title: 'New business registered', subject: 'Coastline Surf School', actor: 'System', at: '2026-08-13T16:40:00Z' },
  { id: 'act_2', type: 'subscription.started', title: 'Subscription started', subject: 'Studio Belle Peau — Starter trial', actor: 'System', at: '2026-08-02T11:30:00Z' },
  { id: 'act_3', type: 'business.suspended', title: 'Business suspended', subject: 'AutoPrime Garage', actor: 'Tomás Oliveira', at: '2026-08-01T09:00:00Z' },
  { id: 'act_4', type: 'channel.connected', title: 'WhatsApp connected', subject: 'Maison Fleurie', actor: 'System', at: '2026-07-30T14:12:00Z' },
  { id: 'act_5', type: 'subscription.upgraded', title: 'Subscription upgraded', subject: 'Karim Consulting — Professional to Enterprise', actor: 'Tomás Oliveira', at: '2026-07-24T10:05:00Z' },
  { id: 'act_6', type: 'user.created', title: 'New user registered', subject: 'Lucas Silva — Harbour View Hotel', actor: 'System', at: '2026-08-10T13:00:00Z' },
  { id: 'act_7', type: 'business.suspended', title: 'Business suspended', subject: 'Riverside Vets', actor: 'Amara Okafor', at: '2026-08-06T11:20:00Z' },
  { id: 'act_8', type: 'channel.connected', title: 'Voice number connected', subject: 'Lakeview Dental', actor: 'System', at: '2026-05-14T10:22:00Z' },
  { id: 'act_9', type: 'subscription.cancelled', title: 'Subscription cancelled', subject: 'Coastline Surf School — trial expired', actor: 'System', at: '2026-08-14T00:05:00Z' },
  { id: 'act_10', type: 'ai.created', title: 'AI connection created', subject: 'Atelier Petit', actor: 'System', at: '2026-08-09T15:30:00Z' },
]

export const notifications = [
  { id: 'nt_1', type: 'business', title: 'New business registered', body: 'Coastline Surf School signed up on the Starter trial.', at: '2026-08-13T16:40:00Z', read: false, href: '/businesses/biz_7t04' },
  { id: 'nt_2', type: 'billing', title: 'Payment failed', body: 'AutoPrime Garage — card declined for the third time.', at: '2026-08-01T06:04:00Z', read: false, href: '/payments' },
  { id: 'nt_3', type: 'usage', title: 'Business exceeded usage', body: 'Alpine Chalet Rentals is at 91% of its plan allowance.', at: '2026-08-14T09:00:00Z', read: false, href: '/analytics/usage' },
  { id: 'nt_4', type: 'channel', title: 'WhatsApp connection failed', body: 'Maison Fleurie access token expired.', at: '2026-08-14T22:05:00Z', read: true, href: '/whatsapp' },
  { id: 'nt_5', type: 'ai', title: 'AI service warning', body: 'Voice webhooks returned 5xx twice for Lakeview Dental.', at: '2026-08-15T04:35:00Z', read: true, href: '/voice' },
  { id: 'nt_6', type: 'support', title: 'Support ticket created', body: 'Cedar Family Clinic raised a high-priority ticket.', at: '2026-08-15T06:12:00Z', read: false, href: '/support' },
  { id: 'nt_7', type: 'billing', title: 'Subscription cancelled', body: 'Coastline Surf School trial expired without conversion.', at: '2026-08-14T00:05:00Z', read: true, href: '/subscriptions' },
]

export const ticketStatuses = ['Open', 'In Progress', 'Waiting', 'Resolved', 'Closed']
export const ticketPriorities = ['Low', 'Medium', 'High', 'Urgent']

export const tickets = [
  {
    id: 'TCK-2041', businessId: 'biz_3a77', business: 'Cedar Family Clinic', user: 'Dr Nadia Haddad', subject: 'AI is quoting an old consultation price',
    priority: 'High', status: 'Open', assignee: 'Amara Okafor', createdAt: '2026-08-15T06:12:00Z', updatedAt: '2026-08-15T06:40:00Z',
    messages: [
      { id: 'tm_1', from: 'customer', author: 'Dr Nadia Haddad', at: '2026-08-15T06:12:00Z', text: 'Our AI keeps quoting €60 for a consultation but we raised it to €75 two weeks ago.' },
      { id: 'tm_2', from: 'admin', author: 'Amara Okafor', at: '2026-08-15T06:40:00Z', text: 'Thanks — it looks like an old PDF is still indexed. I will confirm which document to remove.' },
    ],
    notes: [{ id: 'tn_1', author: 'Amara Okafor', at: '2026-08-15T06:42:00Z', text: 'Knowledge base has two rate cards. Ask them to delete the 2025 one.' }],
  },
  { id: 'TCK-2040', businessId: 'biz_9w66', business: 'Maison Fleurie', user: 'Fatima Zahra', subject: 'WhatsApp stopped replying', priority: 'Urgent', status: 'In Progress', assignee: 'Hélène Bruneau', createdAt: '2026-08-14T22:10:00Z', updatedAt: '2026-08-15T05:02:00Z', messages: [{ id: 'tm_3', from: 'customer', author: 'Fatima Zahra', at: '2026-08-14T22:10:00Z', text: 'No messages have been answered since last night.' }], notes: [] },
  { id: 'TCK-2039', businessId: 'biz_4f31', business: 'AutoPrime Garage', user: 'Peter Janssen', subject: 'Account suspended after card change', priority: 'High', status: 'Waiting', assignee: 'Tomás Oliveira', createdAt: '2026-08-02T08:40:00Z', updatedAt: '2026-08-09T10:15:00Z', messages: [{ id: 'tm_4', from: 'customer', author: 'Peter Janssen', at: '2026-08-02T08:40:00Z', text: 'I updated my card but the account is still suspended.' }], notes: [] },
  { id: 'TCK-2038', businessId: 'biz_8f21', business: 'Harbour View Hotel', user: 'Camille Laurent', subject: 'How do I connect Instagram?', priority: 'Low', status: 'Resolved', assignee: 'Amara Okafor', createdAt: '2026-07-18T09:55:00Z', updatedAt: '2026-07-18T10:30:00Z', messages: [{ id: 'tm_5', from: 'customer', author: 'Camille Laurent', at: '2026-07-18T09:55:00Z', text: 'Where do I find the Instagram business account ID?' }], notes: [] },
  { id: 'TCK-2037', businessId: 'biz_9d04', business: 'Northlight Properties', user: 'Anna Novak', subject: 'Request for a second phone number', priority: 'Medium', status: 'Closed', assignee: 'Hélène Bruneau', createdAt: '2026-07-02T13:20:00Z', updatedAt: '2026-07-04T09:10:00Z', messages: [{ id: 'tm_6', from: 'customer', author: 'Anna Novak', at: '2026-07-02T13:20:00Z', text: 'Can we add a second number for the Gothenburg office?' }], notes: [] },
  { id: 'TCK-2036', businessId: 'biz_6a19', business: 'Lakeview Dental', user: 'Elena Rossi', subject: 'Calls dropping after 30 seconds', priority: 'Urgent', status: 'Open', assignee: null, createdAt: '2026-08-15T04:40:00Z', updatedAt: '2026-08-15T04:40:00Z', messages: [{ id: 'tm_7', from: 'customer', author: 'Elena Rossi', at: '2026-08-15T04:40:00Z', text: 'Several callers said the line went dead mid-conversation.' }], notes: [] },
]

export const announcements = [
  { id: 'ann_1', title: 'Scheduled maintenance — 24 August', message: 'The platform will be read-only between 02:00 and 04:00 CET while we upgrade the voice infrastructure.', type: 'Maintenance', audience: 'All businesses', start: '2026-08-20', end: '2026-08-24', status: 'Scheduled' },
  { id: 'ann_2', title: 'Instagram messaging is now available', message: 'Professional and Enterprise plans can now connect an Instagram business account.', type: 'Feature', audience: 'Professional', start: '2026-08-01', end: '2026-08-31', status: 'Published' },
  { id: 'ann_3', title: 'Update your WhatsApp access tokens', message: 'Meta is rotating long-lived tokens this month. Reconnect WhatsApp if messages stop arriving.', type: 'Important', audience: 'All businesses', start: '2026-08-10', end: '2026-09-10', status: 'Published' },
  { id: 'ann_4', title: 'New usage dashboard', message: 'You can now see call, message and AI-minute usage against your plan in real time.', type: 'Information', audience: 'All businesses', start: '2026-07-05', end: '2026-07-31', status: 'Archived' },
]

export const auditLogs = [
  { id: 'log_1', admin: 'Tomás Oliveira', adminId: 'adm_3', action: 'Suspended business', resource: 'Business', resourceId: 'biz_4f31', resourceName: 'AutoPrime Garage', ip: '188.250.•••.•••', at: '2026-08-01T09:00:00Z', result: 'Success', detail: 'Reason: payment failed three times' },
  { id: 'log_2', admin: 'Amara Okafor', adminId: 'adm_4', action: 'Suspended business', resource: 'Business', resourceId: 'biz_2r38', resourceName: 'Riverside Vets', ip: '102.89.•••.•••', at: '2026-08-06T11:20:00Z', result: 'Success', detail: 'Reason: reported misuse of AI transcripts' },
  { id: 'log_3', admin: 'Saqib Rahman', adminId: 'adm_1', action: 'Created sub-admin', resource: 'Admin', resourceId: 'adm_6', resourceName: 'Priya Deshmukh', ip: '103.244.•••.•••', at: '2026-08-11T09:10:00Z', result: 'Success', detail: 'Role: Custom Admin with 5 permissions' },
  { id: 'log_4', admin: 'Saqib Rahman', adminId: 'adm_1', action: 'Changed permissions', resource: 'Admin', resourceId: 'adm_3', resourceName: 'Tomás Oliveira', ip: '103.244.•••.•••', at: '2026-08-14T11:02:00Z', result: 'Success', detail: 'Granted billing.refunds' },
  { id: 'log_5', admin: 'Hélène Bruneau', adminId: 'adm_2', action: 'Disabled channel', resource: 'Channel', resourceId: 'ig_5', resourceName: 'Maison Fleurie — Instagram', ip: '92.184.•••.•••', at: '2026-08-10T12:00:00Z', result: 'Success', detail: 'Disabled pending token refresh' },
  { id: 'log_6', admin: 'Tomás Oliveira', adminId: 'adm_3', action: 'Changed plan', resource: 'Subscription', resourceId: 'sub_11', resourceName: 'Karim Consulting', ip: '188.250.•••.•••', at: '2026-07-24T10:05:00Z', result: 'Success', detail: 'Professional to Enterprise' },
  { id: 'log_7', admin: 'Amara Okafor', adminId: 'adm_4', action: 'Blocked user', resource: 'User', resourceId: 'usr_15', resourceName: 'Yanis Bouchard', ip: '102.89.•••.•••', at: '2026-08-06T11:22:00Z', result: 'Success', detail: 'Reason: under investigation' },
  { id: 'log_8', admin: 'Saqib Rahman', adminId: 'adm_1', action: 'Revoked session', resource: 'Admin', resourceId: 'adm_5', resourceName: 'Jonas Vogel', ip: '103.244.•••.•••', at: '2026-08-09T15:26:00Z', result: 'Success', detail: 'Account suspended' },
  { id: 'log_9', admin: 'Hélène Bruneau', adminId: 'adm_2', action: 'Support access started', resource: 'Business', resourceId: 'biz_9w66', resourceName: 'Maison Fleurie', ip: '92.184.•••.•••', at: '2026-08-15T05:02:00Z', result: 'Success', detail: 'Reason: investigating WhatsApp outage' },
  { id: 'log_10', admin: 'Tomás Oliveira', adminId: 'adm_3', action: 'Issued refund', resource: 'Payment', resourceId: 'pay_9', resourceName: 'Riverside Vets — €149', ip: '188.250.•••.•••', at: '2026-08-06T09:40:00Z', result: 'Success', detail: 'Goodwill refund during investigation' },
  { id: 'log_11', admin: 'Jonas Vogel', adminId: 'adm_5', action: 'Exported report', resource: 'Analytics', resourceId: 'rep_usage', resourceName: 'Usage export', ip: '91.64.•••.•••', at: '2026-07-29T13:10:00Z', result: 'Success', detail: 'CSV, 15 businesses' },
  { id: 'log_12', admin: 'Unknown', adminId: null, action: 'Failed sign-in', resource: 'Admin', resourceId: null, resourceName: 'unknown@example.com', ip: '45.12.•••.•••', at: '2026-08-15T03:18:00Z', result: 'Blocked', detail: '5 attempts in 2 minutes' },
]

export const platformSettings = {
  general: { platformName: 'DEVMARK Receptionist', supportEmail: 'support@devmark.example.com', contactEmail: 'hello@devmark.example.com', timezone: 'Europe/Paris', currency: 'EUR' },
  ai: { defaultLanguage: 'English', defaultPersonality: 'Professional', maxAiMinutesPerCall: 15, maxKnowledgeDocs: 500, provider: 'Managed AI provider' },
  communication: { voiceProvider: 'Twilio', whatsappProvider: 'Meta WhatsApp Business', instagramProvider: 'Meta Instagram Messaging', recordCalls: true, storeTranscripts: true },
  billing: { currency: 'EUR', taxRate: 20, taxLabel: 'VAT', invoicePrefix: 'INV', dunningRetries: 3 },
  notifications: { failedPayments: true, newBusiness: true, usageAlerts: true, aiErrors: true, weeklyDigest: true },
  security: { minPasswordLength: 12, requireTwoFactor: true, sessionHours: 12, lockoutAttempts: 5 },
}

export const integrations = [
  { id: 'stripe', name: 'Stripe', description: 'Subscriptions, payments and invoicing.', status: 'Connected', credential: 'sk_live_••••••••4D77', lastChecked: '2026-08-15T06:00:00Z' },
  { id: 'twilio', name: 'Twilio', description: 'Voice numbers and call handling.', status: 'Connected', credential: 'AC••••••••7C41', lastChecked: '2026-08-15T06:00:00Z' },
  { id: 'meta', name: 'Meta', description: 'WhatsApp Business and Instagram messaging.', status: 'Warning', credential: 'EAA••••••••9K02', lastChecked: '2026-08-15T05:00:00Z', warning: 'One business token expired' },
  { id: 'email', name: 'Email delivery', description: 'Transactional email for the platform.', status: 'Connected', credential: 'SG.••••••••2B91', lastChecked: '2026-08-15T06:00:00Z' },
  { id: 'ai-provider', name: 'AI provider', description: 'Language model powering the receptionist.', status: 'Connected', credential: 'sk-••••••••8F21', lastChecked: '2026-08-15T06:00:00Z' },
  { id: 'storage', name: 'Object storage', description: 'Recordings, documents and exports.', status: 'Connected', credential: 'AKIA••••••••7Q10', lastChecked: '2026-08-15T06:00:00Z' },
]

export const featureFlags = [
  { id: 'voice', name: 'Voice', description: 'Phone answering through Twilio.', enabled: true, plans: ['Starter', 'Professional', 'Enterprise'] },
  { id: 'whatsapp', name: 'WhatsApp', description: 'WhatsApp Business messaging.', enabled: true, plans: ['Starter', 'Professional', 'Enterprise'] },
  { id: 'instagram', name: 'Instagram', description: 'Instagram direct messages.', enabled: true, plans: ['Professional', 'Enterprise'] },
  { id: 'crm', name: 'CRM', description: 'Contacts and lead pipeline.', enabled: true, plans: ['Starter', 'Professional', 'Enterprise'] },
  { id: 'bookings', name: 'Bookings', description: 'Booking capture and calendar sync.', enabled: true, plans: ['Professional', 'Enterprise'] },
  { id: 'analytics', name: 'Analytics', description: 'Business-level reporting.', enabled: true, plans: ['Professional', 'Enterprise'] },
  { id: 'ai-training', name: 'AI training', description: 'Document upload and website import.', enabled: true, plans: ['Starter', 'Professional', 'Enterprise'] },
  { id: 'prompt-editor', name: 'Prompt editor', description: 'Direct editing of system instructions.', enabled: false, plans: ['Enterprise'] },
]

export const maintenance = {
  enabled: false,
  message: 'We are performing scheduled maintenance. The portal will be back shortly.',
  start: '2026-08-24T02:00',
  end: '2026-08-24T04:00',
  audience: 'All businesses',
}
