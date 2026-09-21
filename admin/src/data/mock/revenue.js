export const plans = [
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
]

export const subscriptionStatuses = ['Active', 'Trial', 'Past Due', 'Cancelled', 'Suspended', 'Expired']
export const subscriptions = []
export const paymentStatuses = ['Successful', 'Pending', 'Failed', 'Refunded']
export const payments = []
export const invoiceStatuses = ['Paid', 'Open', 'Overdue', 'Void', 'Refunded']
export const invoices = []
