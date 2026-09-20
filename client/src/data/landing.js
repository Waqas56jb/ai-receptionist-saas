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
  Building,
  Stethoscope,
  UtensilsCrossed,
  ShoppingBag,
  ShoppingCart,
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
  Landmark,
  Wallet,
  Hospital,
  Pill,
  Coffee,
  GraduationCap,
  Smartphone,
  Monitor,
  Truck,
  Plane,
  HardHat,
  Scale,
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
        title: 'Finance, health & public',
        items: [
          { href: '#industries', icon: Landmark, title: 'Bank', hint: 'Djibouti National Bank', color: '#14b8a6', bg: 'rgba(38,207,166,.12)' },
          { href: '#industries', icon: Wallet, title: 'Microfinance Institution', hint: 'Djibouti Microfinance Center', color: '#60a5fa', bg: 'rgba(96,165,250,.14)' },
          { href: '#industries', icon: Shield, title: 'Insurance Company', hint: 'Horn Africa Insurance', color: '#c084fc', bg: 'rgba(192,132,252,.14)' },
          { href: '#industries', icon: Hospital, title: 'Hospital', hint: 'City General Hospital', color: '#fbbf24', bg: 'rgba(251,191,36,.14)' },
          { href: '#industries', icon: Stethoscope, title: 'Medical Clinic', hint: 'Al-Rahma Medical Clinic', color: '#14b8a6', bg: 'rgba(38,207,166,.12)' },
          { href: '#industries', icon: Pill, title: 'Pharmacy', hint: 'Central Care Pharmacy', color: '#60a5fa', bg: 'rgba(96,165,250,.14)' },
          { href: '#industries', icon: GraduationCap, title: 'University', hint: 'International Business University', color: '#c084fc', bg: 'rgba(192,132,252,.14)' },
          { href: '#industries', icon: BookOpen, title: 'Training Center', hint: 'Professional Skills Academy', color: '#fbbf24', bg: 'rgba(251,191,36,.14)' },
          { href: '#industries', icon: Building, title: 'Government Institution', hint: 'National Business Registration Office', color: '#14b8a6', bg: 'rgba(38,207,166,.12)' },
          { href: '#industries', icon: Scale, title: 'Law Firm', hint: 'Horizon Legal Services', color: '#60a5fa', bg: 'rgba(96,165,250,.14)' },
        ],
      },
      {
        title: 'Hospitality, trade & services',
        items: [
          { href: '#industries', icon: UtensilsCrossed, title: 'Restaurant', hint: 'Sultan Restaurant', color: '#14b8a6', bg: 'rgba(38,207,166,.12)' },
          { href: '#industries', icon: Coffee, title: 'Café', hint: 'Blue Ocean Café', color: '#60a5fa', bg: 'rgba(96,165,250,.14)' },
          { href: '#industries', icon: Building2, title: 'Hotel', hint: 'Djibouti Palace Hotel', color: '#c084fc', bg: 'rgba(192,132,252,.14)' },
          { href: '#industries', icon: ShoppingCart, title: 'Supermarket', hint: 'City Market Supermarket', color: '#fbbf24', bg: 'rgba(251,191,36,.14)' },
          { href: '#industries', icon: Smartphone, title: 'Telecommunications', hint: 'East Africa Telecom', color: '#14b8a6', bg: 'rgba(38,207,166,.12)' },
          { href: '#industries', icon: Monitor, title: 'IT Company', hint: 'Digital Solutions Africa', color: '#60a5fa', bg: 'rgba(96,165,250,.14)' },
          { href: '#industries', icon: Truck, title: 'Logistics Company', hint: 'Horn Logistics & Transport', color: '#c084fc', bg: 'rgba(192,132,252,.14)' },
          { href: '#industries', icon: Plane, title: 'Travel Agency', hint: 'Global Travel & Tours', color: '#fbbf24', bg: 'rgba(251,191,36,.14)' },
          { href: '#industries', icon: HardHat, title: 'Construction Company', hint: 'Modern Construction Group', color: '#14b8a6', bg: 'rgba(38,207,166,.12)' },
          { href: '#industries', icon: Home, title: 'Real Estate Agency', hint: 'City Properties & Real Estate', color: '#60a5fa', bg: 'rgba(96,165,250,.14)' },
        ],
      },
    ],
    featured: {
      href: '#industries',
      eyebrow: 'Industries',
      title: 'Twenty sectors. One receptionist.',
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
    icon: Landmark,
    sector: 'Bank',
    name: 'Djibouti National Bank',
    useCase: 'Answer account questions, branch hours and product enquiries without putting callers on hold.',
    tags: ['Accounts', 'Branch hours', 'Products'],
    lines: ['What time does the Plateau branch close?', 'Do you offer a SME current account?', 'I need the SWIFT code for a transfer.'],
    image: 'https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?auto=format&fit=crop&w=900&q=70',
    alt: 'Bank hall with teller counters and waiting customers',
  },
  {
    icon: Wallet,
    sector: 'Microfinance Institution',
    name: 'Djibouti Microfinance Center',
    useCase: 'Qualify loan enquiries, explain repayment steps and book meetings with an officer.',
    tags: ['Loans', 'Repayment', 'Appointments'],
    lines: ['What documents do I need for a micro-loan?', 'Can I reschedule this week’s repayment?', 'Book me with a loan officer tomorrow.'],
    image: 'https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=900&q=70',
    alt: 'Hands reviewing financial documents at a desk',
  },
  {
    icon: Shield,
    sector: 'Insurance Company',
    name: 'Horn Africa Insurance',
    useCase: 'Handle policy questions, capture claims intake and route quotes to the right desk.',
    tags: ['Policies', 'Claims', 'Quotes'],
    lines: ['Does my policy cover hospital stays?', 'I need to open a motor claim.', 'Send me a quote for family health cover.'],
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=900&q=70',
    alt: 'Insurance documents and a pen on a wooden desk',
  },
  {
    icon: Hospital,
    sector: 'Hospital',
    name: 'City General Hospital',
    useCase: 'Direct callers to the right department, share visiting hours and take appointment requests.',
    tags: ['Departments', 'Visiting hours', 'Appointments'],
    lines: ['Where is the cardiology ward?', 'What are evening visiting hours?', 'I need an appointment with Dr Hassan.'],
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=900&q=70',
    alt: 'Hospital reception and corridor',
  },
  {
    icon: Stethoscope,
    sector: 'Medical Clinic',
    name: 'Al-Rahma Medical Clinic',
    useCase: 'Handle appointment enquiries, clinic hours and common patient questions.',
    tags: ['Appointments', 'Hours', 'FAQs'],
    lines: ['Do you have a slot this afternoon?', 'Is the clinic open on Friday?', 'Which vaccinations do you offer?'],
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=70',
    alt: 'Clinician with a stethoscope in a medical clinic',
  },
  {
    icon: Pill,
    sector: 'Pharmacy',
    name: 'Central Care Pharmacy',
    useCase: 'Confirm opening hours, stock questions and prescription collection times.',
    tags: ['Hours', 'Stock', 'Prescriptions'],
    lines: ['Are you open after 8pm?', 'Do you have paediatric paracetamol in stock?', 'When can I collect prescription 1842?'],
    image: 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=900&q=70',
    alt: 'Pharmacy shelves stocked with medicines',
  },
  {
    icon: UtensilsCrossed,
    sector: 'Restaurant',
    name: 'Sultan Restaurant',
    useCase: 'Answer menu, opening-hour and reservation questions as they come in.',
    tags: ['Reservations', 'Menu', 'Hours'],
    lines: ['A table for four at 8pm tonight?', 'Is the lamb mandi available today?', 'Do you take walk-ins on Friday?'],
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=70',
    alt: 'Restaurant dining room prepared for service',
  },
  {
    icon: Coffee,
    sector: 'Café',
    name: 'Blue Ocean Café',
    useCase: 'Share hours, menu items and table availability for walk-ins and takeaway.',
    tags: ['Hours', 'Menu', 'Tables'],
    lines: ['Are you open for breakfast?', 'Do you have oat milk?', 'Is there a table for two on the terrace?'],
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=70',
    alt: 'Café counter with coffee being prepared',
  },
  {
    icon: Building2,
    sector: 'Hotel',
    name: 'Djibouti Palace Hotel',
    useCase: 'Answer guest questions, room availability, amenities and booking requests.',
    tags: ['Rooms', 'Amenities', 'Bookings'],
    lines: ['Do you have a sea-view room tonight?', 'Is breakfast included?', 'What time is checkout?'],
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=70',
    alt: 'Hotel pool terrace at dusk',
  },
  {
    icon: GraduationCap,
    sector: 'University',
    name: 'International Business University',
    useCase: 'Handle admissions questions, programme details and campus information.',
    tags: ['Admissions', 'Programmes', 'Campus'],
    lines: ['When does the MBA intake close?', 'Is the campus open to visitors on Saturday?', 'What is the tuition for year one?'],
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=70',
    alt: 'University campus building and graduates',
  },
  {
    icon: BookOpen,
    sector: 'Training Center',
    name: 'Professional Skills Academy',
    useCase: 'Share course dates, enrolment steps and fee information.',
    tags: ['Courses', 'Enrolment', 'Fees'],
    lines: ['When does the Excel course start?', 'How do I enrol for evening classes?', 'What is the fee for the English programme?'],
    image: 'https://images.unsplash.com/photo-1524178232363-1fbdb6e5cf18?auto=format&fit=crop&w=900&q=70',
    alt: 'Training classroom with adult learners',
  },
  {
    icon: ShoppingCart,
    sector: 'Supermarket',
    name: 'City Market Supermarket',
    useCase: 'Share store hours, product availability and delivery or pickup details.',
    tags: ['Hours', 'Stock', 'Delivery'],
    lines: ['Are you open on Friday afternoon?', 'Do you deliver to Balbala?', 'Is bottled water in stock?'],
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=900&q=70',
    alt: 'Supermarket aisle with grocery shelves',
  },
  {
    icon: Smartphone,
    sector: 'Telecommunications',
    name: 'East Africa Telecom',
    useCase: 'Answer plan questions, coverage checks and first-line support before handing over.',
    tags: ['Plans', 'Coverage', 'Support'],
    lines: ['Which prepaid plan includes 20GB?', 'Is there 4G coverage in Tadjourah?', 'My SIM is not connecting.'],
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=70',
    alt: 'Person using a smartphone at a desk',
  },
  {
    icon: Monitor,
    sector: 'IT Company',
    name: 'Digital Solutions Africa',
    useCase: 'Capture service enquiries, support tickets and meeting requests.',
    tags: ['Services', 'Support', 'Quotes'],
    lines: ['Can you rebuild our company website?', 'I need to open a support ticket.', 'Book a call with your solutions team.'],
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=70',
    alt: 'IT workspace with circuit boards and screens',
  },
  {
    icon: Truck,
    sector: 'Logistics Company',
    name: 'Horn Logistics & Transport',
    useCase: 'Take tracking questions, freight quotes and pickup bookings.',
    tags: ['Tracking', 'Quotes', 'Pickup'],
    lines: ['Where is shipment HL-2041?', 'Quote a container to Addis Ababa.', 'Can you collect from the port tomorrow?'],
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=70',
    alt: 'Warehouse with stacked freight and a forklift',
  },
  {
    icon: Plane,
    sector: 'Travel Agency',
    name: 'Global Travel & Tours',
    useCase: 'Answer package questions, capture booking intent and collect traveller details.',
    tags: ['Packages', 'Bookings', 'Visas'],
    lines: ['What is included in the Dubai package?', 'Hold two seats for 12 October.', 'Do you help with Schengen visa files?'],
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=900&q=70',
    alt: 'Travel planning with a map, passport and camera',
  },
  {
    icon: HardHat,
    sector: 'Construction Company',
    name: 'Modern Construction Group',
    useCase: 'Qualify project enquiries, share office hours and book site-visit calls.',
    tags: ['Projects', 'Quotes', 'Site visits'],
    lines: ['Can you quote a two-storey villa?', 'Are you taking commercial fit-outs?', 'Send someone to visit the plot on Saturday.'],
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=70',
    alt: 'Construction site with scaffolding and workers',
  },
  {
    icon: Scale,
    sector: 'Law Firm',
    name: 'Horizon Legal Services',
    useCase: 'Capture new-matter intake, share practice areas and book consultations.',
    tags: ['Intake', 'Practice areas', 'Consultations'],
    lines: ['Do you handle commercial contracts?', 'I need a consultation this week.', 'What documents should I bring?'],
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=900&q=70',
    alt: 'Law books and a wooden gavel on a desk',
  },
  {
    icon: Building,
    sector: 'Government Institution',
    name: 'National Business Registration Office',
    useCase: 'Share opening hours, document requirements and appointment slots.',
    tags: ['Hours', 'Requirements', 'Appointments'],
    lines: ['What do I need to register a company?', 'Is the counter open on Thursday morning?', 'Book me a company-name reservation slot.'],
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=900&q=70',
    alt: 'Government office building exterior',
  },
  {
    icon: Home,
    sector: 'Real Estate Agency',
    name: 'City Properties & Real Estate',
    useCase: 'Qualify property enquiries and schedule viewings for buyers and tenants.',
    tags: ['Listings', 'Viewings', 'Qualify'],
    lines: ['Is the two-bed in Haramous still available?', 'Can I view on Saturday at 11?', 'What is the monthly rent including charges?'],
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=900&q=70',
    alt: 'House keys and a property model on a desk',
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
    a: 'Banks, microfinance, insurance, hospitals, clinics, pharmacies, restaurants, cafés, hotels, universities, training centres, supermarkets, telecom, IT, logistics, travel, construction, law firms, government offices and real-estate agencies — any organisation that cannot miss a call or a message. No technical background required.',
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
    title: 'Sectors',
    links: [
      { label: 'Bank', href: '#industries' },
      { label: 'Microfinance Institution', href: '#industries' },
      { label: 'Insurance Company', href: '#industries' },
      { label: 'Hospital', href: '#industries' },
      { label: 'Medical Clinic', href: '#industries' },
      { label: 'Pharmacy', href: '#industries' },
      { label: 'Restaurant', href: '#industries' },
      { label: 'Café', href: '#industries' },
      { label: 'Hotel', href: '#industries' },
      { label: 'University', href: '#industries' },
    ],
  },
  {
    title: 'More sectors',
    links: [
      { label: 'Training Center', href: '#industries' },
      { label: 'Supermarket', href: '#industries' },
      { label: 'Telecommunications', href: '#industries' },
      { label: 'IT Company', href: '#industries' },
      { label: 'Logistics Company', href: '#industries' },
      { label: 'Travel Agency', href: '#industries' },
      { label: 'Construction Company', href: '#industries' },
      { label: 'Law Firm', href: '#industries' },
      { label: 'Government Institution', href: '#industries' },
      { label: 'Real Estate Agency', href: '#industries' },
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
