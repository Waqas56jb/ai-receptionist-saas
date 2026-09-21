import { api } from './api'

const matches = (haystack, needle) => String(haystack || '').toLowerCase().includes(needle)

/** Global header search across live conversations and knowledge. */
export const searchService = {
  search: async (query) => {
    const q = String(query || '').trim().toLowerCase()
    if (q.length < 2) return []
    try {
      const [conversations, knowledge] = await Promise.all([
        api('/conversations').catch(() => []),
        api('/knowledge').catch(() => []),
      ])
      const results = []
      ;(Array.isArray(conversations) ? conversations : []).forEach((c) => {
        if (matches(c.customer, q) || matches(c.preview, q)) {
          results.push({ id: c.id, type: 'Conversation', title: c.customer, subtitle: c.preview, href: `/app/conversations?id=${c.id}` })
        }
      })
      ;(Array.isArray(knowledge) ? knowledge : []).forEach((k) => {
        if (matches(k.title, q) || matches(k.body, q)) {
          results.push({ id: k.id, type: 'Knowledge', title: k.title, subtitle: k.category, href: '/app/knowledge-base' })
        }
      })
      return results.slice(0, 12)
    } catch {
      return []
    }
  },
}

export default searchService
