/**
 * Permission catalogue and role presets for admin RBAC.
 * The backend will enforce these later; the portal uses them to shape the UI.
 */

export const permissionGroups = [
  {
    id: 'businesses',
    label: 'Businesses',
    permissions: [
      { id: 'businesses.view', label: 'View businesses' },
      { id: 'businesses.create', label: 'Create business' },
      { id: 'businesses.edit', label: 'Edit business' },
      { id: 'businesses.suspend', label: 'Suspend business' },
      { id: 'businesses.activate', label: 'Activate business' },
      { id: 'businesses.delete', label: 'Delete business', danger: true },
      { id: 'businesses.impersonate', label: 'Support access (impersonate)', danger: true },
    ],
  },
  {
    id: 'users',
    label: 'Users',
    permissions: [
      { id: 'users.view', label: 'View users' },
      { id: 'users.create', label: 'Create users' },
      { id: 'users.edit', label: 'Edit users' },
      { id: 'users.suspend', label: 'Suspend users' },
      { id: 'users.delete', label: 'Delete users', danger: true },
    ],
  },
  {
    id: 'subscriptions',
    label: 'Subscriptions',
    permissions: [
      { id: 'subscriptions.view', label: 'View subscriptions' },
      { id: 'subscriptions.create', label: 'Create subscription' },
      { id: 'subscriptions.changePlan', label: 'Change plan' },
      { id: 'subscriptions.cancel', label: 'Cancel subscription' },
      { id: 'subscriptions.extend', label: 'Extend subscription' },
    ],
  },
  {
    id: 'billing',
    label: 'Billing',
    permissions: [
      { id: 'billing.payments', label: 'View payments' },
      { id: 'billing.invoices', label: 'View invoices' },
      { id: 'billing.refunds', label: 'Refund management', danger: true },
      { id: 'billing.settings', label: 'Billing settings' },
      { id: 'billing.plans', label: 'Manage plans' },
    ],
  },
  {
    id: 'ai',
    label: 'AI',
    permissions: [
      { id: 'ai.viewConfig', label: 'View AI configuration' },
      { id: 'ai.viewUsage', label: 'View AI usage' },
      { id: 'ai.manageLimits', label: 'Manage AI limits' },
      { id: 'ai.manageSettings', label: 'Manage AI settings' },
    ],
  },
  {
    id: 'channels',
    label: 'Channels',
    permissions: [
      { id: 'channels.voice', label: 'View Voice' },
      { id: 'channels.whatsapp', label: 'View WhatsApp' },
      { id: 'channels.instagram', label: 'View Instagram' },
      { id: 'channels.manage', label: 'Manage integrations' },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    permissions: [
      { id: 'analytics.platform', label: 'Platform analytics' },
      { id: 'analytics.business', label: 'Business analytics' },
      { id: 'analytics.revenue', label: 'Revenue analytics' },
      { id: 'analytics.usage', label: 'Usage analytics' },
    ],
  },
  {
    id: 'support',
    label: 'Support',
    permissions: [
      { id: 'support.view', label: 'View tickets' },
      { id: 'support.create', label: 'Create tickets' },
      { id: 'support.resolve', label: 'Resolve tickets' },
      { id: 'support.assign', label: 'Assign tickets' },
      { id: 'support.announce', label: 'Publish announcements' },
    ],
  },
  {
    id: 'system',
    label: 'System',
    permissions: [
      { id: 'system.settings', label: 'Platform settings' },
      { id: 'system.security', label: 'Security centre' },
      { id: 'system.audit', label: 'Audit logs' },
      { id: 'system.admins', label: 'Manage admins', danger: true },
      { id: 'system.features', label: 'Feature flags' },
      { id: 'system.maintenance', label: 'Maintenance mode', danger: true },
    ],
  },
]

export const allPermissions = permissionGroups.flatMap((g) => g.permissions.map((p) => p.id))

export const permissionLabels = Object.fromEntries(
  permissionGroups.flatMap((g) => g.permissions.map((p) => [p.id, `${g.label}: ${p.label}`])),
)

export const roles = [
  {
    id: 'super-admin',
    name: 'Super Admin',
    description: 'Unrestricted access to every part of the platform.',
    permissions: allPermissions,
    locked: true,
  },
  {
    id: 'operations-admin',
    name: 'Operations Admin',
    description: 'Day-to-day running of businesses, users, conversations and support.',
    permissions: [
      'businesses.view', 'businesses.edit', 'businesses.suspend', 'businesses.activate',
      'users.view', 'users.edit', 'users.suspend',
      'channels.voice', 'channels.whatsapp', 'channels.instagram',
      'ai.viewConfig', 'ai.viewUsage',
      'analytics.platform', 'analytics.business',
      'support.view', 'support.resolve', 'support.assign',
    ],
  },
  {
    id: 'billing-admin',
    name: 'Billing Admin',
    description: 'Plans, subscriptions, payments, invoices and revenue.',
    permissions: [
      'businesses.view',
      'subscriptions.view', 'subscriptions.create', 'subscriptions.changePlan', 'subscriptions.cancel', 'subscriptions.extend',
      'billing.payments', 'billing.invoices', 'billing.refunds', 'billing.settings', 'billing.plans',
      'analytics.revenue',
    ],
  },
  {
    id: 'support-admin',
    name: 'Support Admin',
    description: 'Customer-facing support across businesses, users and tickets.',
    permissions: [
      'businesses.view', 'users.view',
      'support.view', 'support.create', 'support.resolve', 'support.assign',
      'channels.voice', 'channels.whatsapp', 'channels.instagram',
      'analytics.business',
    ],
  },
  {
    id: 'analytics-admin',
    name: 'Analytics Admin',
    description: 'Read-only access to reporting across the platform.',
    permissions: [
      'businesses.view', 'users.view',
      'analytics.platform', 'analytics.business', 'analytics.revenue', 'analytics.usage',
      'ai.viewUsage',
    ],
  },
  {
    id: 'custom',
    name: 'Custom Admin',
    description: 'Pick individual permissions from the matrix below.',
    permissions: [],
  },
]

export const roleById = (id) => roles.find((r) => r.id === id) || roles[roles.length - 1]

export const roleNames = roles.map((r) => r.name)
