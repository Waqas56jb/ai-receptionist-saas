import {
  LayoutDashboard,
  Bot,
  Brain,
  Database,
  SlidersHorizontal,
  Mic,
  MessageSquare,
  Instagram,
  MessagesSquare,
  Phone,
  FileText,
  Send,
  Users,
  UserRound,
  Target,
  CalendarDays,
  ChartNoAxesCombined,
  Gauge,
  Radio,
  CalendarClock,
  CreditCard,
  Building2,
  UsersRound,
  Bell,
  Shield,
  LifeBuoy,
  FlaskConical,
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
      { label: 'Voice Agent', to: '/app/voice-agent', icon: Mic },
      { label: 'WhatsApp Agent', to: '/app/whatsapp-agent', icon: MessageSquare },
      { label: 'Instagram Agent', to: '/app/instagram-agent', icon: Instagram },
      { label: 'AI Playground', to: '/app/ai-test', icon: FlaskConical },
    ],
  },
  {
    id: 'communication',
    label: 'Communication',
    items: [
      { label: 'Conversations', to: '/app/conversations', icon: MessagesSquare },
      { label: 'Calls', to: '/app/calls', icon: Phone },
      { label: 'Messages', to: '/app/messages', icon: Send },
      { label: 'Transcripts', to: '/app/transcripts', icon: FileText },
    ],
  },
  {
    id: 'crm',
    label: 'CRM',
    items: [
      { label: 'Contacts', to: '/app/contacts', icon: Users },
      { label: 'Leads', to: '/app/leads', icon: Target },
      { label: 'Bookings', to: '/app/bookings', icon: CalendarDays },
    ],
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
      { label: 'Phone / Twilio', to: '/app/integrations/phone', icon: Phone },
      { label: 'WhatsApp', to: '/app/integrations/whatsapp', icon: MessageSquare },
      { label: 'Instagram', to: '/app/integrations/instagram', icon: Instagram },
      { label: 'Calendar', to: '/app/integrations/calendar', icon: CalendarClock },
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
