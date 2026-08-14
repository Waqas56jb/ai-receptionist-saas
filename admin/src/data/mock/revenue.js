export const plans = [
  {
    id: 'plan_starter', name: 'Starter', description: 'For small businesses taking their first calls and messages with AI.',
    monthlyPrice: 79, annualPrice: 790, trialDays: 14, status: 'Active',
    limits: { calls: 500, aiMinutes: 300, messages: 1000, documents: 20, storageGb: 2, users: 3 },
    features: { voice: true, whatsapp: true, instagram: false, analytics: false, crm: true },
    subscribers: 5, mrr: 395, createdAt: '2026-01-05T09:00:00Z',
  },
  {
    id: 'plan_professional', name: 'Professional', description: 'For growing businesses handling customers across every channel.',
    monthlyPrice: 149, annualPrice: 1490, trialDays: 14, status: 'Active',
    limits: { calls: 2000, aiMinutes: 1200, messages: 5000, documents: 50, storageGb: 10, users: 10 },
    features: { voice: true, whatsapp: true, instagram: true, analytics: true, crm: true },
    subscribers: 8, mrr: 1192, createdAt: '2026-01-05T09:00:00Z',
  },
  {
    id: 'plan_enterprise', name: 'Enterprise', description: 'For multi-location businesses and teams with custom requirements.',
    monthlyPrice: 499, annualPrice: 4990, trialDays: 30, status: 'Active',
    limits: { calls: 10000, aiMinutes: 6000, messages: 25000, documents: 500, storageGb: 100, users: 50 },
    features: { voice: true, whatsapp: true, instagram: true, analytics: true, crm: true },
    subscribers: 2, mrr: 998, createdAt: '2026-01-05T09:00:00Z',
  },
  {
    id: 'plan_legacy', name: 'Early Access', description: 'Closed legacy plan kept for the first cohort of customers.',
    monthlyPrice: 49, annualPrice: 490, trialDays: 0, status: 'Disabled',
    limits: { calls: 300, aiMinutes: 200, messages: 600, documents: 10, storageGb: 1, users: 2 },
    features: { voice: true, whatsapp: false, instagram: false, analytics: false, crm: false },
    subscribers: 0, mrr: 0, createdAt: '2025-11-20T09:00:00Z',
  },
]

export const subscriptionStatuses = ['Active', 'Trial', 'Past Due', 'Cancelled', 'Suspended', 'Expired']

