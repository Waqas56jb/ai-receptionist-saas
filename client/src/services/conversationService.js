import { request, makeId } from './mockClient'
import { store } from './store'
import { api, live, isApiOfflineError } from './api'
import { isLiveChannel } from '../lib/channels'

function looksMapped(rows) {
  return Array.isArray(rows) && (!rows.length || rows[0]?.customer !== undefined)
}

function liveOnly(rows) {
  return (rows || []).filter((row) => isLiveChannel(row.channel || 'whatsapp'))
}

export const conversationService = {
  list: () =>
    api('/conversations').then((rows) => liveOnly(looksMapped(rows) ? rows : [])),

  get: (id) =>
    live(`/conversations/${id}`, {}, () => request(() => null)).then((row) =>
      row && isLiveChannel(row.channel || 'whatsapp') ? row : null,
    ),

  update: async (id, patch) => {
    try {
      return await api(`/conversations/${id}`, { method: 'PATCH', body: patch })
    } catch (error) {
      if (!isApiOfflineError(error)) throw error
      return request(() => {
        store.conversations = store.conversations.map((c) => (c.id === id ? { ...c, ...patch } : c))
        return store.conversations.find((c) => c.id === id) || null
      })
    }
  },

  addNote: async (id, text, author) => {
    try {
      return await api(`/conversations/${id}/notes`, { method: 'POST', body: { text, author } })
    } catch (error) {
      if (!isApiOfflineError(error)) throw error
      return request(() => {
        store.conversations = store.conversations.map((c) =>
          c.id === id
            ? { ...c, notes: [...(c.notes || []), { id: makeId('n'), author, at: new Date().toISOString(), text }] }
            : c,
        )
        return store.conversations.find((c) => c.id === id) || null
      })
    }
  },

  sendReply: async (id, text, author) => {
    try {
      return await api(`/conversations/${id}/reply`, { method: 'POST', body: { text, author } })
    } catch (error) {
      if (!isApiOfflineError(error)) throw error
      return request(() => {
        store.conversations = store.conversations.map((c) =>
          c.id === id
            ? {
                ...c,
                handledBy: 'human',
                lastMessageAt: new Date().toISOString(),
                preview: text,
                messages: [...c.messages, { id: makeId('m'), from: 'human', at: new Date().toISOString(), text, author }],
              }
            : c,
        )
        return store.conversations.find((c) => c.id === id) || null
      })
    }
  },

  listCalls: () => request(() => []),
  listMessages: () => request(() => []),
  listTranscripts: () => request(() => []),
  getTranscript: () => request(() => null),
}

export default conversationService
