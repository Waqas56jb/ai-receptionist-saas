import {
  LayoutDashboard,
  Bot,
  Brain,
  Database,
  SlidersHorizontal,
  MessageSquare,
  MessagesSquare,
  ChartNoAxesCombined,
  Gauge,
  Radio,
  CreditCard,
  Building2,
  UsersRound,
  Bell,
  Shield,
  UserRound,
  LifeBuoy,
  FlaskConical,
  Globe,
} from 'lucide-react'

/** Sidebar structure for the business portal. Groups are collapsible. */
export const navigation = [
  {
    id: 'overview',
    label: 'Overview',
    items: [{ label: 'Dashboard', to: '/app/dashboard', icon: LayoutDashboard, end: true }],
  },
  {
    id: 'ai',
    label: 'AI Receptionist',
    items: [
      { label: 'AI Overview', to: '/app/ai-agent', icon: Bot },
      { label: 'AI Training', to: '/app/ai-training', icon: Brain, end: true },
      { label: 'Knowledge Base', to: '/app/knowledge-base', icon: Database },
      { label: 'Prompt Configuration', to: '/app/ai-training/prompts', icon: SlidersHorizontal },
      { label: 'Configuration Mode', to: '/app/ai-config', icon: FlaskConical },
      { label: 'WhatsApp Agent', to: '/app/whatsapp-agent', icon: MessageSquare },
      { label: 'Website Widget', to: '/app/website-widget', icon: Globe },
      { label: 'AI Playground', to: '/app/ai-test', icon: FlaskConical },
    ],
  },
  {
    id: 'communication',
    label: 'Communication',
    items: [{ label: 'Conversations', to: '/app/conversations', icon: MessagesSquare }],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    items: [
      { label: 'Analytics', to: '/app/analytics', icon: ChartNoAxesCombined },
      { label: 'Usage', to: '/app/usage', icon: Gauge },
    ],
  },
  {
    id: 'integrations',
    label: 'Integrations',
    items: [
      { label: 'Channels', to: '/app/channels', icon: Radio },
      { label: 'WhatsApp', to: '/app/integrations/whatsapp', icon: MessageSquare },
      { label: 'Website Widget', to: '/app/website-widget', icon: Globe },
    ],
  },
  {
    id: 'account',
    label: 'Account',
    items: [
      { label: 'Subscription', to: '/app/subscription', icon: CreditCard },
      { label: 'Business Settings', to: '/app/settings/business', icon: Building2 },
      { label: 'Team / Users', to: '/app/settings/team', icon: UsersRound },
      { label: 'Notifications', to: '/app/settings/notifications', icon: Bell },
      { label: 'Security', to: '/app/settings/security', icon: Shield },
      { label: 'Profile', to: '/app/settings/profile', icon: UserRound },
      { label: 'Help & Support', to: '/app/help', icon: LifeBuoy },
    ],
  },
]

export default navigation
