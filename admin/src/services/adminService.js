import { request, makeId } from './mockClient'
import { store, writeAudit } from './store'
import { roleById, roles } from '../config/permissions'

export const adminService = {
  list: () => request(() => store.admins),

  get: (id) => request(() => store.admins.find((a) => a.id === id) || null),

  create: (payload, actor) =>
    request(() => {
      const role = roleById(payload.roleId)
      const admin = {
        id: makeId('adm'),
        status: 'Invited',
        twoFactor: false,
        lastLogin: null,
        createdAt: new Date().toISOString(),
        ...payload,
        role: role.name,
        permissions: payload.roleId === 'custom' ? payload.permissions || [] : role.permissions,
      }
      store.admins = [...store.admins, admin]
      writeAudit({
        admin: actor,
        action: 'Created sub-admin',
        resource: 'Admin',
        resourceId: admin.id,
        resourceName: admin.name,
        detail: `Role: ${admin.role} with ${admin.permissions.length} permissions`,
      })
      return store.admins
    }),

  update: (id, patch, actor) =>
    request(() => {
      const before = store.admins.find((a) => a.id === id)
      const next = { ...patch }
      if (patch.roleId && patch.roleId !== 'custom') {
        const role = roleById(patch.roleId)
        next.role = role.name
        next.permissions = role.permissions
      }
      store.admins = store.admins.map((a) => (a.id === id ? { ...a, ...next } : a))
      writeAudit({
        admin: actor,
        action: patch.permissions ? 'Changed permissions' : 'Updated admin',
        resource: 'Admin',
        resourceId: id,
        resourceName: before?.name,
        detail: patch.roleId ? `Role: ${next.role}` : undefined,
      })
      return store.admins.find((a) => a.id === id)
    }),

  setStatus: (id, status, actor) =>
    request(() => {
      const before = store.admins.find((a) => a.id === id)
      store.admins = store.admins.map((a) => (a.id === id ? { ...a, status } : a))
      writeAudit({ admin: actor, action: status === 'Active' ? 'Activated admin' : `${status} admin`, resource: 'Admin', resourceId: id, resourceName: before?.name })
      return store.admins.find((a) => a.id === id)
    }),

  remove: (id, actor) =>
    request(() => {
      const before = store.admins.find((a) => a.id === id)
      store.admins = store.admins.filter((a) => a.id !== id)
      writeAudit({ admin: actor, action: 'Deleted admin', resource: 'Admin', resourceId: id, resourceName: before?.name })
      return store.admins
    }),

  getSessions: (adminId) => request(() => store.adminSessions.filter((s) => !adminId || s.adminId === adminId)),

  revokeSession: (sessionId, actor) =>
    request(() => {
      const session = store.adminSessions.find((s) => s.id === sessionId)
      store.adminSessions = store.adminSessions.filter((s) => s.id !== sessionId)
      writeAudit({ admin: actor, action: 'Revoked session', resource: 'Admin', resourceId: session?.adminId, resourceName: session?.device })
      return store.adminSessions
    }),

  getRoles: () => request(roles),
}

export default adminService
