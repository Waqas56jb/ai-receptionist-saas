/** Analytics, usage and billing (demo data). */

const days = [
  { date: '09 Aug', calls: 41, messages: 58, leads: 6, conversations: 82 },
  { date: '10 Aug', calls: 52, messages: 64, leads: 9, conversations: 94 },
  { date: '11 Aug', calls: 48, messages: 71, leads: 7, conversations: 101 },
  { date: '12 Aug', calls: 61, messages: 66, leads: 11, conversations: 108 },
  { date: '13 Aug', calls: 57, messages: 82, leads: 8, conversations: 116 },
  { date: '14 Aug', calls: 70, messages: 92, leads: 13, conversations: 131 },
  { date: '15 Aug', calls: 34, messages: 47, leads: 5, conversations: 62 },
]

const weeks = [
  { date: 'Wk 25', calls: 268, messages: 402, leads: 41, conversations: 620 },
  { date: 'Wk 26', calls: 291, messages: 437, leads: 46, conversations: 668 },
  { date: 'Wk 27', calls: 314, messages: 455, leads: 52, conversations: 702 },
  { date: 'Wk 28', calls: 302, messages: 488, leads: 49, conversations: 731 },
  { date: 'Wk 29', calls: 348, messages: 512, leads: 58, conversations: 786 },
  { date: 'Wk 30', calls: 361, messages: 540, leads: 61, conversations: 812 },
  { date: 'Wk 31', calls: 372, messages: 566, leads: 66, conversations: 848 },
  { date: 'Wk 32', calls: 363, messages: 580, leads: 59, conversations: 861 },
]

export const dateRanges = [
  { id: 'today', label: 'Today' },
  { id: '7d', label: '7 days' },
  { id: '30d', label: '30 days' },
  { id: '90d', label: '90 days' },
  { id: 'custom', label: 'Custom' },
]

export const timeseries = {
  today: days.slice(-1),
  '7d': days,
  '30d': weeks.slice(-4),
  '90d': weeks,
  custom: weeks.slice(-6),
}

export const summary = {
  today: { calls: 34, messages: 47, conversations: 62, leads: 5, bookings: 3, missedCalls: 1, aiResolution: 94, handoff: 6, avgDuration: 168, activeChannels: 3 },
  '7d': { calls: 363, messages: 480, conversations: 694, leads: 59, bookings: 24, missedCalls: 9, aiResolution: 92, handoff: 8, avgDuration: 182, activeChannels: 3 },
  '30d': { calls: 1444, messages: 2116, conversations: 3252, leads: 234, bookings: 96, missedCalls: 31, aiResolution: 91, handoff: 9, avgDuration: 176, activeChannels: 3 },
  '90d': { calls: 2619, messages: 3980, conversations: 6028, leads: 432, bookings: 178, missedCalls: 74, aiResolution: 90, handoff: 10, avgDuration: 179, activeChannels: 3 },
  custom: { calls: 2101, messages: 3141, conversations: 4808, leads: 349, bookings: 141, missedCalls: 58, aiResolution: 91, handoff: 9, avgDuration: 177, activeChannels: 3 },
}

export const channelBreakdown = [
  { name: 'Voice', value: 363, color: '#2F4EDB' },
  { name: 'WhatsApp', value: 288, color: '#10B981' },
  { name: 'Instagram', value: 96, color: '#D946EF' },
  { name: 'Website', value: 132, color: '#38BDF8' },
]

export const handlingBreakdown = [
  { name: 'Handled by AI', value: 92, color: '#2F4EDB' },
  { name: 'Human handoff', value: 8, color: '#94A3B8' },
]

export const languageBreakdown = [
  { name: 'English', value: 58, color: '#2F4EDB' },
  { name: 'French', value: 27, color: '#6E8FFA' },
  { name: 'German', value: 9, color: '#9AB4FF' },
  { name: 'Italian', value: 6, color: '#C2D3FF' },
]

export const peakHours = [
  { hour: '00', value: 4 }, { hour: '02', value: 2 }, { hour: '04', value: 1 }, { hour: '06', value: 6 },
  { hour: '08', value: 18 }, { hour: '10', value: 27 }, { hour: '12', value: 24 }, { hour: '14', value: 29 },
  { hour: '16', value: 33 }, { hour: '18', value: 31 }, { hour: '20', value: 22 }, { hour: '22', value: 12 },
]

export const channelPerformance = [
  { channel: 'Voice', conversations: 363, aiResolved: 94, leads: 28, avgResponse: '1.2s' },
  { channel: 'WhatsApp', conversations: 288, aiResolved: 91, leads: 19, avgResponse: '3.4s' },
  { channel: 'Instagram', conversations: 96, aiResolved: 88, leads: 7, avgResponse: '5.1s' },
  { channel: 'Website', conversations: 132, aiResolved: 93, leads: 5, avgResponse: '2.0s' },
]

/** Demo allowances only — real plan limits arrive with the backend. */
export const usage = {
  planName: 'Professional',
  cycleStart: '2026-08-01',
  cycleEnd: '2026-08-31',
  metrics: [
    { key: 'calls', label: 'Calls', used: 342, limit: 500, unit: 'calls' },
    { key: 'messages', label: 'Messages', used: 712, limit: 1000, unit: 'messages' },
    { key: 'aiMinutes', label: 'AI minutes', used: 180, limit: 300, unit: 'minutes' },
    { key: 'documents', label: 'Knowledge documents', used: 5, limit: 50, unit: 'documents' },
    { key: 'storage', label: 'Storage', used: 1.4, limit: 5, unit: 'GB' },
    { key: 'teamSeats', label: 'Team seats', used: 4, limit: 10, unit: 'seats' },
  ],
}

export const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 'Coming soon',
    description: 'For small businesses taking their first calls and messages with AI.',
    features: ['One channel', 'Business knowledge base', 'Conversation history', 'Email support'],
    current: false,
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 'Coming soon',
    description: 'For growing businesses handling customers across every channel.',
    features: ['Voice, WhatsApp, Instagram & web', 'Higher call and message limits', 'Contacts & leads', 'Advanced AI training', 'Priority support'],
    current: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Talk to sales',
    description: 'For multi-location businesses and teams with custom requirements.',
    features: ['Multiple locations & numbers', 'Custom usage limits', 'Custom onboarding', 'Dedicated account support'],
    current: false,
  },
]

export const subscription = {
  plan: 'Professional',
  status: 'Active',
  billingCycle: 'Monthly',
  renewsOn: '2026-09-01',
  seats: 10,
  paymentMethod: { brand: 'Visa', last4: '4242', expiry: '08/29' },
}

export const invoices = [
  { id: 'inv_2026_08', number: 'INV-2026-08', date: '2026-08-01', amount: 149, status: 'Paid', period: 'Aug 2026' },
  { id: 'inv_2026_07', number: 'INV-2026-07', date: '2026-07-01', amount: 149, status: 'Paid', period: 'Jul 2026' },
  { id: 'inv_2026_06', number: 'INV-2026-06', date: '2026-06-01', amount: 149, status: 'Paid', period: 'Jun 2026' },
  { id: 'inv_2026_05', number: 'INV-2026-05', date: '2026-05-01', amount: 79, status: 'Paid', period: 'May 2026' },
  { id: 'inv_2026_04', number: 'INV-2026-04', date: '2026-04-01', amount: 79, status: 'Paid', period: 'Apr 2026' },
]
