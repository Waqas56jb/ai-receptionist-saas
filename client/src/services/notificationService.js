import { request } from './mockClient'
import { store, platform } from './store'

export const notificationService = {
  list: () => request(() => store.notifications, { latency: [150, 320] }),

  markRead: (id) =>
    request(() => {
      store.notifications = store.notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      return store.notifications
    }, { latency: [80, 160] }),

  markAllRead: () =>
    request(() => {
      store.notifications = store.notifications.map((n) => ({ ...n, read: true }))
      return store.notifications
    }, { latency: [120, 240] }),

  getPreferences: () => request(() => store.notificationPreferences),

  updatePreferences: (group, key, value) =>
    request(() => {
      store.notificationPreferences[group][key] = value
      return store.notificationPreferences
    }),

  getLabels: () => request(platform.notificationLabels),
}

export default notificationService
