import { request, makeId } from './mockClient'
import { store, biz } from './store'

const collections = {
  services: 'services',
  products: 'products',
  policies: 'policies',
  bookingRules: 'bookingRules',
}

export const businessService = {
  getBusiness: () => request(() => store.business),

  updateBusiness: (patch) =>
    request(() => {
      Object.assign(store.business, patch)
      return store.business
    }),

  getHours: () => request(() => store.businessHours),

  updateHours: (hours) =>
    request(() => {
      store.businessHours = hours
      return store.businessHours
    }),

  getProfile: () => request(() => store.user),

  updateProfile: (patch) =>
    request(() => {
      Object.assign(store.user, patch)
      return store.user
    }),

  getTeam: () => request(() => store.team),

  inviteMember: (member) =>
    request(() => {
      store.team = [...store.team, { id: makeId('usr'), status: 'Invited', lastActive: null, ...member }]
      return store.team
    }),

  updateMember: (id, patch) =>
    request(() => {
      store.team = store.team.map((m) => (m.id === id ? { ...m, ...patch } : m))
      return store.team
    }),

  removeMember: (id) =>
    request(() => {
      store.team = store.team.filter((m) => m.id !== id)
      return store.team
    }),

  /** Generic CRUD used by Services / Products / Policies / Booking rules. */
  list: (collection) => request(() => store[collections[collection]]),

  create: (collection, item) =>
    request(() => {
      const key = collections[collection]
      store[key] = [...store[key], { id: makeId(collection.slice(0, 3)), active: true, ...item }]
      return store[key]
    }),

  update: (collection, id, patch) =>
    request(() => {
      const key = collections[collection]
      store[key] = store[key].map((row) => (row.id === id ? { ...row, ...patch } : row))
      return store[key]
    }),

  remove: (collection, id) =>
    request(() => {
      const key = collections[collection]
      store[key] = store[key].filter((row) => row.id !== id)
      return store[key]
    }),

  getReferenceData: () =>
    request({
      businessTypes: biz.businessTypes,
      countries: biz.countries,
      timezones: biz.timezones,
      languages: biz.languages,
      teamRoles: biz.teamRoles,
      amenities: biz.amenities,
    }),
}

export default businessService
