import { request } from './mockClient'
import { store, insights } from './store'
import { api } from './api'

export const billingService = {
  getSubscription: async () => {
    try {
      const sub = await api('/billing')
      store.subscription = { ...store.subscription, ...sub }
    } catch {
      /* keep last known local plan if billing is unavailable */
    }
    return store.subscription
  },

  getPlans: () => request(insights.plans),

  getInvoices: () => request(() => store.invoices),

  changePlan: (planId) =>
    request(
      () => {
        const plan = insights.plans.find((p) => p.id === planId)
        if (plan) store.subscription.plan = plan.name
        return store.subscription
      },
      { latency: [700, 1200] },
    ),

  setBillingCycle: (cycle) =>
    request(() => {
      store.subscription.billingCycle = cycle
      return store.subscription
    }),
}

export default billingService