export const subscriptions = [
  { id: 'sub_1', businessId: 'biz_8f21', business: 'Harbour View Hotel', owner: 'Camille Laurent', plan: 'Professional', status: 'Active', cycle: 'Monthly', amount: 149, startDate: '2026-02-04', renewalDate: '2026-09-01', usagePct: 68, paymentStatus: 'Paid' },
  { id: 'sub_2', businessId: 'biz_3a77', business: 'Cedar Family Clinic', owner: 'Dr Nadia Haddad', plan: 'Professional', status: 'Active', cycle: 'Annual', amount: 1490, startDate: '2026-03-11', renewalDate: '2027-03-11', usagePct: 82, paymentStatus: 'Paid' },
  { id: 'sub_3', businessId: 'biz_5c12', business: 'Bistro Lumière', owner: 'Marc Dubois', plan: 'Starter', status: 'Active', cycle: 'Monthly', amount: 79, startDate: '2026-04-02', renewalDate: '2026-09-02', usagePct: 41, paymentStatus: 'Paid' },
  { id: 'sub_4', businessId: 'biz_9d04', business: 'Northlight Properties', owner: 'Sofia Lindqvist', plan: 'Enterprise', status: 'Active', cycle: 'Annual', amount: 4990, startDate: '2026-01-19', renewalDate: '2027-01-19', usagePct: 57, paymentStatus: 'Paid' },
  { id: 'sub_5', businessId: 'biz_7b55', business: 'Studio Belle Peau', owner: 'Léa Moreau', plan: 'Starter', status: 'Trial', cycle: 'Monthly', amount: 0, startDate: '2026-08-02', renewalDate: '2026-08-16', usagePct: 22, paymentStatus: 'Not due' },
  { id: 'sub_6', businessId: 'biz_2e88', business: 'Meridian Legal', owner: 'James Whitfield', plan: 'Professional', status: 'Active', cycle: 'Monthly', amount: 149, startDate: '2026-02-27', renewalDate: '2026-08-27', usagePct: 74, paymentStatus: 'Paid' },
  { id: 'sub_7', businessId: 'biz_4f31', business: 'AutoPrime Garage', owner: 'Peter Janssen', plan: 'Starter', status: 'Past Due', cycle: 'Monthly', amount: 79, startDate: '2026-03-30', renewalDate: '2026-08-01', usagePct: 12, paymentStatus: 'Failed' },
  { id: 'sub_8', businessId: 'biz_6a19', business: 'Lakeview Dental', owner: 'Elena Rossi', plan: 'Professional', status: 'Active', cycle: 'Monthly', amount: 149, startDate: '2026-05-14', renewalDate: '2026-09-14', usagePct: 63, paymentStatus: 'Paid' },
  { id: 'sub_9', businessId: 'biz_1c63', business: 'Atelier Petit', owner: 'Chloé Petit', plan: 'Starter', status: 'Trial', cycle: 'Monthly', amount: 0, startDate: '2026-08-09', renewalDate: '2026-08-23', usagePct: 4, paymentStatus: 'Not due' },
  { id: 'sub_10', businessId: 'biz_8h22', business: 'Alpine Chalet Rentals', owner: 'Thomas Weber', plan: 'Professional', status: 'Active', cycle: 'Monthly', amount: 149, startDate: '2026-01-08', renewalDate: '2026-09-08', usagePct: 91, paymentStatus: 'Paid' },
  { id: 'sub_11', businessId: 'biz_5k47', business: 'Karim Consulting', owner: 'Aisha Karim', plan: 'Enterprise', status: 'Active', cycle: 'Monthly', amount: 499, startDate: '2026-02-15', renewalDate: '2026-09-15', usagePct: 48, paymentStatus: 'Paid' },
  { id: 'sub_12', businessId: 'biz_3p90', business: 'Verde Garden Centre', owner: 'Marco Bianchi', plan: 'Starter', status: 'Active', cycle: 'Monthly', amount: 79, startDate: '2026-06-21', renewalDate: '2026-09-21', usagePct: 35, paymentStatus: 'Paid' },
  { id: 'sub_13', businessId: 'biz_9w66', business: 'Maison Fleurie', owner: 'Fatima Zahra', plan: 'Professional', status: 'Active', cycle: 'Monthly', amount: 149, startDate: '2026-04-25', renewalDate: '2026-09-25', usagePct: 71, paymentStatus: 'Paid' },
  { id: 'sub_14', businessId: 'biz_2r38', business: 'Riverside Vets', owner: 'Yanis Bouchard', plan: 'Professional', status: 'Suspended', cycle: 'Monthly', amount: 149, startDate: '2026-03-05', renewalDate: '2026-09-05', usagePct: 29, paymentStatus: 'Paused' },
  { id: 'sub_15', businessId: 'biz_7t04', business: 'Coastline Surf School', owner: 'Oliver Grant', plan: 'Starter', status: 'Expired', cycle: 'Monthly', amount: 0, startDate: '2026-08-13', renewalDate: '2026-08-14', usagePct: 0, paymentStatus: 'Not due' },
]

export const paymentStatuses = ['Successful', 'Pending', 'Failed', 'Refunded']

