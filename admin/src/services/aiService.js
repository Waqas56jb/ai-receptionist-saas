import { request } from './mockClient'
import { store, writeAudit } from './store'
import { live } from './api'

function asAgent(row) {
  if (!row) return null
  return {
    id: row.id,
    businessId: row.id,
    business: row.business_name || row.business || row.name,
    name: `${row.business_name || row.name || 'Business'} receptionist`,
    status: row.status === 'Active' ? 'Online' : 'Paused',
    knowledgeMode: 'Shared',
    promptMode: 'Shared',
    channels: ['whatsapp', 'web'],
    languages: ['English'],
    personality: 'Professional',
    handoff: true,
    knowledgeItems: 0,
    aiMinutes: 0,
    conversations: 0,
    lastActive: row.lastLogin || row.last_login || row.createdAt || row.created_at,
  }
}

export const aiService = {
  listAgents: () =>
    live('/admin/accounts', {}, () => request(() => store.aiAgents)).then((rows) =>
      (Array.isArray(rows) ? rows : []).map(asAgent),
    ),
  getAgent: (id) =>
    live('/admin/accounts', {}, () => request(() => store.aiAgents.find((a) => a.id === id) || null)).then((rows) => {
      const list = Array.isArray(rows) ? rows : rows ? [rows] : []
      return asAgent(list.find((row) => row.id === id))
    }),
  getAgentByBusiness: (businessId) =>
    live('/admin/accounts', {}, () => request(() => store.aiAgents.find((a) => a.businessId === businessId) || null)).then(
      (rows) => {
        const list = Array.isArray(rows) ? rows : rows ? [rows] : []
        return asAgent(list.find((row) => row.id === businessId))
      },
    ),

  setAgentStatus: (id, status, admin) =>
    request(() => {
      const before = store.aiAgents.find((a) => a.id === id)
      store.aiAgents = store.aiAgents.map((a) => (a.id === id ? { ...a, status } : a))
      writeAudit({
        admin,
        action: status === 'Online' ? 'Enabled AI agent' : 'Disabled AI agent',
        resource: 'AI agent',
        resourceId: id,
        resourceName: before?.business,
      })
      return store.aiAgents.find((a) => a.id === id)
    }),

  /** Aggregated AI usage per business, used by the usage screens. */
  getUsage: () =>
    request(() =>
      store.aiAgents.map((a) => ({
        businessId: a.businessId,
        business: a.business,
        minutes: a.aiMinutes,
        conversations: a.conversations,
        knowledgeItems: a.knowledgeItems,
        channels: a.channels.length,
        // Demo cost model only — real figures come from the provider.
        estimatedCost: Math.round(a.aiMinutes * 0.06 * 100) / 100,
      })),
    ),
}

export const channelService = {
  listVoice: () => request(() => store.voice),
  listWhatsApp: () =>
    live('/admin/whatsapp', {}, () => request(() => store.whatsapp)).then((rows) =>
      (Array.isArray(rows) ? rows : []).map((row) => ({
        id: row.id,
        businessId: row.id,
        business: row.account || row.business,
        account: row.account,
        number: row.identifier || row.number || '—',
        credential: '',
        status: row.connected || row.status === 'connected' ? 'Connected' : 'Disconnected',
        enabled: Boolean(row.connected || row.status === 'connected'),
        messages: row.messages || 0,
        lastActivity: row.lastActivity || null,
      })),
    ),
  listInstagram: () => request(() => store.instagram),

  setEnabled: (kind, id, enabled, admin) =>
    request(() => {
      const key = kind === 'voice' ? 'voice' : kind === 'whatsapp' ? 'whatsapp' : 'instagram'
      const before = store[key].find((c) => c.id === id)
      store[key] = store[key].map((c) => (c.id === id ? { ...c, enabled, status: enabled ? 'Connected' : 'Disabled' } : c))
      writeAudit({
        admin,
        action: enabled ? 'Enabled channel' : 'Disabled channel',
        resource: 'Channel',
        resourceId: id,
        resourceName: `${before?.business} — ${kind}`,
      })
      return store[key]
    }),

  disconnect: (kind, id, admin) =>
    request(() => {
      const key = kind === 'voice' ? 'voice' : kind === 'whatsapp' ? 'whatsapp' : 'instagram'
      const before = store[key].find((c) => c.id === id)
      store[key] = store[key].map((c) => (c.id === id ? { ...c, enabled: false, status: 'Disconnected' } : c))
      writeAudit({ admin, action: 'Disconnected channel', resource: 'Channel', resourceId: id, resourceName: `${before?.business} — ${kind}` })
      return store[key]
    }),
}

export const conversationService = {
  listConversations: async () => {
    try {
      const rows = await live('/admin/conversations', {}, () => request(() => []))
      return Array.isArray(rows) ? rows : []
    } catch {
      return []
    }
  },
  listConversationsByBusiness: (businessId) => request(() => store.conversations.filter((c) => c.businessId === businessId)),
  listCalls: () => request(() => store.calls),
  listCallsByBusiness: (businessId) => request(() => store.calls.filter((c) => c.businessId === businessId)),
  listMessages: () => request(() => store.messages),
  listMessagesByBusiness: (businessId) => request(() => store.messages.filter((m) => m.businessId === businessId)),
  listTranscripts: () => request(() => store.transcripts),
  getTranscript: (id) => request(() => store.transcripts.find((t) => t.id === id) || null),
}
