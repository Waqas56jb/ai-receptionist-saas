/** Contacts, leads and bookings (demo data). */

export const contacts = [
  { id: 'ct_1', name: 'Daniel Reyes', email: 'daniel.reyes@example.com', phone: '+33 6 12 44 87 90', company: null, channel: 'voice', leadStatus: 'Qualified', tags: ['Returning guest', 'Deluxe King'], lastInteraction: '2026-08-15T07:41:00Z', createdAt: '2026-05-02T10:22:00Z', notes: [{ id: 'n1', author: 'Sofia Lindqvist', at: '2026-08-15T07:45:00Z', text: 'Prefers a harbour-facing room, travels midweek.' }] },
  { id: 'ct_2', name: 'Aisha Karim', email: 'aisha.karim@example.com', phone: '+971 50 220 11 88', company: 'Karim Consulting', channel: 'whatsapp', leadStatus: 'New', tags: ['Pricing'], lastInteraction: '2026-08-15T07:12:00Z', createdAt: '2026-08-10T13:18:00Z', notes: [] },
  { id: 'ct_3', name: 'Marco Bianchi', email: 'marco.bianchi@example.com', phone: '+39 340 118 22 09', company: null, channel: 'instagram', leadStatus: 'Contacted', tags: ['Late check-out'], lastInteraction: '2026-08-14T18:24:00Z', createdAt: '2026-08-14T18:20:00Z', notes: [] },
  { id: 'ct_4', name: 'Sofia Lindqvist', email: 'sofia.l@example.com', phone: '+46 70 555 21 08', company: 'Northlight AB', channel: 'voice', leadStatus: 'Qualified', tags: ['Group booking', 'Corporate'], lastInteraction: '2026-08-14T15:09:00Z', createdAt: '2026-08-14T15:02:00Z', notes: [{ id: 'n1', author: 'Marc Dubois', at: '2026-08-14T15:30:00Z', text: 'Group proposal sent — 12 rooms, 18–20 September.' }] },
  { id: 'ct_5', name: 'Léa Moreau', email: 'lea.moreau@example.com', phone: '+33 6 78 21 44 03', company: null, channel: 'whatsapp', leadStatus: 'Interested', tags: ['Wedding', 'Event'], lastInteraction: '2026-08-14T11:52:00Z', createdAt: '2026-08-14T11:40:00Z', notes: [] },
  { id: 'ct_6', name: 'Thomas Weber', email: 'thomas.weber@example.com', phone: '+49 151 2233 4455', company: null, channel: 'web', leadStatus: 'Lost', tags: [], lastInteraction: '2026-08-13T20:08:00Z', createdAt: '2026-08-07T17:45:00Z', notes: [] },
  { id: 'ct_7', name: 'Priya Nair', email: 'priya.nair@example.com', phone: '+44 7700 900 118', company: null, channel: 'whatsapp', leadStatus: 'Converted', tags: ['Suite', 'Spa'], lastInteraction: '2026-08-13T09:26:00Z', createdAt: '2026-08-13T09:14:00Z', notes: [] },
  { id: 'ct_8', name: 'Ahmed Belkacem', email: 'a.belkacem@example.com', phone: '+33 7 88 21 55 40', company: null, channel: 'voice', leadStatus: 'New', tags: ['Airport transfer'], lastInteraction: '2026-08-12T22:44:00Z', createdAt: '2026-08-12T22:41:00Z', notes: [] },
  { id: 'ct_9', name: 'Elena Rossi', email: 'elena.rossi@example.com', phone: '+39 340 118 22 09', company: null, channel: 'voice', leadStatus: 'Converted', tags: ['Twin Classic'], lastInteraction: '2026-08-11T16:34:00Z', createdAt: '2026-08-11T16:30:00Z', notes: [] },
  { id: 'ct_10', name: 'James Whitfield', email: 'j.whitfield@example.com', phone: '+44 7700 900 431', company: 'Whitfield & Co', channel: 'voice', leadStatus: 'New', tags: ['Restaurant'], lastInteraction: '2026-08-11T10:06:00Z', createdAt: '2026-08-11T10:04:00Z', notes: [] },
  { id: 'ct_11', name: 'Nora Haddad', email: 'nora.haddad@example.com', phone: '+33 6 55 71 30 12', company: null, channel: 'voice', leadStatus: 'Contacted', tags: ['Spa'], lastInteraction: '2026-08-09T09:42:00Z', createdAt: '2026-08-09T09:40:00Z', notes: [] },
  { id: 'ct_12', name: 'Peter Janssen', email: 'p.janssen@example.com', phone: '+31 6 2244 8890', company: null, channel: 'voice', leadStatus: 'Converted', tags: ['Deluxe King'], lastInteraction: '2026-08-08T11:25:00Z', createdAt: '2026-08-08T11:22:00Z', notes: [] },
  { id: 'ct_13', name: 'Chloé Petit', email: 'chloe.petit@example.com', phone: '+33 6 12 88 74 20', company: 'Atelier Petit', channel: 'web', leadStatus: 'Interested', tags: ['Conference'], lastInteraction: '2026-08-12T14:32:00Z', createdAt: '2026-08-12T14:30:00Z', notes: [] },
  { id: 'ct_14', name: 'Oliver Grant', email: 'oliver.grant@example.com', phone: '+44 7700 900 776', company: null, channel: 'instagram', leadStatus: 'New', tags: ['Pets'], lastInteraction: '2026-08-11T19:03:00Z', createdAt: '2026-08-11T19:02:00Z', notes: [] },
  { id: 'ct_15', name: 'Fatima Zahra', email: 'fatima.z@example.com', phone: '+212 6 61 22 44 90', company: null, channel: 'whatsapp', leadStatus: 'Contacted', tags: [], lastInteraction: '2026-08-10T08:45:00Z', createdAt: '2026-08-10T08:44:00Z', notes: [] },
]

