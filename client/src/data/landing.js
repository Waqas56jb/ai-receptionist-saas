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
  Sparkles,
  Languages,
  Radio,
  BookOpen,
  HelpCircle,
  Mail,
  Mic,
  BadgeCheck,
} from 'lucide-react'

export const navLinks = [
  { label: 'Product', href: '#product' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Industries', href: '#industries' },
  { label: 'Pricing', href: '#pricing' },
]

export const megaNav = {
  product: {
    columns: [
      {
        title: 'Software',
        items: [
          { href: '#how-it-works', icon: Sparkles, title: 'How it works', hint: 'Go live the same day', color: '#14b8a6', bg: 'rgba(38,207,166,.12)' },
          { href: '#knowledge', icon: Database, title: 'Knowledge base', hint: 'Train it on your business', color: '#60a5fa', bg: 'rgba(96,165,250,.14)' },
          { href: '#product', icon: Mic, title: 'Voice agent', hint: 'Answer calls in a natural voice', color: '#c084fc', bg: 'rgba(192,132,252,.14)' },
          { href: '#solutions', icon: MessageSquare, title: 'Messaging', hint: 'WhatsApp, web and social', color: '#fbbf24', bg: 'rgba(251,191,36,.14)' },
          { href: '#preview', icon: Radio, title: 'Live inbox', hint: 'Every conversation in one place', color: '#fb7185', bg: 'rgba(251,113,133,.14)' },
        ],
      },
      {
        title: 'Channels',
        items: [
          { href: '#solutions', icon: PhoneCall, title: 'Phone', hint: 'Never miss another call', color: '#14b8a6', bg: 'rgba(38,207,166,.12)' },
          { href: '#solutions', icon: MessageSquare, title: 'WhatsApp', hint: 'Instant replies on chat', color: '#60a5fa', bg: 'rgba(96,165,250,.14)' },
          { href: '#solutions', icon: Instagram, title: 'Instagram', hint: 'Handle DMs as they arrive', color: '#c084fc', bg: 'rgba(192,132,252,.14)' },
          { href: '#solutions', icon: Globe, title: 'Web chat', hint: 'Catch visitors before they leave', color: '#fbbf24', bg: 'rgba(251,191,36,.14)' },
        ],
      },
    ],
    featured: {
      href: '#preview',
      eyebrow: 'Dashboard',
      title: 'See every conversation in one inbox',
      cta: 'Browse the product',
    },
  },
  solutions: {
    columns: [
      {
        title: 'By industry',
        items: [
          { href: '#industries', icon: Building2, title: 'Hotels', hint: 'Rooms, amenities, bookings', color: '#14b8a6', bg: 'rgba(38,207,166,.12)' },
          { href: '#industries', icon: Stethoscope, title: 'Clinics', hint: 'Appointments and FAQs', color: '#60a5fa', bg: 'rgba(96,165,250,.14)' },
          { href: '#industries', icon: UtensilsCrossed, title: 'Restaurants', hint: 'Menus, hours, reservations', color: '#c084fc', bg: 'rgba(192,132,252,.14)' },
          { href: '#industries', icon: ShoppingBag, title: 'Retail', hint: 'Stock, prices, store info', color: '#fbbf24', bg: 'rgba(251,191,36,.14)' },
        ],
      },
      {
        title: 'By setup',
        items: [
          { href: '#industries', icon: Home, title: 'Real estate', hint: 'Qualify viewings fast', color: '#14b8a6', bg: 'rgba(38,207,166,.12)' },
          { href: '#industries', icon: Briefcase, title: 'Professional services', hint: 'Capture new client enquiries', color: '#60a5fa', bg: 'rgba(96,165,250,.14)' },
          { href: '#availability', icon: MoonStar, title: 'After hours', hint: 'Answer while you sleep', color: '#c084fc', bg: 'rgba(192,132,252,.14)' },
          { href: '#multilingual', icon: Languages, title: 'Multilingual', hint: 'Reply in the caller’s language', color: '#fbbf24', bg: 'rgba(251,191,36,.14)' },
        ],
      },
    ],
    featured: {
      href: '#industries',
      eyebrow: 'Industries',
      title: 'Built for any business that talks to customers',
      cta: 'See industries',
    },
  },
  resources: {
    columns: [
      {
        title: 'Learn',
        items: [
          { href: '#how-it-works', icon: BookOpen, title: 'Setup guide', hint: 'Live the same day you sign up', color: '#14b8a6', bg: 'rgba(38,207,166,.12)' },
          { href: '#faq', icon: HelpCircle, title: 'FAQ', hint: 'The questions people ask first', color: '#60a5fa', bg: 'rgba(96,165,250,.14)' },
        ],
      },
      {
        title: 'Company',
        items: [
          { href: 'mailto:hello@example.com', icon: Mail, title: 'Contact us', hint: 'A human answers every message', color: '#14b8a6', bg: 'rgba(38,207,166,.12)' },
          { href: '#pricing', icon: BadgeCheck, title: 'Pricing', hint: 'Plans for every stage', color: '#60a5fa', bg: 'rgba(96,165,250,.14)' },
        ],
      },
    ],
    featured: {
      href: '#faq',
      eyebrow: 'FAQ',
      title: 'Answers before you commit',
      cta: 'Read the FAQ',
    },
  },
}

export const capabilityChannels = [
  { icon: PhoneCall, label: 'Phone' },
  { icon: MessageSquare, label: 'WhatsApp' },
  { icon: Instagram, label: 'Instagram' },
  { icon: Globe, label: 'Web' },
  { icon: CalendarDays, label: 'Calendar' },
]

export const heroStats = [
  { value: '24/7', suffix: '', label: 'Always on', color: '#14b8a6', bg: 'rgba(38,207,166,.12)' },
  { value: 'Instant', suffix: '', label: 'Reply speed', color: '#60a5fa', bg: 'rgba(96,165,250,.14)' },
  { value: 'No', suffix: '', label: 'New hardware', color: '#c084fc', bg: 'rgba(192,132,252,.14)' },
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

export const platformFeatures = [
  {
    n: '01',
    title: 'Natural voice calls',
    description: 'Pick up every inbound call in a warm, natural voice — no hold music, no missed rings.',
    color: '#14b8a6',
    from: '#26cfa6',
    to: '#0f6b5e',
    icon: PhoneCall,
  },
  {
    n: '02',
    title: 'Messaging inbox',
    description: 'WhatsApp, Instagram and web chat land in one place, answered by the same AI.',
    color: '#60a5fa',
    from: '#60a5fa',
    to: '#1d4ed8',
    icon: MessageSquare,
  },
  {
    n: '03',
    title: 'Business knowledge',
    description: 'Train it once on your services, prices, hours and policies. It never invents an answer.',
    color: '#c084fc',
    from: '#c084fc',
    to: '#6d28d9',
    icon: Database,
  },
  {
    n: '04',
    title: 'Leads & bookings',
    description: 'Capture names, dates and intent, then book or qualify before a human ever steps in.',
    color: '#fbbf24',
    from: '#fbbf24',
    to: '#b45309',
    icon: CalendarDays,
  },
  {
    n: '05',
    title: 'Multilingual replies',
    description: 'Detect the customer’s language automatically and answer in the same one, on every channel.',
    color: '#fb7185',
    from: '#fb7185',
    to: '#be123c',
    icon: Languages,
  },
  {
    n: '06',
    title: 'Human handover',
    description: 'Your team can take over any conversation. The AI steps back the moment you do.',
    color: '#34d399',
    from: '#34d399',
    to: '#047857',
    icon: Users,
  },
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
    tags: ['Voice', 'Voicemail', 'Transfer'],
    kicker: 'Always on 01',
  },
  {
    icon: MessageSquare,
    title: 'WhatsApp',
    description: 'Respond to customer conversations instantly on the channel they already use.',
    tags: ['Chat', 'Lead capture', 'Booking'],
    kicker: 'Instant 02',
  },
  {
    icon: Instagram,
    title: 'Instagram',
    description: 'Handle enquiries and direct messages from the profile customers discover you on.',
    tags: ['DMs', 'FAQs', 'Handover'],
    kicker: 'Social 03',
  },
  {
    icon: Globe,
    title: 'Web',
    description: 'Connect the AI to website communication so visitors get answers before they leave.',
    tags: ['Widget', 'Live chat', 'No install'],
    kicker: 'On-site 04',
  },
]

export const steps = [
  {
    number: '01',
    title: 'Add your business',
    description:
      'Create your profile and teach the AI your services, prices, hours and documents — once.',
    icon: Building2,
    tags: ['Profile', 'Knowledge'],
    href: '#knowledge',
  },
  {
    number: '02',
    title: 'Connect your channels',
    description:
      'Forward the number you already use, or connect WhatsApp, Instagram and web chat.',
    icon: PhoneCall,
    tags: ['Phone', 'WhatsApp', 'Web'],
    href: '#solutions',
  },
  {
    number: '03',
    title: 'Set the rules',
    description:
      'Choose tone, language, booking rules and when to hand over to a person.',
    icon: Brain,
    tags: ['Prompt', 'Handover'],
    href: '#product',
  },
  {
    number: '04',
    title: 'Let AI handle conversations',
    description:
      'It answers 24/7 while you follow every call and message from one inbox.',
    icon: Radio,
    tags: ['Inbox', 'Leads'],
    href: '#preview',
  },
]

export const industries = [
  {
    icon: Building2,
    name: 'Hotels',
    useCase: 'Answer guest questions, enquiries and booking requests.',
    tags: ['Guest info', 'Wayfinding'],
    image:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=70',
    alt: 'Poolside terrace of a boutique hotel at dusk',
  },
  {
    icon: Stethoscope,
    name: 'Clinics',
    useCase: 'Handle appointment enquiries and common patient questions.',
    tags: ['Appointments', 'FAQs'],
    image:
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=70',
    alt: 'Healthcare reception area in a modern clinic',
  },
  {
    icon: UtensilsCrossed,
    name: 'Restaurants',
    useCase: 'Answer menu, opening-hour and reservation questions.',
    tags: ['Reservations', 'Menus'],
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=70',
    alt: 'Modern restaurant dining room prepared for service',
  },
  {
    icon: ShoppingBag,
    name: 'Retail',
    useCase: 'Share product availability, pricing and store information.',
    tags: ['Stock', 'Pricing'],
    image:
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=900&q=70',
    alt: 'Retail store interior with clothing and accessories on display',
  },
  {
    icon: Home,
    name: 'Real Estate',
    useCase: 'Qualify property enquiries and schedule viewings.',
    tags: ['Viewings', 'Qualify'],
    image:
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=70',
    alt: 'Model house and property keys resting on a desk',
  },
  {
    icon: Briefcase,
    name: 'Professional Services',
    useCase: 'Capture new client enquiries and answer service questions.',
    tags: ['Intake', 'Services'],
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
    id: 'starter',
    name: 'Starter',
    price: 'Coming Soon',
    hint: 'One channel · one business',
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
    id: 'professional',
    name: 'Professional',
    price: 'Coming Soon',
    hint: 'Phone, WhatsApp, Instagram & web',
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
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Talk to Sales',
    hint: 'Multi-location & custom limits',
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

export const faqs = [
  {
    q: 'What is it?',
    a: 'An AI receptionist for your business. It answers phone calls and customer messages — WhatsApp, Instagram, web chat and more — using the information you train it on, 24/7.',
  },
  {
    q: 'Who is it built for?',
    a: 'Hotels, clinics, restaurants, retailers, real-estate teams and professional services that cannot afford to miss a call or a message. No technical background required.',
  },
  {
    q: 'Which channels does it cover?',
    a: 'Phone calls, voice messages, WhatsApp, website chat and Instagram DMs. Customers keep using the channels they already prefer. You follow everything from one inbox.',
  },
  {
    q: 'How does the AI know my business?',
    a: 'You add services, prices, hours, policies and documents to a private knowledge base. The AI answers only from that information — never from another business, never from generic guesses.',
  },
  {
    q: 'Does it speak more than one language?',
    a: 'Yes. It detects the language a customer writes or speaks in and replies in the same one. Your team can still read a translated transcript in the dashboard.',
  },
  {
    q: 'What happens when a customer wants a person?',
    a: 'The AI hands over. You set the rules — complaints, group bookings, anything you want a human to own — and your team can step into any live conversation.',
  },
  {
    q: 'How long does setup take?',
    a: 'Most businesses add their information, connect a channel and take their first AI conversation the same day. No new hardware and no site visit.',
  },
  {
    q: 'How do I get started?',
    a: 'Create an account, add your business details, connect a phone number or messaging channel, and go live. We can also walk you through it on a short call.',
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
      { label: 'About', href: '#product' },
      { label: 'Contact', href: 'mailto:hello@example.com' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
]
