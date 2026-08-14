import { request, makeId } from './mockClient'
import { store, revenueData, writeAudit } from './store'

export const subscriptionService = {
  list: () => request(() => store.subscriptions),
  get: (id) => request(() => store.subscriptions.find((s) => s.id === id) || null),
  listByBusiness: (businessId) => request(() => store.subscriptions.find((s) => s.businessId === businessId) || null),

  update: (id, patch, admin) =>
    request(() => {
      const before = store.subscriptions.find((s) => s.id === id)
      store.subscriptions = store.subscriptions.map((s) => (s.id === id ? { ...s, ...patch } : s))
      writeAudit({
        admin,
        action: patch.plan ? 'Changed plan' : patch.status ? `Subscription ${patch.status.toLowerCase()}` : 'Updated subscription',
        resource: 'Subscription',
        resourceId: id,
        resourceName: before?.business,
        detail: patch.plan ? `${before?.plan} to ${patch.plan}` : undefined,
      })
      return store.subscriptions.find((s) => s.id === id)
    }),

  extend: (id, days, admin) =>
    request(() => {
      const before = store.subscriptions.find((s) => s.id === id)
      const renewal = new Date(before.renewalDate)
      renewal.setDate(renewal.getDate() + days)
      const renewalDate = renewal.toISOString().slice(0, 10)
      store.subscriptions = store.subscriptions.map((s) => (s.id === id ? { ...s, renewalDate } : s))
      writeAudit({ admin, action: 'Extended subscription', resource: 'Subscription', resourceId: id, resourceName: before?.business, detail: `+${days} days` })
      return store.subscriptions.find((s) => s.id === id)
    }),

  getReferenceData: () => request({ statuses: revenueData.subscriptionStatuses }),
}

export const planService = {
  list: () => request(() => store.plans),
  get: (id) => request(() => store.plans.find((p) => p.id === id) || null),

  create: (payload, admin) =>
    request(() => {
      const plan = {
        id: makeId('plan'),
        status: 'Active',
        subscribers: 0,
        mrr: 0,
        createdAt: new Date().toISOString(),
        limits: { calls: 0, aiMinutes: 0, messages: 0, documents: 0, storageGb: 0, users: 1 },
        features: { voice: true, whatsapp: false, instagram: false, analytics: false, crm: false },
        ...payload,
      }
      store.plans = [...store.plans, plan]
      writeAudit({ admin, action: 'Created plan', resource: 'Plan', resourceId: plan.id, resourceName: plan.name })
      return store.plans
    }),

  update: (id, patch, admin) =>
    request(() => {
      const before = store.plans.find((p) => p.id === id)
      store.plans = store.plans.map((p) => (p.id === id ? { ...p, ...patch } : p))
      writeAudit({ admin, action: 'Updated plan', resource: 'Plan', resourceId: id, resourceName: before?.name })
      return store.plans.find((p) => p.id === id)
    }),

  duplicate: (id, admin) =>
    request(() => {
      const source = store.plans.find((p) => p.id === id)
      const copy = { ...source, id: makeId('plan'), name: `${source.name} (copy)`, status: 'Disabled', subscribers: 0, mrr: 0 }
      store.plans = [...store.plans, copy]
      writeAudit({ admin, action: 'Duplicated plan', resource: 'Plan', resourceId: copy.id, resourceName: copy.name })
      return store.plans
    }),

  remove: (id, admin) =>
    request(() => {
      const before = store.plans.find((p) => p.id === id)
      store.plans = store.plans.filter((p) => p.id !== id)
      writeAudit({ admin, action: 'Deleted plan', resource: 'Plan', resourceId: id, resourceName: before?.name })
      return store.plans
    }),
}

export const billingService = {
  listPayments: () => request(() => store.payments),
  listPaymentsByBusiness: (businessId) => request(() => store.payments.filter((p) => p.businessId === businessId)),
  listInvoices: () => request(() => store.invoices),
  listInvoicesByBusiness: (businessId) => request(() => store.invoices.filter((i) => i.businessId === businessId)),

  refund: (id, admin) =>
    request(() => {
      const before = store.payments.find((p) => p.id === id)
      store.payments = store.payments.map((p) => (p.id === id ? { ...p, status: 'Refunded' } : p))
      writeAudit({ admin, action: 'Issued refund', resource: 'Payment', resourceId: id, resourceName: `${before?.business} — €${before?.amount}` })
      return store.payments
    }),

  sendInvoice: (id, admin) =>
    request(() => {
      const invoice = store.invoices.find((i) => i.id === id)
      writeAudit({ admin, action: 'Sent invoice', resource: 'Invoice', resourceId: id, resourceName: invoice?.number })
      return { ok: true }
    }),

  getReferenceData: () => request({ paymentStatuses: revenueData.paymentStatuses, invoiceStatuses: revenueData.invoiceStatuses }),
}