export const leadStatuses = ['New', 'Contacted', 'Qualified', 'Interested', 'Converted', 'Lost']

export const leads = [
  { id: 'ld_1', contactId: 'ct_4', name: 'Sofia Lindqvist', source: 'Inbound call', channel: 'voice', score: 92, status: 'Qualified', value: 4800, createdAt: '2026-08-14T15:02:00Z', lastActivity: '2026-08-14T15:30:00Z', note: 'Group of 12, September' },
  { id: 'ld_2', contactId: 'ct_5', name: 'Léa Moreau', source: 'WhatsApp', channel: 'whatsapp', score: 78, status: 'Interested', value: 9200, createdAt: '2026-08-14T11:40:00Z', lastActivity: '2026-08-14T11:52:00Z', note: 'Rooftop wedding, 60 guests' },
  { id: 'ld_3', contactId: 'ct_1', name: 'Daniel Reyes', source: 'Inbound call', channel: 'voice', score: 88, status: 'Qualified', value: 180, createdAt: '2026-08-15T07:38:00Z', lastActivity: '2026-08-15T07:41:00Z', note: 'Same-day booking' },
  { id: 'ld_4', contactId: 'ct_7', name: 'Priya Nair', source: 'WhatsApp', channel: 'whatsapp', score: 95, status: 'Converted', value: 795, createdAt: '2026-08-13T09:14:00Z', lastActivity: '2026-08-13T09:26:00Z', note: 'Junior Suite, 3 nights' },
  { id: 'ld_5', contactId: 'ct_13', name: 'Chloé Petit', source: 'Website', channel: 'web', score: 64, status: 'Interested', value: 960, createdAt: '2026-08-12T14:30:00Z', lastActivity: '2026-08-12T14:32:00Z', note: 'Conference room, 3 days' },
  { id: 'ld_6', contactId: 'ct_2', name: 'Aisha Karim', source: 'WhatsApp', channel: 'whatsapp', score: 41, status: 'New', value: 540, createdAt: '2026-08-15T06:55:00Z', lastActivity: '2026-08-15T07:12:00Z', note: 'Asking about breakfast and spa' },
  { id: 'ld_7', contactId: 'ct_11', name: 'Nora Haddad', source: 'Inbound call', channel: 'voice', score: 55, status: 'Contacted', value: 90, createdAt: '2026-08-09T09:40:00Z', lastActivity: '2026-08-09T09:42:00Z', note: 'Spa day pass for two' },
  { id: 'ld_8', contactId: 'ct_9', name: 'Elena Rossi', source: 'Inbound call', channel: 'voice', score: 90, status: 'Converted', value: 290, createdAt: '2026-08-11T16:30:00Z', lastActivity: '2026-08-11T16:34:00Z', note: 'Twin Classic, 2 nights' },
  { id: 'ld_9', contactId: 'ct_6', name: 'Thomas Weber', source: 'Website', channel: 'web', score: 22, status: 'Lost', value: 0, createdAt: '2026-08-07T17:45:00Z', lastActivity: '2026-08-13T20:08:00Z', note: 'No availability on requested dates' },
  { id: 'ld_10', contactId: 'ct_14', name: 'Oliver Grant', source: 'Instagram', channel: 'instagram', score: 38, status: 'New', value: 300, createdAt: '2026-08-11T19:02:00Z', lastActivity: '2026-08-11T19:03:00Z', note: 'Travelling with a dog' },
]

