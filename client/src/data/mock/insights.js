/** Analytics labels and plan catalog. Live KPIs come from the API. */

export const dateRanges = [
  { id: 'today', label: 'Today' },
  { id: '7d', label: '7 days' },
  { id: '30d', label: '30 days' },
  { id: '90d', label: '90 days' },
  { id: 'custom', label: 'Custom' },
]

export const timeseries = {
  today: [],
  '7d': [],
  '30d': [],
  '90d': [],
  custom: [],
}

export const summary = {
  today: { calls: 0, messages: 0, conversations: 0, leads: 0, bookings: 0, missedCalls: 0, aiResolution: 0, handoff: 0, avgDuration: 0, activeChannels: 0, whatsapp: 0, web: 0 },
  '7d': { calls: 0, messages: 0, conversations: 0, leads: 0, bookings: 0, missedCalls: 0, aiResolution: 0, handoff: 0, avgDuration: 0, activeChannels: 0, whatsapp: 0, web: 0 },
  '30d': { calls: 0, messages: 0, conversations: 0, leads: 0, bookings: 0, missedCalls: 0, aiResolution: 0, handoff: 0, avgDuration: 0, activeChannels: 0, whatsapp: 0, web: 0 },
  '90d': { calls: 0, messages: 0, conversations: 0, leads: 0, bookings: 0, missedCalls: 0, aiResolution: 0, handoff: 0, avgDuration: 0, activeChannels: 0, whatsapp: 0, web: 0 },
  custom: { calls: 0, messages: 0, conversations: 0, leads: 0, bookings: 0, missedCalls: 0, aiResolution: 0, handoff: 0, avgDuration: 0, activeChannels: 0, whatsapp: 0, web: 0 },
}

export const channelBreakdown = [
  { name: 'WhatsApp', value: 0, color: '#FF7A00' },
  { name: 'Website', value: 0, color: '#60a5fa' },
]

export const handlingBreakdown = [
  { name: 'Handled by AI', value: 0, color: '#0066FF' },
  { name: 'Human handoff', value: 0, color: '#8494ac' },
]

export const languageBreakdown = []
export const peakHours = []
export const channelPerformance = [
  { channel: 'WhatsApp', conversations: 0, aiResolved: 0, leads: 0, avgResponse: '—' },
  { channel: 'Website', conversations: 0, aiResolved: 0, leads: 0, avgResponse: '—' },
]

export const usage = {
  planName: 'Starter',
  cycleStart: null,
  cycleEnd: null,
  metrics: [],
}

export const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 'Coming soon',
    description: 'For small businesses taking their first messages with AI.',
    features: ['WhatsApp and website widget', 'Business knowledge base', 'Conversation history', 'Email support'],
    current: true,
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 'Coming soon',
    description: 'For growing businesses handling customers across every channel.',
    features: ['Higher message limits', 'Contacts & leads', 'Advanced AI training', 'Priority support'],
    current: false,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Talk to sales',
    description: 'For multi-location businesses and teams with custom requirements.',
    features: ['Multiple locations', 'Custom usage limits', 'Custom onboarding', 'Dedicated account support'],
    current: false,
  },
]

export const subscription = {
  plan: 'Starter',
  status: 'Active',
  billingCycle: 'Monthly',
  renewsOn: null,
  seats: 1,
  paymentMethod: null,
}

export const invoices = []
