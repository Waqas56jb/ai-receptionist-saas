import { request } from './mockClient'
import { store, insights } from './store'

/** Stripe is not wired up in this milestone — these are UI-only operations. */
export const billingService = {
  getSubscription: () => request(() => store.subscription),

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
