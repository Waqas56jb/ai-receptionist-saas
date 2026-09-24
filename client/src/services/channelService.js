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
      const [wa, widget, voice] = await Promise.all([
        api('/whatsapp/status').catch(() => ({})),
        api('/widget').catch(() => ({})),
        api('/voice/status').catch(() => ({})),
      ])
      store.channels = store.channels.map((c) => {
        if (c.id === 'whatsapp') {
          return { ...c, connected: Boolean(wa.connected), identifier: wa.phone || null, provider: 'WhatsApp' }
        }
        if (c.id === 'web') {
          return { ...c, connected: Boolean(widget?.token), identifier: widget?.token ? 'Website widget' : null, provider: 'Web widget' }
        }
        if (c.id === 'voice') {
          return {
            ...c,
            connected: Boolean(voice.ready),
            enabled: voice.enabled !== false,
            configured: Boolean(voice.ready),
            identifier: voice.phone || null,
            provider: 'Twilio',
            lastConnectedAt: voice.ready ? new Date().toISOString() : c.lastConnectedAt,
          }
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

  getCredentials: async (provider) => {
    if (provider === 'twilio') return api('/voice/credentials')
    return store.credentials[provider] || []
  },

  saveCredential: async (provider, key, rawValue) => {
    if (provider === 'twilio') return api('/voice/credentials', { method: 'POST', body: { key, value: rawValue } })
    return store.credentials[provider] || []
  },

  removeCredential: async (provider, key) => {
    if (provider === 'twilio') return api(`/voice/credentials/${encodeURIComponent(key)}`, { method: 'DELETE' })
    return store.credentials[provider] || []
  },

  getWebhookUrls: async () => {
    const voice = await api('/voice/status').catch(() => ({}))
    return { ...(ai.webhookUrls || {}), voice: voice.webhooks?.voice || '' }
  },

  provisionTwilio: () => api('/voice/provision', { method: 'POST' }),
}

export default channelService
