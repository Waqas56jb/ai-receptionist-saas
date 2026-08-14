import { request } from './mockClient'
import { store } from './store'

const matches = (haystack, needle) => String(haystack || '').toLowerCase().includes(needle)

/** Global header search across the demo dataset. */
export const searchService = {
  search: (query) =>
    request(
      () => {
        const q = query.trim().toLowerCase()
        if (q.length < 2) return []

        const results = []

        store.contacts.forEach((c) => {
          if (matches(c.name, q) || matches(c.email, q) || matches(c.phone, q) || matches(c.company, q)) {
            results.push({ id: c.id, type: 'Contact', title: c.name, subtitle: c.email || c.phone, href: `/app/contacts/${c.id}` })
          }
        })

        store.conversations.forEach((c) => {
          if (matches(c.customer, q) || matches(c.preview, q)) {
            results.push({ id: c.id, type: 'Conversation', title: c.customer, subtitle: c.preview, href: `/app/conversations?id=${c.id}` })
          }
        })

        store.leads.forEach((l) => {
          if (matches(l.name, q) || matches(l.note, q)) {
            results.push({ id: l.id, type: 'Lead', title: l.name, subtitle: `${l.status} · ${l.note}`, href: '/app/leads' })
          }
        })

        store.calls.forEach((c) => {
          if (matches(c.customer, q) || matches(c.phone, q)) {
            results.push({ id: c.id, type: 'Call', title: c.customer, subtitle: c.phone, href: '/app/calls' })
          }
        })

        store.knowledgeItems.forEach((k) => {
          if (matches(k.title, q) || matches(k.body, q)) {
            results.push({ id: k.id, type: 'Knowledge', title: k.title, subtitle: k.category, href: '/app/knowledge-base' })
          }
        })

        store.documents.forEach((d) => {
          if (matches(d.name, q)) {
            results.push({ id: d.id, type: 'Document', title: d.name, subtitle: d.status, href: '/app/ai-training' })
          }
        })

        return results.slice(0, 12)
      },
      { latency: [150, 350] },
    ),
}

export default searchService
