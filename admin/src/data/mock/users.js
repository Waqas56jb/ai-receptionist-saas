export const userRoles = ['Owner', 'Admin', 'Manager', 'Agent / Staff']
export const userStatuses = ['Active', 'Suspended', 'Blocked', 'Invited']

export const users = [
  { id: 'usr_1', name: 'Camille Laurent', email: 'camille@harbourview.example.com', phone: '+33 6 44 90 11 27', businessId: 'biz_8f21', business: 'Harbour View Hotel', role: 'Owner', status: 'Active', plan: 'Professional', lastLogin: '2026-08-15T07:40:00Z', createdAt: '2026-02-04T09:12:00Z', twoFactor: true },
  { id: 'usr_2', name: 'Dr Nadia Haddad', email: 'nadia@cedarclinic.example.com', phone: '+33 6 55 71 30 12', businessId: 'biz_3a77', business: 'Cedar Family Clinic', role: 'Owner', status: 'Active', plan: 'Professional', lastLogin: '2026-08-15T06:58:00Z', createdAt: '2026-03-11T10:40:00Z', twoFactor: true },
  { id: 'usr_3', name: 'Marc Dubois', email: 'marc@bistrolumiere.example.com', phone: '+33 6 78 21 44 03', businessId: 'biz_5c12', business: 'Bistro Lumière', role: 'Owner', status: 'Active', plan: 'Starter', lastLogin: '2026-08-14T21:10:00Z', createdAt: '2026-04-02T14:05:00Z', twoFactor: false },
  { id: 'usr_4', name: 'Sofia Lindqvist', email: 'sofia@northlight.example.com', phone: '+46 70 555 21 08', businessId: 'biz_9d04', business: 'Northlight Properties', role: 'Owner', status: 'Active', plan: 'Enterprise', lastLogin: '2026-08-15T07:02:00Z', createdAt: '2026-01-19T08:22:00Z', twoFactor: true },
  { id: 'usr_5', name: 'Léa Moreau', email: 'lea@bellepeau.example.com', phone: '+33 6 12 44 87 90', businessId: 'biz_7b55', business: 'Studio Belle Peau', role: 'Owner', status: 'Active', plan: 'Starter', lastLogin: '2026-08-15T05:44:00Z', createdAt: '2026-08-02T11:30:00Z', twoFactor: false },
  { id: 'usr_6', name: 'James Whitfield', email: 'james@meridianlegal.example.com', phone: '+44 7700 900 431', businessId: 'biz_2e88', business: 'Meridian Legal', role: 'Owner', status: 'Active', plan: 'Professional', lastLogin: '2026-08-14T18:20:00Z', createdAt: '2026-02-27T13:15:00Z', twoFactor: true },
  { id: 'usr_7', name: 'Peter Janssen', email: 'peter@autoprime.example.com', phone: '+31 6 2244 8890', businessId: 'biz_4f31', business: 'AutoPrime Garage', role: 'Owner', status: 'Suspended', plan: 'Starter', lastLogin: '2026-07-28T16:12:00Z', createdAt: '2026-03-30T09:55:00Z', twoFactor: false },
  { id: 'usr_8', name: 'Elena Rossi', email: 'elena@lakeviewdental.example.com', phone: '+39 340 118 22 09', businessId: 'biz_6a19', business: 'Lakeview Dental', role: 'Owner', status: 'Active', plan: 'Professional', lastLogin: '2026-08-15T04:31:00Z', createdAt: '2026-05-14T10:10:00Z', twoFactor: true },
  { id: 'usr_9', name: 'Chloé Petit', email: 'chloe@atelierpetit.example.com', phone: '+33 6 12 88 74 20', businessId: 'biz_1c63', business: 'Atelier Petit', role: 'Owner', status: 'Active', plan: 'Starter', lastLogin: '2026-08-12T14:32:00Z', createdAt: '2026-08-09T15:26:00Z', twoFactor: false },
  { id: 'usr_10', name: 'Thomas Weber', email: 'thomas@alpinechalet.example.com', phone: '+49 151 2233 4455', businessId: 'biz_8h22', business: 'Alpine Chalet Rentals', role: 'Owner', status: 'Active', plan: 'Professional', lastLogin: '2026-08-15T03:18:00Z', createdAt: '2026-01-08T12:00:00Z', twoFactor: true },
  { id: 'usr_11', name: 'Aisha Karim', email: 'aisha@karimconsulting.example.com', phone: '+971 50 220 11 88', businessId: 'biz_5k47', business: 'Karim Consulting', role: 'Owner', status: 'Active', plan: 'Enterprise', lastLogin: '2026-08-15T07:12:00Z', createdAt: '2026-02-15T07:45:00Z', twoFactor: true },
  { id: 'usr_12', name: 'Marco Bianchi', email: 'marco@verdegarden.example.com', phone: '+39 340 118 22 09', businessId: 'biz_3p90', business: 'Verde Garden Centre', role: 'Owner', status: 'Active', plan: 'Starter', lastLogin: '2026-08-14T18:24:00Z', createdAt: '2026-06-21T09:30:00Z', twoFactor: false },
  { id: 'usr_13', name: 'Oliver Grant', email: 'oliver@coastlinesurf.example.com', phone: '+44 7700 900 776', businessId: 'biz_7t04', business: 'Coastline Surf School', role: 'Owner', status: 'Invited', plan: 'Starter', lastLogin: null, createdAt: '2026-08-13T16:40:00Z', twoFactor: false },
  { id: 'usr_14', name: 'Fatima Zahra', email: 'fatima@maisonfleurie.example.com', phone: '+212 6 61 22 44 90', businessId: 'biz_9w66', business: 'Maison Fleurie', role: 'Owner', status: 'Active', plan: 'Professional', lastLogin: '2026-08-15T06:10:00Z', createdAt: '2026-04-25T11:20:00Z', twoFactor: false },
  { id: 'usr_15', name: 'Yanis Bouchard', email: 'yanis@riversidevets.example.com', phone: '+33 2 40 11 55 33', businessId: 'biz_2r38', business: 'Riverside Vets', role: 'Owner', status: 'Blocked', plan: 'Professional', lastLogin: '2026-08-05T10:05:00Z', createdAt: '2026-03-05T08:15:00Z', twoFactor: false, blockedReason: 'Under investigation for transcript misuse' },
  { id: 'usr_16', name: 'Hugo Lefèvre', email: 'hugo@harbourview.example.com', phone: '+33 6 90 11 02 74', businessId: 'biz_8f21', business: 'Harbour View Hotel', role: 'Manager', status: 'Active', plan: 'Professional', lastLogin: '2026-08-15T06:12:00Z', createdAt: '2026-02-20T10:00:00Z', twoFactor: false },
  { id: 'usr_17', name: 'Ines Ferreira', email: 'ines@harbourview.example.com', phone: '+351 21 244 55 66', businessId: 'biz_8f21', business: 'Harbour View Hotel', role: 'Agent / Staff', status: 'Active', plan: 'Professional', lastLogin: '2026-08-14T20:41:00Z', createdAt: '2026-05-02T09:20:00Z', twoFactor: false },
  { id: 'usr_18', name: 'Lucas Silva', email: 'lucas@harbourview.example.com', phone: '+33 7 88 21 55 40', businessId: 'biz_8f21', business: 'Harbour View Hotel', role: 'Admin', status: 'Invited', plan: 'Professional', lastLogin: null, createdAt: '2026-08-10T13:00:00Z', twoFactor: false },
  { id: 'usr_19', name: 'Anna Novak', email: 'anna@northlight.example.com', phone: '+46 70 221 88 04', businessId: 'biz_9d04', business: 'Northlight Properties', role: 'Manager', status: 'Active', plan: 'Enterprise', lastLogin: '2026-08-15T06:44:00Z', createdAt: '2026-02-01T09:00:00Z', twoFactor: true },
  { id: 'usr_20', name: 'Kofi Mensah', email: 'kofi@karimconsulting.example.com', phone: '+971 50 887 22 10', businessId: 'biz_5k47', business: 'Karim Consulting', role: 'Agent / Staff', status: 'Suspended', plan: 'Enterprise', lastLogin: '2026-07-20T11:12:00Z', createdAt: '2026-03-18T15:30:00Z', twoFactor: false, suspendedReason: 'Left the company' },
]

export const userLoginHistory = {
  usr_1: [
    { id: 'ul_1', at: '2026-08-15T07:40:00Z', device: 'Chrome · macOS', location: 'Marseille, France', result: 'Success' },
    { id: 'ul_2', at: '2026-08-14T08:31:00Z', device: 'Safari · iPhone', location: 'Marseille, France', result: 'Success' },
    { id: 'ul_3', at: '2026-08-12T22:14:00Z', device: 'Unknown browser', location: 'Amsterdam, Netherlands', result: 'Blocked' },
  ],
}

export const userNotes = {
  usr_15: [{ id: 'un_1', author: 'Amara Okafor', at: '2026-08-06T11:30:00Z', text: 'Access blocked while the transcript complaint is reviewed.' }],
}
