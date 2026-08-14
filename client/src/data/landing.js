import {
  PhoneCall,
  MessageSquare,
  Instagram,
  Globe,
  CalendarDays,
  PhoneMissed,
  Repeat2,
  MoonStar,
  Timer,
  Building2,
  Stethoscope,
  UtensilsCrossed,
  ShoppingBag,
  Home,
  Briefcase,
  Brain,
  Users,
  FileText,
  Database,
  Shield,
  Lock,
  KeyRound,
  ServerCog,
  EyeOff,
} from 'lucide-react'

export const navLinks = [
  { label: 'Product', href: '#product' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Industries', href: '#industries' },
  { label: 'Pricing', href: '#pricing' },
]

export const capabilityChannels = [
  { icon: PhoneCall, label: 'Phone' },
  { icon: MessageSquare, label: 'WhatsApp' },
  { icon: Instagram, label: 'Instagram' },
  { icon: Globe, label: 'Web' },
  { icon: CalendarDays, label: 'Calendar' },
]

export const problems = [
  {
    icon: PhoneMissed,
    title: 'Missed Calls',
    description: 'Customers call when your team is busy — and most of them never call back.',
  },
  {
    icon: Repeat2,
    title: 'Repetitive Questions',
    description: 'Your staff answers the same questions about hours, prices and availability every day.',
  },
  {
    icon: MoonStar,
    title: 'After-Hours Enquiries',
    description: 'Customers need answers in the evening and on weekends, when your business is closed.',
  },
  {
    icon: Timer,
    title: 'Slow Response Times',
    description: 'People expect a reply in seconds. A late answer usually means a lost customer.',
  },
]

export const solutionFeatures = [
  'Answers phone calls in a natural voice',
  'Replies to WhatsApp, Instagram and web messages',
  'Knows your services, prices, hours and policies',
  'Handles booking and availability enquiries',
  'Captures and qualifies new leads',
  'Speaks multiple languages automatically',
  'Works 24/7, including weekends and holidays',
  'Hands over to your team whenever needed',
]

export const knowledgeItems = [
  { icon: Briefcase, label: 'Services' },
  { icon: FileText, label: 'Prices' },
  { icon: Timer, label: 'Opening hours' },
  { icon: Shield, label: 'Policies' },
  { icon: MessageSquare, label: 'FAQs' },
  { icon: ShoppingBag, label: 'Products' },
  { icon: Building2, label: 'Amenities' },
  { icon: CalendarDays, label: 'Booking information' },
  { icon: Database, label: 'Documents' },
]

export const channels = [
  {
    icon: PhoneCall,
    title: 'Phone',
    description: 'Answer business calls 24/7 with a natural voice that never puts a caller on hold.',
    accent: 'from-brand-500/15 to-brand-500/0',
  },
  {
    icon: MessageSquare,
    title: 'WhatsApp',
    description: 'Respond to customer conversations instantly on the channel they already use.',
    accent: 'from-emerald-500/15 to-emerald-500/0',
  },
  {
    icon: Instagram,
    title: 'Instagram',
    description: 'Handle enquiries and direct messages from the profile customers discover you on.',
    accent: 'from-fuchsia-500/15 to-fuchsia-500/0',
  },
  {
    icon: Globe,
    title: 'Web',
    description: 'Connect the AI to website communication so visitors get answers before they leave.',
    accent: 'from-sky-500/15 to-sky-500/0',
  },
]

export const steps = [
  {
    number: '01',
    title: 'Add Your Business',
    description:
      'Create your business profile and provide your business information — services, prices, hours and documents.',
    icon: Building2,
  },
  {
    number: '02',
    title: 'Connect Your Channels',
    description:
      'Connect your phone number and messaging channels, or simply forward the number you already use.',
    icon: PhoneCall,
  },
  {
    number: '03',
    title: 'Let AI Handle Conversations',
    description:
      'Your AI receptionist starts handling customer conversations 24/7 while you follow everything from one inbox.',
    icon: Brain,
  },
]

/**
 * Editorial photography for the industries grid.
 * Sizes are requested from the CDN so mobile never downloads a desktop-weight file.
 */
export const industries = [
  {
    icon: Building2,
    name: 'Hotels',
    useCase: 'Answer guest questions, enquiries and booking requests.',
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=70',
    alt: 'Poolside terrace of a boutique hotel at dusk',
  },
  {
    icon: Stethoscope,
    name: 'Clinics',
    useCase: 'Handle appointment enquiries and common patient questions.',
    image:
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=70',
    alt: 'Healthcare reception area in a modern clinic',
  },
  {
    icon: UtensilsCrossed,
    name: 'Restaurants',
    useCase: 'Answer menu, opening-hour and reservation questions.',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=70',
    alt: 'Modern restaurant dining room prepared for service',
  },
  {
    icon: ShoppingBag,
    name: 'Retail',
    useCase: 'Share product availability, pricing and store information.',
    image:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=70',
    alt: 'Retail store interior with clothing and accessories on display',
  },
  {
    icon: Home,
    name: 'Real Estate',
    useCase: 'Qualify property enquiries and schedule viewings.',
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=70',
    alt: 'Model house and property keys resting on a desk',
  },
  {
    icon: Briefcase,
    name: 'Professional Services',
    useCase: 'Capture new client enquiries and answer service questions.',
    image:
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=70',
    alt: 'Modern professional office interior with glass meeting rooms',
  },
]

export const securityItems = [
  {
    icon: Database,
    title: 'Business-specific knowledge',
    description:
      'Every business gets its own knowledge base. The AI answers only from the information that business provides.',
  },
  {
    icon: KeyRound,
    title: 'Controlled account access',
    description:
      'Each business has its own account and login, with roles that decide who can see conversations and settings.',
  },
  {
    icon: Lock,
    title: 'Secure authentication architecture',
    description:
      'Built on modern authentication practices with encrypted credentials and session-based access control.',
  },
  {
    icon: EyeOff,
    title: 'Privacy-conscious design',
    description:
      'Customer data stays scoped to the business it belongs to, and you decide what the AI is allowed to share.',
  },
  {
    icon: ServerCog,
    title: 'Reliable infrastructure',
    description:
      'Hosted on managed cloud infrastructure so calls and messages keep being answered around the clock.',
  },
  {
    icon: Users,
    title: 'Human handover, any time',
    description:
      'Your team can step into any conversation, and the AI steps back — nothing happens without your control.',
  },
]

export const pricingPlans = [
  {
    name: 'Starter',
    price: 'Coming Soon',
    description: 'For small businesses taking their first calls and messages with AI.',
    features: [
      'AI receptionist for one business',
      'Phone or messaging channel',
      'Business knowledge base',
      'Conversation history & transcripts',
      'Email support',
    ],
    cta: 'Get Started',
    ctaVariant: 'secondary',
    featured: false,
  },
  {
    name: 'Professional',
    price: 'Coming Soon',
    description: 'For growing businesses handling customers across every channel.',
    features: [
      'Everything in Starter',
      'Phone, WhatsApp, Instagram & web',
      'Higher call and message limits',
      'Contacts & lead management',
      'Advanced AI training and settings',
      'Priority support',
    ],
    cta: 'Get Started',
    ctaVariant: 'primary',
    featured: true,
  },
  {
    name: 'Enterprise',
    price: 'Talk to Sales',
    description: 'For multi-location businesses and teams with custom requirements.',
    features: [
      'Everything in Professional',
      'Multiple locations & numbers',
      'Custom usage limits',
      'Custom onboarding & training',
      'Dedicated account support',
    ],
    cta: 'Talk to Sales',
    ctaVariant: 'secondary',
    featured: false,
  },
]

export const footerColumns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#product' },
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Integrations', href: '#solutions' },
      { label: 'Pricing', href: '#pricing' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'Hotels', href: '#industries' },
      { label: 'Clinics', href: '#industries' },
      { label: 'Restaurants', href: '#industries' },
      { label: 'Retail', href: '#industries' },
      { label: 'Real Estate', href: '#industries' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Contact', href: '#' },
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
    ],
  },
]
