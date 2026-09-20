/**
 * Demo business record. Everything the portal renders comes from this layer so
 * that swapping in real API responses later touches services only.
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
  'Djibouti',
  'Pakistan',
]

export const timezones = [
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
  id: 'biz_8f21',
  name: 'Harbour View Hotel',
  type: 'Hotel',
  description:
    'A 42-room boutique hotel on the old port, with a rooftop restaurant, spa and conference facilities. Guests are mostly business travellers midweek and couples at the weekend.',
  website: 'https://harbourview.example.com',
  email: 'reception@harbourview.example.com',
  phone: '+33 4 91 22 18 40',
  address: '14 Quai du Port, 13002 Marseille',
  country: 'France',
  timezone: 'Europe/Paris',
  logo: null,
  currency: 'EUR',
  createdAt: '2026-02-04T09:12:00Z',
}

export const businessHours = [
  { day: 'Monday', open: true, from: '07:00', to: '23:00', allDay: false },
  { day: 'Tuesday', open: true, from: '07:00', to: '23:00', allDay: false },
  { day: 'Wednesday', open: true, from: '07:00', to: '23:00', allDay: false },
  { day: 'Thursday', open: true, from: '07:00', to: '23:00', allDay: false },
  { day: 'Friday', open: true, from: '07:00', to: '00:00', allDay: false },
  { day: 'Saturday', open: true, from: '08:00', to: '00:00', allDay: false },
  { day: 'Sunday', open: true, from: '08:00', to: '22:00', allDay: false },
]

export const services = [
  { id: 'svc_1', name: 'Deluxe King Room', price: 180, unit: 'per night', description: 'King bed, harbour view, breakfast included.', active: true },
  { id: 'svc_2', name: 'Twin Classic Room', price: 145, unit: 'per night', description: 'Two single beds, city view, breakfast included.', active: true },
  { id: 'svc_3', name: 'Junior Suite', price: 265, unit: 'per night', description: 'Separate lounge area, balcony, breakfast included.', active: true },
  { id: 'svc_4', name: 'Airport Transfer', price: 55, unit: 'per trip', description: 'Private car to or from Marseille Provence Airport.', active: true },
  { id: 'svc_5', name: 'Conference Room', price: 320, unit: 'per day', description: 'Seats 24, projector, catering optional.', active: false },
]

export const products = [
  { id: 'prd_1', name: 'Spa Day Pass', price: 45, unit: 'per person', description: 'Pool, sauna and hammam access, 10:00–20:00.', active: true },
  { id: 'prd_2', name: 'Rooftop Dinner Menu', price: 62, unit: 'per person', description: 'Four-course seasonal menu, wine pairing optional.', active: true },
  { id: 'prd_3', name: 'Late Check-out', price: 30, unit: 'flat', description: 'Check-out extended to 16:00, subject to availability.', active: true },
]

export const policies = [
  { id: 'pol_1', title: 'Cancellation', body: 'Free cancellation up to 48 hours before arrival. Later cancellations are charged the first night.', updatedAt: '2026-07-28T10:00:00Z' },
  { id: 'pol_2', title: 'Check-in / Check-out', body: 'Check-in from 15:00, check-out by 11:00. Luggage storage is available at reception.', updatedAt: '2026-07-28T10:00:00Z' },
  { id: 'pol_3', title: 'Pets', body: 'Small pets are welcome at €20 per night. Assistance animals stay free of charge.', updatedAt: '2026-06-11T10:00:00Z' },
  { id: 'pol_4', title: 'Payment', body: 'We accept card and cash. A card is required at check-in to cover incidentals.', updatedAt: '2026-05-02T10:00:00Z' },
]

export const bookingRules = [
  { id: 'br_1', title: 'Minimum stay', body: 'Two nights minimum on Friday and Saturday between June and September.', active: true },
  { id: 'br_2', title: 'Group bookings', body: 'Requests for six rooms or more must be passed to a human agent.', active: true },
  { id: 'br_3', title: 'Deposit', body: 'Bookings over €500 require a 30% deposit at the time of booking.', active: true },
]

export const amenities = [
  'Free Wi-Fi',
  'Rooftop restaurant',
  'Spa & hammam',
  'Airport transfer',
  'Pet friendly',
  'Private parking',
  '24h reception',
  'Conference room',
]

export const currentUser = {
  id: 'usr_1',
  name: 'Camille Laurent',
  email: 'camille@harbourview.example.com',
  phone: '+33 6 44 90 11 27',
  role: 'Owner',
  avatar: null,
  twoFactor: false,
}

export const teamMembers = [
  { id: 'usr_1', name: 'Camille Laurent', email: 'camille@harbourview.example.com', role: 'Owner', status: 'Active', lastActive: '2026-08-15T07:40:00Z' },
  { id: 'usr_2', name: 'Marc Dubois', email: 'marc@harbourview.example.com', role: 'Admin', status: 'Active', lastActive: '2026-08-14T18:05:00Z' },
  { id: 'usr_3', name: 'Sofia Lindqvist', email: 'sofia@harbourview.example.com', role: 'Manager', status: 'Active', lastActive: '2026-08-15T06:12:00Z' },
  { id: 'usr_4', name: 'Yanis Bouchard', email: 'yanis@harbourview.example.com', role: 'Agent / Staff', status: 'Invited', lastActive: null },
]

export const teamRoles = [
  { value: 'Owner', description: 'Full access, including billing and account deletion.' },
  { value: 'Admin', description: 'Everything except billing and ownership transfer.' },
  { value: 'Manager', description: 'Conversations, CRM, bookings and AI configuration.' },
  { value: 'Agent / Staff', description: 'Conversations and contacts only.' },
]

export const sessions = [
  { id: 'ses_1', device: 'Chrome · macOS', location: 'Marseille, France', ip: '92.184.•••.•••', lastActive: '2026-08-15T07:44:00Z', current: true },
  { id: 'ses_2', device: 'Safari · iPhone', location: 'Marseille, France', ip: '92.184.•••.•••', lastActive: '2026-08-14T21:10:00Z', current: false },
  { id: 'ses_3', device: 'Firefox · Windows', location: 'Lyon, France', ip: '78.201.•••.•••', lastActive: '2026-08-11T14:36:00Z', current: false },
]

export const loginHistory = [
  { id: 'lh_1', at: '2026-08-15T07:02:00Z', device: 'Chrome · macOS', location: 'Marseille, France', result: 'Success' },
  { id: 'lh_2', at: '2026-08-14T08:31:00Z', device: 'Safari · iPhone', location: 'Marseille, France', result: 'Success' },
  { id: 'lh_3', at: '2026-08-12T22:14:00Z', device: 'Unknown browser', location: 'Amsterdam, Netherlands', result: 'Blocked' },
  { id: 'lh_4', at: '2026-08-11T14:36:00Z', device: 'Firefox · Windows', location: 'Lyon, France', result: 'Success' },
]
