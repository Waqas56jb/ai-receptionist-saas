import { request, makeId } from './mockClient'
import { store, platformData, writeAudit } from './store'

export const analyticsService = {
  getSummary: () => request(platformData.platformSummary),
  getGrowth: () => request(platformData.growthSeries),
  getRevenueByPlan: () => request(platformData.revenueByPlan),
  getChannelDistribution: () => request(platformData.channelDistribution),
  getSubscriptionMovement: () => request(platformData.subscriptionMovement),
  getHealth: () => request(platformData.platformHealth, { latency: [150, 320] }),
  getActivity: () => request(platformData.recentActivity),

  /** Usage per business, with the plan allowance it is measured against. */
  getUsageByBusiness: () =>
    request(() =>
      store.businesses.map((b) => {
        const plan = store.plans.find((p) => p.name === b.plan)
        return {
          businessId: b.id,
          business: b.name,
          plan: b.plan,
          status: b.status,
          usagePct: b.usagePct,
          calls: b.calls,
          messages: b.messages,
          callLimit: plan?.limits.calls ?? 0,
          messageLimit: plan?.limits.messages ?? 0,
        }
      }),
    ),
}

export const supportService = {
  listTickets: () => request(() => store.tickets),
  getTicket: (id) => request(() => store.tickets.find((t) => t.id === id) || null),
  listTicketsByBusiness: (businessId) => request(() => store.tickets.filter((t) => t.businessId === businessId)),

  updateTicket: (id, patch, admin) =>
    request(() => {
      store.tickets = store.tickets.map((t) => (t.id === id ? { ...t, ...patch, updatedAt: new Date().toISOString() } : t))
      writeAudit({ admin, action: 'Updated ticket', resource: 'Ticket', resourceId: id, resourceName: id, detail: Object.keys(patch).join(', ') })
      return store.tickets.find((t) => t.id === id)
    }),

  reply: (id, text, author) =>
    request(() => {
      store.tickets = store.tickets.map((t) =>
        t.id === id
          ? {
              ...t,
              status: t.status === 'Open' ? 'In Progress' : t.status,
              updatedAt: new Date().toISOString(),
              messages: [...t.messages, { id: makeId('tm'), from: 'admin', author, at: new Date().toISOString(), text }],
            }
          : t,
      )
      return store.tickets.find((t) => t.id === id)
    }),

  addNote: (id, text, author) =>
    request(() => {
      store.tickets = store.tickets.map((t) =>
        t.id === id ? { ...t, notes: [...(t.notes || []), { id: makeId('tn'), author, at: new Date().toISOString(), text }] } : t,
      )
      return store.tickets.find((t) => t.id === id)
    }),

  getReferenceData: () => request({ statuses: platformData.ticketStatuses, priorities: platformData.ticketPriorities }),
}

export const announcementService = {
  list: () => request(() => store.announcements),

  create: (payload, admin) =>
    request(() => {
      const announcement = { id: makeId('ann'), status: 'Scheduled', ...payload }
      store.announcements = [announcement, ...store.announcements]
      writeAudit({ admin, action: 'Created announcement', resource: 'Announcement', resourceId: announcement.id, resourceName: announcement.title })
      return store.announcements
    }),

  update: (id, patch, admin) =>
    request(() => {
      const before = store.announcements.find((a) => a.id === id)
      store.announcements = store.announcements.map((a) => (a.id === id ? { ...a, ...patch } : a))
      writeAudit({ admin, action: 'Updated announcement', resource: 'Announcement', resourceId: id, resourceName: before?.title })
      return store.announcements
    }),

  remove: (id, admin) =>
    request(() => {
      const before = store.announcements.find((a) => a.id === id)
      store.announcements = store.announcements.filter((a) => a.id !== id)
      writeAudit({ admin, action: 'Deleted announcement', resource: 'Announcement', resourceId: id, resourceName: before?.title })
      return store.announcements
    }),
}

export const auditService = {
  list: () => request(() => store.auditLogs),
  get: (id) => request(() => store.auditLogs.find((l) => l.id === id) || null),
  getSecurityEvents: () => request(() => store.securityEvents),
}

export const settingsService = {
  get: () => request(() => store.settings),

  update: (section, patch, admin) =>
    request(() => {
      store.settings[section] = { ...store.settings[section], ...patch }
      writeAudit({ admin, action: 'Updated platform settings', resource: 'Settings', resourceId: section, resourceName: section })
      return store.settings
    }),

  getIntegrations: () => request(() => store.integrations),

  testIntegration: (id) =>
    request(() => {
      store.integrations = store.integrations.map((i) => (i.id === id ? { ...i, lastChecked: new Date().toISOString() } : i))
      return store.integrations
    }, { latency: [700, 1200] }),

  getFeatureFlags: () => request(() => store.featureFlags),

  setFeatureFlag: (id, enabled, admin) =>
    request(() => {
      const before = store.featureFlags.find((f) => f.id === id)
      store.featureFlags = store.featureFlags.map((f) => (f.id === id ? { ...f, enabled } : f))
      writeAudit({ admin, action: enabled ? 'Enabled feature' : 'Disabled feature', resource: 'Feature flag', resourceId: id, resourceName: before?.name })
      return store.featureFlags
    }),

  setFeaturePlans: (id, plans) =>
    request(() => {
      store.featureFlags = store.featureFlags.map((f) => (f.id === id ? { ...f, plans } : f))
      return store.featureFlags
    }),

  getMaintenance: () => request(() => store.maintenance),

  setMaintenance: (patch, admin) =>
    request(() => {
      store.maintenance = { ...store.maintenance, ...patch }
      if (patch.enabled !== undefined) {
        writeAudit({
          admin,
          action: patch.enabled ? 'Enabled maintenance mode' : 'Disabled maintenance mode',
          resource: 'System',
          resourceId: 'maintenance',
          resourceName: 'Maintenance mode',
        })
      }
      return store.maintenance
    }),
}

export const notificationService = {
  list: () => request(() => store.notifications, { latency: [150, 320] }),

  markRead: (id) =>
    request(() => {
      store.notifications = store.notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      return store.notifications
    }, { latency: [80, 160] }),

  markAllRead: () =>
    request(() => {
      store.notifications = store.notifications.map((n) => ({ ...n, read: true }))
      return store.notifications
    }, { latency: [120, 240] }),
}
