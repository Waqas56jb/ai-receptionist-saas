/**
 * Reference option lists only. Tenant records start empty and come from the API.
 */

export const businessTypes = [
  'Bank',
  'Microfinance Institution',
  'Insurance Company',
  'Hospital',
  'Medical Clinic',
  'Pharmacy',
  'Restaurant',
  'Café',
  'Hotel',
  'University',
  'Training Center',
  'Supermarket',
  'Telecommunications',
  'IT Company',
  'Logistics Company',
  'Travel Agency',
  'Construction Company',
  'Law Firm',
  'Government Institution',
  'Real Estate Agency',
]

export const countries = [
  'Djibouti',
  'France',
  'United Kingdom',
  'United States',
  'Canada',
  'Germany',
  'Spain',
  'Italy',
  'Netherlands',
  'Belgium',
  'Switzerland',
  'United Arab Emirates',
  'Pakistan',
]

export const timezones = [
  'Africa/Djibouti',
  'Europe/Paris',
  'Europe/London',
  'Europe/Berlin',
  'Europe/Madrid',
  'America/New_York',
  'America/Los_Angeles',
  'Asia/Dubai',
  'Asia/Karachi',
]

export const languages = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
  { code: 'es', label: 'Spanish' },
  { code: 'it', label: 'Italian' },
  { code: 'nl', label: 'Dutch' },
  { code: 'ar', label: 'Arabic' },
  { code: 'ur', label: 'Urdu' },
]

export const business = {
  id: null,
  name: '',
  type: '',
  description: '',
  website: '',
  email: '',
  phone: '',
  address: '',
  country: '',
  timezone: '',
  logo: null,
  currency: 'USD',
  createdAt: null,
}

export const businessHours = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => ({
  day,
  open: false,
  from: '09:00',
  to: '17:00',
  allDay: false,
}))

export const services = []
export const products = []
export const policies = []
export const bookingRules = []

export const amenities = [
  'Free Wi-Fi',
  'Parking',
  'Wheelchair access',
  '24h reception',
  'Online booking',
  'Delivery',
]

export const currentUser = {
  id: null,
  name: '',
  email: '',
  phone: '',
  role: 'Owner',
  avatar: null,
  twoFactor: false,
}

export const teamMembers = []

export const teamRoles = [
  { value: 'Owner', description: 'Full access, including billing and account deletion.' },
  { value: 'Admin', description: 'Everything except billing and ownership transfer.' },
  { value: 'Manager', description: 'Conversations, CRM, bookings and AI configuration.' },
  { value: 'Agent / Staff', description: 'Conversations and contacts only.' },
]

export const sessions = []
export const loginHistory = []
