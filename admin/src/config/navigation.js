import {
  LayoutDashboard, Building2, Users, ShieldCheck, CreditCard, Layers, Receipt, Banknote,
  Bot, Mic, MessageSquare, Instagram, MessagesSquare, Phone, Send, FileText,
  ChartNoAxesCombined, Gauge, TrendingUp, LifeBuoy, Megaphone, ScrollText, Lock,
  Plug, ToggleLeft, Wrench, Settings,
} from 'lucide-react'

/** Sidebar structure. `permission` hides an item the current role cannot use. */
export const navigation = [
  {
    id: 'overview',
    label: 'Overview',
    items: [{ label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard }],
  },
  {
    id: 'platform',
    label: 'Platform',
    items: [
      { label: 'Businesses', to: '/businesses', icon: Building2, permission: 'businesses.view' },
      { label: 'Users', to: '/users', icon: Users, permission: 'users.view' },
      { label: 'Admins', to: '/admins', icon: ShieldCheck, permission: 'system.admins' },
    ],
  },
  {
    id: 'revenue',
    label: 'Revenue',
    items: [
      { label: 'Subscriptions', to: '/subscriptions', icon: CreditCard, permission: 'subscriptions.view' },
      { label: 'Plans', to: '/plans', icon: Layers, permission: 'billing.plans' },
      { label: 'Payments', to: '/payments', icon: Banknote, permission: 'billing.payments' },
      { label: 'Invoices', to: '/invoices', icon: Receipt, permission: 'billing.invoices' },
    ],
  },
  {
    id: 'ai',
    label: 'AI & Communication',
    items: [
      { label: 'AI Agents', to: '/ai-agents', icon: Bot, permission: 'ai.viewConfig' },
      { label: 'AI Usage', to: '/ai-usage', icon: Gauge, permission: 'ai.viewUsage' },
      { label: 'Voice', to: '/voice', icon: Mic, permission: 'channels.voice' },
      { label: 'WhatsApp', to: '/whatsapp', icon: MessageSquare, permission: 'channels.whatsapp' },
      { label: 'Instagram', to: '/instagram', icon: Instagram, permission: 'channels.instagram' },
      { label: 'Conversations', to: '/conversations', icon: MessagesSquare, permission: 'analytics.business' },
      { label: 'Calls', to: '/calls', icon: Phone, permission: 'analytics.business' },
      { label: 'Messages', to: '/messages', icon: Send, permission: 'analytics.business' },
      { label: 'Transcripts', to: '/transcripts', icon: FileText, permission: 'analytics.business' },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    items: [
      { label: 'Platform Analytics', to: '/analytics', icon: ChartNoAxesCombined, permission: 'analytics.platform' },
      { label: 'Revenue Analytics', to: '/analytics/revenue', icon: TrendingUp, permission: 'analytics.revenue' },
      { label: 'Usage Analytics', to: '/analytics/usage', icon: Gauge, permission: 'analytics.usage' },
    ],
  },
  {
    id: 'support',
    label: 'Support',
    items: [
      { label: 'Support Tickets', to: '/support', icon: LifeBuoy, permission: 'support.view' },
      { label: 'Announcements', to: '/announcements', icon: Megaphone, permission: 'support.announce' },
    ],
  },
  {
    id: 'security',
    label: 'Security',
    items: [
      { label: 'Audit Logs', to: '/audit-logs', icon: ScrollText, permission: 'system.audit' },
      { label: 'Security', to: '/security', icon: Lock, permission: 'system.security' },
    ],
  },
  {
    id: 'system',
    label: 'System',
    items: [
      { label: 'Integrations', to: '/settings/integrations', icon: Plug, permission: 'system.settings' },
      { label: 'Feature Flags', to: '/settings/features', icon: ToggleLeft, permission: 'system.features' },
      { label: 'Maintenance', to: '/settings/maintenance', icon: Wrench, permission: 'system.maintenance' },
      { label: 'Settings', to: '/settings', icon: Settings, permission: 'system.settings' },
    ],
  },
]

export default navigation
