import { request, makeId } from './mockClient'
import { store, userData, writeAudit } from './store'

export const userService = {
  list: () => request(() => store.users),

  get: (id) => request(() => store.users.find((u) => u.id === id) || null),

  listByBusiness: (businessId) => request(() => store.users.filter((u) => u.businessId === businessId)),

  update: (id, patch, admin) =>
    request(() => {
      const before = store.users.find((u) => u.id === id)
      store.users = store.users.map((u) => (u.id === id ? { ...u, ...patch } : u))
      writeAudit({ admin, action: 'Updated user', resource: 'User', resourceId: id, resourceName: before?.name, detail: Object.keys(patch).join(', ') })
      return store.users.find((u) => u.id === id)
    }),

  setStatus: (id, status, { reason, note } = {}, admin) =>
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

  resetPassword: (id, admin) =>
    request(() => {
      const user = store.users.find((u) => u.id === id)
      writeAudit({ admin, action: 'Forced password reset', resource: 'User', resourceId: id, resourceName: user?.name })
      return { ok: true }
    }),

  remove: (id, admin) =>
    request(() => {
      const before = store.users.find((u) => u.id === id)
      store.users = store.users.filter((u) => u.id !== id)
      writeAudit({ admin, action: 'Deleted user', resource: 'User', resourceId: id, resourceName: before?.name })
      return store.users
    }),

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

  getLoginHistory: (id) => request(() => userData.userLoginHistory[id] || userData.userLoginHistory.usr_1),

  getNotes: (id) => request(() => store.userNotes[id] || []),

  addNote: (id, text, author) =>
    request(() => {
      store.userNotes[id] = [...(store.userNotes[id] || []), { id: makeId('un'), author, at: new Date().toISOString(), text }]
      return store.userNotes[id]
    }),

  getReferenceData: () => request({ roles: userData.userRoles, statuses: userData.userStatuses }),
}

export default userService
