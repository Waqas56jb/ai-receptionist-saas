import { roles } from '../../config/permissions'

const permsFor = (roleId) => roles.find((r) => r.id === roleId)?.permissions || []

export const admins = [
  {
    id: 'adm_1',
    name: 'Saqib Rahman',
    email: 'saqib@devmark.example.com',
    roleId: 'super-admin',
    role: 'Super Admin',
    permissions: permsFor('super-admin'),
    status: 'Active',
    twoFactor: true,
    lastLogin: '2026-08-15T07:02:00Z',
    createdAt: '2026-01-12T09:00:00Z',
  },
  {
    id: 'adm_2',
    name: 'Hélène Bruneau',
    email: 'helene@devmark.example.com',
    roleId: 'operations-admin',
    role: 'Operations Admin',
    permissions: permsFor('operations-admin'),
    status: 'Active',
    twoFactor: true,
    lastLogin: '2026-08-14T16:40:00Z',
    createdAt: '2026-03-02T10:15:00Z',
  },
  {
    id: 'adm_3',
    name: 'Tomás Oliveira',
    email: 'tomas@devmark.example.com',
    roleId: 'billing-admin',
    role: 'Billing Admin',
    permissions: permsFor('billing-admin'),
    status: 'Active',
    twoFactor: false,
    lastLogin: '2026-08-15T06:20:00Z',
    createdAt: '2026-04-18T11:30:00Z',
  },
  {
    id: 'adm_4',
    name: 'Amara Okafor',
    email: 'amara@devmark.example.com',
    roleId: 'support-admin',
    role: 'Support Admin',
    permissions: permsFor('support-admin'),
    status: 'Active',
    twoFactor: true,
    lastLogin: '2026-08-15T05:12:00Z',
    createdAt: '2026-05-06T08:45:00Z',
  },
  {
    id: 'adm_5',
    name: 'Jonas Vogel',
    email: 'jonas@devmark.example.com',
    roleId: 'analytics-admin',
    role: 'Analytics Admin',
    permissions: permsFor('analytics-admin'),
    status: 'Suspended',
    twoFactor: false,
    lastLogin: '2026-07-29T13:05:00Z',
    createdAt: '2026-06-01T14:20:00Z',
  },
  {
    id: 'adm_6',
    name: 'Priya Deshmukh',
    email: 'priya@devmark.example.com',
    roleId: 'custom',
    role: 'Custom Admin',
    permissions: ['businesses.view', 'users.view', 'support.view', 'support.resolve', 'analytics.business'],
    status: 'Invited',
    twoFactor: false,
    lastLogin: null,
    createdAt: '2026-08-11T09:10:00Z',
  },
]

/** The signed-in admin for this demo build. */
export const currentAdmin = admins[0]

export const adminSessions = [
  { id: 'as_1', adminId: 'adm_1', device: 'Chrome · macOS', location: 'Lahore, Pakistan', ip: '103.244.•••.•••', lastActive: '2026-08-15T07:44:00Z', current: true },
  { id: 'as_2', adminId: 'adm_2', device: 'Firefox · Windows', location: 'Paris, France', ip: '92.184.•••.•••', lastActive: '2026-08-14T16:41:00Z', current: false },
  { id: 'as_3', adminId: 'adm_3', device: 'Safari · iPad', location: 'Lisbon, Portugal', ip: '188.250.•••.•••', lastActive: '2026-08-15T06:22:00Z', current: false },
]

export const securityEvents = [
  { id: 'se_1', type: 'Failed login', admin: 'unknown@example.com', detail: '5 failed attempts in 2 minutes', ip: '45.12.•••.•••', at: '2026-08-15T03:18:00Z', severity: 'High' },
  { id: 'se_2', type: 'Permission change', admin: 'Saqib Rahman', detail: 'Granted billing.refunds to Tomás Oliveira', ip: '103.244.•••.•••', at: '2026-08-14T11:02:00Z', severity: 'Medium' },
  { id: 'se_3', type: 'New admin created', admin: 'Saqib Rahman', detail: 'Invited Priya Deshmukh as Custom Admin', ip: '103.244.•••.•••', at: '2026-08-11T09:10:00Z', severity: 'Medium' },
  { id: 'se_4', type: 'Session revoked', admin: 'Saqib Rahman', detail: 'Revoked session for Jonas Vogel', ip: '103.244.•••.•••', at: '2026-08-09T15:26:00Z', severity: 'Low' },
  { id: 'se_5', type: 'Login from new location', admin: 'Amara Okafor', detail: 'First sign-in from Lagos, Nigeria', ip: '102.89.•••.•••', at: '2026-08-08T07:41:00Z', severity: 'Medium' },
]

export const loginAttempts = [
  { id: 'la_1', email: 'saqib@devmark.example.com', result: 'Success', ip: '103.244.•••.•••', device: 'Chrome · macOS', at: '2026-08-15T07:02:00Z' },
  { id: 'la_2', email: 'unknown@example.com', result: 'Failed', ip: '45.12.•••.•••', device: 'Unknown', at: '2026-08-15T03:18:00Z' },
  { id: 'la_3', email: 'tomas@devmark.example.com', result: 'Success', ip: '188.250.•••.•••', device: 'Safari · iPad', at: '2026-08-15T06:20:00Z' },
  { id: 'la_4', email: 'jonas@devmark.example.com', result: 'Blocked', ip: '91.64.•••.•••', device: 'Firefox · Windows', at: '2026-08-13T21:44:00Z' },
]
