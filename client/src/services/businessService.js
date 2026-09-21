import { request, makeId } from './mockClient'
import { store, biz } from './store'
import { api } from './api'

const collections = {
  services: 'services',
  products: 'products',
  policies: 'policies',
  bookingRules: 'bookingRules',
}

export const businessService = {
  getBusiness: async () => {
    const me = await api('/me')
    store.business = { ...store.business, ...me.business }
    if (Array.isArray(me.hours) && me.hours.length) store.businessHours = me.hours
    if (me.user) store.user = { ...store.user, ...me.user }
    return store.business
  },

  updateBusiness: async (patch) => {
    const next = await api('/me', { method: 'PATCH', body: patch })
    store.business = { ...store.business, ...next }
    return store.business
  },

  getHours: async () => {
    const hours = await api('/me/hours')
    store.businessHours = Array.isArray(hours) && hours.length ? hours : store.businessHours
    return store.businessHours
  },

  updateHours: async (hours) => {
    store.businessHours = await api('/me/hours', { method: 'PUT', body: hours })
    return store.businessHours
  },

  getProfile: async () => {
    const me = await api('/me')
    store.user = { ...store.user, ...me.user }
    return store.user
  },

  updateProfile: async (patch) => {
    const next = await api('/me/profile', { method: 'PATCH', body: patch })
    store.user = { ...store.user, ...next }
    return store.user
  },

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
