import { request, clone, makeId } from './mockClient'
import { store, ai } from './store'

function replyFor(text) {
  const lower = text.toLowerCase()
  const hit = ai.testResponses.find((r) => r.match.some((word) => lower.includes(word)))
  return hit ? hit.reply : ai.testFallback
}

export const aiService = {
  getConfig: () => request(() => store.aiConfig),

  updateConfig: (patch) =>
    request(() => {
      Object.assign(store.aiConfig, patch)
      return store.aiConfig
    }),

  getPrompts: () => request(() => ({ prompts: store.prompts, versions: store.promptVersions })),

  savePrompts: (prompts, note = 'Manual update') =>
    request(() => {
      store.prompts = { ...store.prompts, ...prompts }
      const next = store.promptVersions.length + 1
      store.promptVersions = [
        { id: `v${next + 8}`, label: `Version ${next + 8}`, current: true, author: store.user.name, createdAt: new Date().toISOString(), note },
        ...store.promptVersions.map((v) => ({ ...v, current: false })),
      ]
      return { prompts: store.prompts, versions: store.promptVersions }
    }),

  restoreVersion: (id) =>
    request(() => {
      store.promptVersions = store.promptVersions.map((v) => ({ ...v, current: v.id === id }))
      return { prompts: store.prompts, versions: store.promptVersions }
    }),

  getChannelSettings: (channel) =>
    request(() => {
      if (channel === 'voice') return store.voiceSettings
      if (channel === 'whatsapp') return store.whatsappSettings
      return store.instagramSettings
    }),

  updateChannelSettings: (channel, patch) =>
    request(() => {
      const key = channel === 'voice' ? 'voiceSettings' : channel === 'whatsapp' ? 'whatsappSettings' : 'instagramSettings'
      store[key] = { ...store[key], ...patch }
      return store[key]
    }),

  getOptions: () =>
    request({
      personalities: ai.personalities,
      tones: ai.tones,
      responseLengths: ai.responseLengths,
      voices: ai.voices,
      voiceStyles: ai.voiceStyles,
      channelKnowledge: ai.channelKnowledge,
    }),

  /** Playground reply — canned answers over the demo knowledge base. */
  sendTestMessage: ({ text }) =>
    request(
      () => ({ id: makeId('msg'), from: 'ai', at: new Date().toISOString(), text: replyFor(text) }),
      { latency: [500, 1100] },
    ),

  retrain: () =>
    request(() => {
      store.aiConfig.lastTrainedAt = new Date().toISOString()
      return clone(store.aiConfig)
    }, { latency: [900, 1600] }),

  testCall: () => request({ ok: true, message: 'Test call queued — your phone will ring shortly.' }, { latency: [700, 1200] }),

  testMessage: (channel) =>
    request({ ok: true, message: `Test ${channel} message sent to your connected account.` }, { latency: [700, 1200] }),
}

export default aiService
