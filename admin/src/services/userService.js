import { request, makeId } from './mockClient'
import { store, userData, writeAudit } from './store'
import { live } from './api'

export const userService = {
  list: () =>
    live('/admin/accounts', {}, () => request(() => store.users)).then((rows) =>
      (Array.isArray(rows) ? rows : []).map((row) => ({
        ...row,
        business: row.business_name || row.business,
        lastLogin: row.lastLogin || row.last_login,
        createdAt: row.createdAt || row.created_at,
      })),
    ),

  create: (payload) =>
    live('/admin/accounts', { method: 'POST', body: payload }, () =>
      request(() => {
        store.users = [
          {
            id: makeId('usr'),
            status: 'Active',
            createdAt: new Date().toISOString(),
            lastLogin: null,
            ...payload,
            business: payload.businessName || payload.business,
          },
          ...store.users,
        ]
        return store.users
      }),
    ),

  getKpis: (id) => live(`/admin/accounts/${id}/kpis`, {}, () => request({ summary: { conversations: 0, messages: 0, inbound: 0, outbound: 0, voice: 0 }, daily: [] })),

  get: (id) =>
    live('/admin/accounts', {}, () => request(() => store.users.find((u) => u.id === id) || null)).then((rows) => {
      const row = Array.isArray(rows) ? rows.find((u) => u.id === id) || null : rows
      if (!row) return null
      return {
        ...row,
        business: row.business_name || row.business,
        lastLogin: row.lastLogin || row.last_login,
        createdAt: row.createdAt || row.created_at,
      }
    }),

  listByBusiness: (businessId) => request(() => store.users.filter((u) => u.businessId === businessId)),

  update: (id, patch, admin) =>
    live(`/admin/accounts/${id}`, { method: 'PATCH', body: patch }, () =>
    request(() => {
      const before = store.users.find((u) => u.id === id)
      store.users = store.users.map((u) => (u.id === id ? { ...u, ...patch } : u))
      writeAudit({ admin, action: 'Updated user', resource: 'User', resourceId: id, resourceName: before?.name, detail: Object.keys(patch).join(', ') })
      return store.users.find((u) => u.id === id)
    }),
    ),

  setStatus: (id, status, { reason, note } = {}, admin) =>
    live(`/admin/accounts/${id}/status`, { method: 'POST', body: { status, reason, note } }, () =>
    request(() => {
      const before = store.users.find((u) => u.id === id)
      const patch = { status }
      if (status === 'Blocked') patch.blockedReason = reason
      if (status === 'Suspended') patch.suspendedReason = reason
      if (status === 'Active') {
        patch.blockedReason = undefined
        patch.suspendedReason = undefined
      }
      store.users = store.users.map((u) => (u.id === id ? { ...u, ...patch } : u))
      writeAudit({
        admin,
        action: status === 'Active' ? 'Activated user' : `${status} user`,
        resource: 'User',
        resourceId: id,
        resourceName: before?.name,
        detail: reason ? `Reason: ${reason}${note ? ` — ${note}` : ''}` : undefined,
      })
      return store.users.find((u) => u.id === id)
    }),
    ),

  resetPassword: (id, admin) =>
    request(() => {
      const user = store.users.find((u) => u.id === id)
      writeAudit({ admin, action: 'Forced password reset', resource: 'User', resourceId: id, resourceName: user?.name })
      return { ok: true }
    }),

  remove: (id, admin) =>
    live(`/admin/accounts/${id}`, { method: 'DELETE' }, () =>
    request(() => {
      const before = store.users.find((u) => u.id === id)
      store.users = store.users.filter((u) => u.id !== id)
      writeAudit({ admin, action: 'Deleted user', resource: 'User', resourceId: id, resourceName: before?.name })
      return store.users
    }),
    ),

  bulk: (ids, action, admin) =>
    request(() => {
      store.users = store.users.map((u) => {
        if (!ids.includes(u.id)) return u
        if (action === 'block') return { ...u, status: 'Blocked' }
        if (action === 'activate') return { ...u, status: 'Active' }
        return u
      })
      writeAudit({ admin, action: `Bulk ${action}`, resource: 'User', resourceId: ids.join(','), resourceName: `${ids.length} users` })
      return store.users
    }),

  getLoginHistory: (id) => request(() => userData.userLoginHistory?.[id] || []),

  getNotes: (id) => request(() => store.userNotes[id] || []),

  addNote: (id, text, author) =>
    request(() => {
      store.userNotes[id] = [...(store.userNotes[id] || []), { id: makeId('un'), author, at: new Date().toISOString(), text }]
      return store.userNotes[id]
    }),

  getReferenceData: () => request({ roles: userData.userRoles, statuses: userData.userStatuses }),
}

export default userService
