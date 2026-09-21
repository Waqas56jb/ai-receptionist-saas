import { request } from './mockClient'
import { store, ai } from './store'
import { api } from './api'

/**
 * Credentials are write-only from the browser's point of view: the UI can send
 * a new value and read a masked preview back, but never the stored secret.
 */
export const channelService = {
  list: async () => {
    try {
      const [wa, widget] = await Promise.all([
        api('/whatsapp/status').catch(() => ({})),
        api('/widget').catch(() => ({})),
      ])
      store.channels = store.channels.map((c) => {
        if (c.id === 'whatsapp') {
          return { ...c, connected: Boolean(wa.connected), identifier: wa.phone || null, provider: 'WhatsApp' }
        }
        if (c.id === 'web') {
          return { ...c, connected: Boolean(widget?.token), identifier: widget?.token ? 'Website widget' : null, provider: 'Web widget' }
        }
        return c
      })
    } catch {
      /* keep last known channels */
    }
    return store.channels
  },

  get: (id) => request(() => store.channels.find((c) => c.id === id) || null),

  update: (id, patch) =>
    request(() => {
      store.channels = store.channels.map((c) => (c.id === id ? { ...c, ...patch } : c))
      return store.channels
    }),

  connect: (id, identifier) =>
    request(
      () => {
        store.channels = store.channels.map((c) =>
          c.id === id
            ? { ...c, connected: true, enabled: true, configured: true, identifier: identifier || c.identifier, lastConnectedAt: new Date().toISOString() }
            : c,
        )
        return store.channels
      },
      { latency: [800, 1400] },
    ),

  disconnect: (id) =>
    request(() => {
      store.channels = store.channels.map((c) =>
        c.id === id ? { ...c, connected: false, enabled: false, configured: false, identifier: null } : c,
      )
      return store.channels
    }),

  getCredentials: (provider) => request(() => store.credentials[provider] || []),

  /** The raw value is intentionally dropped — only a masked preview is kept. */
  saveCredential: (provider, key, rawValue) =>
    request(
      () => {
        const last4 = String(rawValue || '').slice(-4).padStart(4, '•')
        store.credentials[provider] = (store.credentials[provider] || []).map((c) =>
          c.key === key
            ? { ...c, saved: true, preview: `${key.includes('Secret') || key.includes('Token') ? 'sk_' : ''}••••••••••${last4}`, updatedAt: new Date().toISOString() }
            : c,
        )
        return store.credentials[provider]
      },
      { latency: [500, 900] },
    ),

  removeCredential: (provider, key) =>
    request(() => {
      store.credentials[provider] = (store.credentials[provider] || []).map((c) =>
        c.key === key ? { ...c, saved: false, preview: null, updatedAt: null } : c,
      )
      return store.credentials[provider]
    }),

  getWebhookUrls: () => request(ai.webhookUrls),
}

export default channelService
