import { request, makeId } from './mockClient'
import { store, biz } from './store'
import { api } from './api'
import authService from './authService'

const collections = {
  services: 'services',
  products: 'products',
  policies: 'policies',
  bookingRules: 'bookingRules',
}

export const businessService = {
  getBusiness: async () => {
    try {
      const me = await api('/me')
      store.business = { ...store.business, ...me.business }
      if (Array.isArray(me.hours) && me.hours.length) store.businessHours = me.hours
      if (me.user) store.user = { ...store.user, ...me.user }
      return store.business
    } catch (error) {
      const session = authService.getSession()
      if (session?.business) {
        store.business = { ...store.business, ...session.business }
        return store.business
      }
      throw error
    }
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
    try {
      const me = await api('/me')
      store.user = { ...store.user, ...me.user }
      return store.user
    } catch (error) {
      const session = authService.getSession()
      if (session?.user) {
        store.user = { ...store.user, ...session.user }
        return store.user
      }
      throw error
    }
  },

  updateProfile: async (patch) => {
    const next = await api('/me/profile', { method: 'PATCH', body: patch })
    store.user = { ...store.user, ...next }
    return store.user
  },

  getTeam: async () => {
    try {
      store.team = await api('/team')
    } catch {
      store.team = store.team || []
    }
    return store.team
  },

  inviteMember: async (member) => {
    store.team = await api('/team', { method: 'POST', body: member })
    return store.team
  },

  updateMember: async (id, patch) => {
    store.team = await api(`/team/${id}`, { method: 'PATCH', body: patch })
    return store.team
  },

  removeMember: async (id) => {
    store.team = await api(`/team/${id}`, { method: 'DELETE' })
    return store.team
  },

  list: async (collection) => {
    const key = collections[collection]
    store[key] = await api(`/catalog/${key}`)
    return store[key]
  },

  create: async (collection, item) => {
    const key = collections[collection]
    const current = await businessService.list(collection)
    store[key] = await api(`/catalog/${key}`, {
      method: 'PUT',
      body: [...current, { id: makeId(collection.slice(0, 3)), active: true, ...item }],
    })
    return store[key]
  },

  update: async (collection, id, patch) => {
    const key = collections[collection]
    const current = await businessService.list(collection)
    store[key] = await api(`/catalog/${key}`, {
      method: 'PUT',
      body: current.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    })
    return store[key]
  },

  remove: async (collection, id) => {
    const key = collections[collection]
    const current = await businessService.list(collection)
    store[key] = await api(`/catalog/${key}`, {
      method: 'PUT',
      body: current.filter((row) => row.id !== id),
    })
    return store[key]
  },

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
