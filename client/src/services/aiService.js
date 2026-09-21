import { request } from './mockClient'
import { store, ai } from './store'
import { api } from './api'

export const aiService = {
  getConfig: async () => {
    const settings = await api('/settings')
    store.aiConfig = { ...store.aiConfig, ...settings.ai_config }
    return store.aiConfig
  },

  updateConfig: async (patch) => {
    const settings = await api('/settings', { method: 'PUT', body: { ai_config: patch } })
    store.aiConfig = { ...store.aiConfig, ...settings.ai_config }
    return store.aiConfig
  },

  getPrompts: async () => {
    const settings = await api('/settings')
    store.prompts = { ...store.prompts, ...settings.prompts }
    store.promptVersions = settings.prompt_versions || []
    return { prompts: store.prompts, versions: store.promptVersions }
  },

  savePrompts: async (prompts, note = 'Manual update') => {
    const current = await aiService.getPrompts()
    const versions = [
      { id: `v${Date.now()}`, label: `Version ${(current.versions || []).length + 1}`, current: true, author: store.user.name || 'Owner', createdAt: new Date().toISOString(), note },
      ...(current.versions || []).map((row) => ({ ...row, current: false })),
    ]
    const settings = await api('/settings', { method: 'PUT', body: { prompts, prompt_versions: versions } })
    store.prompts = settings.prompts
    store.promptVersions = settings.prompt_versions || []
    return { prompts: store.prompts, versions: store.promptVersions }
  },

  restoreVersion: async (id) => {
    const current = await aiService.getPrompts()
    const versions = (current.versions || []).map((row) => ({ ...row, current: row.id === id }))
    const settings = await api('/settings', { method: 'PUT', body: { prompt_versions: versions } })
    return { prompts: settings.prompts, versions: settings.prompt_versions || [] }
  },

  getChannelSettings: async (channel) => {
    if (channel !== 'whatsapp' && channel !== 'web') return {}
    return api(`/settings/${channel}`)
  },

  updateChannelSettings: async (channel, patch) => {
    if (channel !== 'whatsapp' && channel !== 'web') return patch
    return api(`/settings/${channel}`, { method: 'PUT', body: patch })
  },

  getOptions: () =>
    request({
      personalities: ai.personalities,
      tones: ai.tones,
      responseLengths: ai.responseLengths,
      voices: ai.voices,
      voiceStyles: ai.voiceStyles,
      channelKnowledge: ai.channelKnowledge,
    }),

  sendTestMessage: async ({ text }) => api('/ai/test', { method: 'POST', body: { text } }),

  retrain: async () => {
    const settings = await api('/settings', { method: 'PUT', body: { ai_config: { lastTrainedAt: new Date().toISOString() } } })
    store.aiConfig = { ...store.aiConfig, ...settings.ai_config }
    return store.aiConfig
  },

  testCall: () => request({ ok: true, message: 'Voice calling is not live on this account.' }),

  testMessage: (channel) => request({ ok: true, message: `Test ${channel} message will send from the live channel once connected.` }),
}

export default aiService
