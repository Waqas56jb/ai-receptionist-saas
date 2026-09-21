import { api } from './api'

const has = (haystack, needle) => String(haystack || '').toLowerCase().includes(needle)

/** Categorised global search across live accounts and conversations. */
export const searchService = {
  search: async (query) => {
    const q = String(query || '').trim().toLowerCase()
    if (q.length < 2) return []
    try {
      const [accounts, conversations] = await Promise.all([
        api('/admin/accounts').catch(() => []),
        api('/admin/conversations').catch(() => []),
      ])
      const out = []
      ;(Array.isArray(accounts) ? accounts : []).forEach((row) => {
        const business = row.business_name || row.business || row.name
        if (has(row.name, q) || has(row.email, q) || has(row.phone, q) || has(business, q)) {
          out.push({ id: row.id, type: 'Business', title: business, subtitle: `${row.name} · ${row.plan || 'Starter'}`, href: `/businesses/${row.id}` })
          out.push({ id: `user-${row.id}`, type: 'User', title: row.name, subtitle: `${business} · ${row.role || 'Owner'}`, href: `/users/${row.id}` })
        }
      })
      ;(Array.isArray(conversations) ? conversations : []).forEach((c) => {
        if (has(c.customer, q) || has(c.lastMessage, q) || has(c.business, q)) {
          out.push({ id: c.id, type: 'Conversation', title: c.customer, subtitle: c.business, href: '/conversations' })
        }
      })
      return out.slice(0, 14)
    } catch {
      return []
    }
  },
}

export default searchService
