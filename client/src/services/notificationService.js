import { store, platform } from './store'
import { api } from './api'

export const notificationService = {
  list: async () => {
    try {
      const data = await api('/notifications')
      store.notifications = Array.isArray(data) ? data : []
    } catch {
      store.notifications = store.notifications || []
    }
    return store.notifications
  },

  markRead: async (id) => {
    store.notifications = (store.notifications || []).map((n) => (n.id === id ? { ...n, read: true } : n))
    return store.notifications
  },

  markAllRead: async () => {
    store.notifications = (store.notifications || []).map((n) => ({ ...n, read: true }))
    return store.notifications
  },

  getPreferences: async () => {
    try {
      const prefs = await api('/notifications/preferences')
      store.notificationPreferences = prefs
      return prefs
    } catch {
      return store.notificationPreferences
    }
  },

  updatePreferences: async (group, key, value) => {
    const prefs = await api('/notifications/preferences', { method: 'PUT', body: { group, key, value } })
    store.notificationPreferences = prefs
    return prefs
  },

  getLabels: async () => platform.notificationLabels,
}

export default notificationService
