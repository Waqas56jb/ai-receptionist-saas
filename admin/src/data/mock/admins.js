import { roles } from '../../config/permissions'

const permsFor = (roleId) => roles.find((r) => r.id === roleId)?.permissions || []

export const admins = []

export const currentAdmin = {
  id: null,
  name: '',
  email: '',
  roleId: 'super-admin',
  role: 'Super Admin',
  permissions: permsFor('super-admin'),
  status: 'Active',
  twoFactor: false,
  lastLogin: null,
  createdAt: null,
}

export const adminSessions = []
export const securityEvents = []
export const loginAttempts = []