export const bookingStatuses = ['Confirmed', 'Pending', 'Completed', 'Cancelled']

export const bookings = [
  { id: 'bk_1', contactId: 'ct_1', customer: 'Daniel Reyes', service: 'Deluxe King Room', date: '2026-08-15', time: '15:00', nights: 1, guests: 1, status: 'Confirmed', source: 'voice', value: 180, notes: 'Parking reserved.' },
  { id: 'bk_2', contactId: 'ct_7', customer: 'Priya Nair', service: 'Junior Suite', date: '2026-08-22', time: '15:00', nights: 3, guests: 2, status: 'Confirmed', source: 'whatsapp', value: 795, notes: 'Deposit link sent.' },
  { id: 'bk_3', contactId: 'ct_9', customer: 'Elena Rossi', service: 'Twin Classic Room', date: '2026-08-20', time: '15:00', nights: 2, guests: 2, status: 'Confirmed', source: 'voice', value: 290, notes: '' },
  { id: 'bk_4', contactId: 'ct_11', customer: 'Nora Haddad', service: 'Spa Day Pass', date: '2026-08-18', time: '11:00', nights: 0, guests: 2, status: 'Pending', source: 'voice', value: 90, notes: 'Awaiting confirmation of time.' },
  { id: 'bk_5', contactId: 'ct_13', customer: 'Chloé Petit', service: 'Conference Room', date: '2026-09-03', time: '09:00', nights: 0, guests: 18, status: 'Pending', source: 'web', value: 960, notes: 'Catering to be confirmed.' },
  { id: 'bk_6', contactId: 'ct_12', customer: 'Peter Janssen', service: 'Deluxe King Room', date: '2026-08-08', time: '15:00', nights: 2, guests: 2, status: 'Completed', source: 'voice', value: 360, notes: '' },
  { id: 'bk_7', contactId: 'ct_3', customer: 'Marco Bianchi', service: 'Late Check-out', date: '2026-08-14', time: '16:00', nights: 0, guests: 1, status: 'Completed', source: 'instagram', value: 30, notes: '' },
  { id: 'bk_8', contactId: 'ct_6', customer: 'Thomas Weber', service: 'Twin Classic Room', date: '2026-08-16', time: '15:00', nights: 2, guests: 2, status: 'Cancelled', source: 'web', value: 290, notes: 'Cancelled by guest, within free window.' },
  { id: 'bk_9', contactId: 'ct_4', customer: 'Sofia Lindqvist', service: 'Group — 12 rooms', date: '2026-09-18', time: '15:00', nights: 2, guests: 24, status: 'Pending', source: 'voice', value: 4800, notes: 'Proposal sent, awaiting signature.' },
]
