import { request, makeId } from './mockClient'
import { store, businessData, writeAudit } from './store'

export const businessService = {
  list: () => request(() => store.businesses),

  get: (id) => request(() => store.businesses.find((b) => b.id === id) || null),

  create: (payload, admin) =>
    request(() => {
      const business = {
        id: makeId('biz'),
        status: 'Pending',
        aiStatus: 'Needs setup',
        channels: [],
        users: 1,
        calls: 0,
        messages: 0,
        mrr: 0,
        usagePct: 0,
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        ...payload,
      }
      store.businesses = [business, ...store.businesses]
      writeAudit({ admin, action: 'Created business', resource: 'Business', resourceId: business.id, resourceName: business.name })
      return store.businesses
    }),

  update: (id, patch, admin) =>
    request(() => {
      const before = store.businesses.find((b) => b.id === id)
      store.businesses = store.businesses.map((b) => (b.id === id ? { ...b, ...patch } : b))
      writeAudit({ admin, action: 'Updated business', resource: 'Business', resourceId: id, resourceName: before?.name, detail: Object.keys(patch).join(', ') })
      return store.businesses.find((b) => b.id === id)
    }),

  suspend: (id, { reason, note }, admin) =>
    request(() => {
      const before = store.businesses.find((b) => b.id === id)
      store.businesses = store.businesses.map((b) =>
        b.id === id ? { ...b, status: 'Suspended', aiStatus: 'Paused', suspendedReason: reason, suspendedAt: new Date().toISOString() } : b,
      )
      writeAudit({ admin, action: 'Suspended business', resource: 'Business', resourceId: id, resourceName: before?.name, detail: `Reason: ${reason}${note ? ` — ${note}` : ''}` })
      return store.businesses.find((b) => b.id === id)
    }),

  activate: (id, admin) =>
    request(() => {
      const before = store.businesses.find((b) => b.id === id)
      store.businesses = store.businesses.map((b) =>
        b.id === id ? { ...b, status: 'Active', aiStatus: 'Online', suspendedReason: undefined, suspendedAt: undefined } : b,
      )
      writeAudit({ admin, action: 'Reactivated business', resource: 'Business', resourceId: id, resourceName: before?.name })
      return store.businesses.find((b) => b.id === id)
    }),

  remove: (id, admin) =>
    request(() => {
      const before = store.businesses.find((b) => b.id === id)
      store.businesses = store.businesses.filter((b) => b.id !== id)
      writeAudit({ admin, action: 'Deleted business', resource: 'Business', resourceId: id, resourceName: before?.name })
      return store.businesses
    }),

  bulk: (ids, action, admin) =>
    request(() => {
      store.businesses = store.businesses.map((b) => {
        if (!ids.includes(b.id)) return b
        if (action === 'suspend') return { ...b, status: 'Suspended', aiStatus: 'Paused' }
        if (action === 'activate') return { ...b, status: 'Active', aiStatus: 'Online' }
        return b
      })
      writeAudit({ admin, action: `Bulk ${action}`, resource: 'Business', resourceId: ids.join(','), resourceName: `${ids.length} businesses` })
      return store.businesses
    }),

  getNotes: (id) => request(() => store.businessNotes[id] || []),

  addNote: (id, text, author) =>
    request(() => {
      store.businessNotes[id] = [
        ...(store.businessNotes[id] || []),
        { id: makeId('bn'), author, at: new Date().toISOString(), text },
      ]
      return store.businessNotes[id]
    }),

  /** Support access is recorded before anything else happens. */
  startSupportAccess: (id, reason, admin) =>
    request(() => {
      const business = store.businesses.find((b) => b.id === id)
      writeAudit({ admin, action: 'Support access started', resource: 'Business', resourceId: id, resourceName: business?.name, detail: `Reason: ${reason}` })
      return { ok: true, business: business?.name, startedAt: new Date().toISOString(), reason }
    }, { latency: [500, 900] }),

  getReferenceData: () => request({ industries: businessData.industries, statuses: businessData.businessStatuses }),
}

export default businessService