export const payments = [
  { id: 'pay_1', reference: 'ch_9K02X1', businessId: 'biz_8f21', business: 'Harbour View Hotel', customer: 'Camille Laurent', amount: 149, currency: 'EUR', method: 'Visa •••• 4242', status: 'Successful', plan: 'Professional', at: '2026-08-01T06:02:00Z' },
  { id: 'pay_2', reference: 'ch_7B41M9', businessId: 'biz_3a77', business: 'Cedar Family Clinic', customer: 'Dr Nadia Haddad', amount: 1490, currency: 'EUR', method: 'SEPA •••• 8891', status: 'Successful', plan: 'Professional', at: '2026-03-11T10:44:00Z' },
  { id: 'pay_3', reference: 'ch_2Q88L4', businessId: 'biz_4f31', business: 'AutoPrime Garage', customer: 'Peter Janssen', amount: 79, currency: 'EUR', method: 'Mastercard •••• 5510', status: 'Failed', plan: 'Starter', at: '2026-08-01T06:04:00Z' },
  { id: 'pay_4', reference: 'ch_5T13R7', businessId: 'biz_9d04', business: 'Northlight Properties', customer: 'Sofia Lindqvist', amount: 4990, currency: 'EUR', method: 'Visa •••• 1180', status: 'Successful', plan: 'Enterprise', at: '2026-01-19T08:30:00Z' },
  { id: 'pay_5', reference: 'ch_8N55D2', businessId: 'biz_2e88', business: 'Meridian Legal', customer: 'James Whitfield', amount: 149, currency: 'EUR', method: 'Visa •••• 9034', status: 'Successful', plan: 'Professional', at: '2026-07-27T06:02:00Z' },
  { id: 'pay_6', reference: 'ch_3F19K8', businessId: 'biz_8h22', business: 'Alpine Chalet Rentals', customer: 'Thomas Weber', amount: 149, currency: 'EUR', method: 'Amex •••• 3007', status: 'Successful', plan: 'Professional', at: '2026-08-08T06:01:00Z' },
  { id: 'pay_7', reference: 'ch_6H72P5', businessId: 'biz_5k47', business: 'Karim Consulting', customer: 'Aisha Karim', amount: 499, currency: 'EUR', method: 'Visa •••• 7742', status: 'Successful', plan: 'Enterprise', at: '2026-08-15T06:03:00Z' },
  { id: 'pay_8', reference: 'ch_1D66W3', businessId: 'biz_6a19', business: 'Lakeview Dental', customer: 'Elena Rossi', amount: 149, currency: 'EUR', method: 'Visa •••• 2288', status: 'Pending', plan: 'Professional', at: '2026-08-14T06:02:00Z' },
  { id: 'pay_9', reference: 'ch_4J30S6', businessId: 'biz_2r38', business: 'Riverside Vets', customer: 'Yanis Bouchard', amount: 149, currency: 'EUR', method: 'Mastercard •••• 6612', status: 'Refunded', plan: 'Professional', at: '2026-08-06T09:40:00Z' },
  { id: 'pay_10', reference: 'ch_0G44Z9', businessId: 'biz_9w66', business: 'Maison Fleurie', customer: 'Fatima Zahra', amount: 149, currency: 'EUR', method: 'Visa •••• 5521', status: 'Successful', plan: 'Professional', at: '2026-08-11T06:02:00Z' },
  { id: 'pay_11', reference: 'ch_7Y21C4', businessId: 'biz_5c12', business: 'Bistro Lumière', customer: 'Marc Dubois', amount: 79, currency: 'EUR', method: 'Visa •••• 3390', status: 'Successful', plan: 'Starter', at: '2026-08-02T06:02:00Z' },
  { id: 'pay_12', reference: 'ch_9L08V1', businessId: 'biz_3p90', business: 'Verde Garden Centre', customer: 'Marco Bianchi', amount: 79, currency: 'EUR', method: 'SEPA •••• 4471', status: 'Successful', plan: 'Starter', at: '2026-07-21T06:02:00Z' },
]

export const invoiceStatuses = ['Paid', 'Open', 'Overdue', 'Void', 'Refunded']

export const invoices = [
  { id: 'inv_1', number: 'INV-2026-0141', businessId: 'biz_8f21', business: 'Harbour View Hotel', customer: 'Camille Laurent', amount: 149, status: 'Paid', issued: '2026-08-01', due: '2026-08-08' },
  { id: 'inv_2', number: 'INV-2026-0140', businessId: 'biz_4f31', business: 'AutoPrime Garage', customer: 'Peter Janssen', amount: 79, status: 'Overdue', issued: '2026-08-01', due: '2026-08-08' },
  { id: 'inv_3', number: 'INV-2026-0139', businessId: 'biz_5k47', business: 'Karim Consulting', customer: 'Aisha Karim', amount: 499, status: 'Paid', issued: '2026-08-15', due: '2026-08-22' },
  { id: 'inv_4', number: 'INV-2026-0138', businessId: 'biz_6a19', business: 'Lakeview Dental', customer: 'Elena Rossi', amount: 149, status: 'Open', issued: '2026-08-14', due: '2026-08-21' },
  { id: 'inv_5', number: 'INV-2026-0137', businessId: 'biz_8h22', business: 'Alpine Chalet Rentals', customer: 'Thomas Weber', amount: 149, status: 'Paid', issued: '2026-08-08', due: '2026-08-15' },
  { id: 'inv_6', number: 'INV-2026-0136', businessId: 'biz_2r38', business: 'Riverside Vets', customer: 'Yanis Bouchard', amount: 149, status: 'Refunded', issued: '2026-08-05', due: '2026-08-12' },
  { id: 'inv_7', number: 'INV-2026-0135', businessId: 'biz_9w66', business: 'Maison Fleurie', customer: 'Fatima Zahra', amount: 149, status: 'Paid', issued: '2026-08-11', due: '2026-08-18' },
  { id: 'inv_8', number: 'INV-2026-0134', businessId: 'biz_2e88', business: 'Meridian Legal', customer: 'James Whitfield', amount: 149, status: 'Paid', issued: '2026-07-27', due: '2026-08-03' },
]
