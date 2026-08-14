import { request, makeId } from './mockClient'
import { store } from './store'

export const conversationService = {
  list: () => request(() => store.conversations),

  get: (id) => request(() => store.conversations.find((c) => c.id === id) || null),

  update: (id, patch) =>
    request(() => {
      store.conversations = store.conversations.map((c) => (c.id === id ? { ...c, ...patch } : c))
      return store.conversations.find((c) => c.id === id)
    }),

  addNote: (id, text, author) =>
    request(() => {
      store.conversations = store.conversations.map((c) =>
        c.id === id
          ? { ...c, notes: [...(c.notes || []), { id: makeId('n'), author, at: new Date().toISOString(), text }] }
          : c,
      )
      return store.conversations.find((c) => c.id === id)
    }),

  sendReply: (id, text, author) =>
    request(() => {
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
      return store.conversations.find((c) => c.id === id)
    }),

  listCalls: () => request(() => store.calls),

  listMessages: () => request(() => store.messages),

  listTranscripts: () => request(() => store.transcripts),

  getTranscript: (id) => request(() => store.transcripts.find((t) => t.id === id) || null),
}

export default conversationService
