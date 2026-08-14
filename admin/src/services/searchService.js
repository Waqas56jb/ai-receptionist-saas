import { request } from './mockClient'
import { store } from './store'

const has = (haystack, needle) => String(haystack || '').toLowerCase().includes(needle)

/** Categorised global search across the whole control plane. */
export const searchService = {
  search: (query) =>
    request(
      () => {
        const q = query.trim().toLowerCase()
        if (q.length < 2) return []
        const out = []

        store.businesses.forEach((b) => {
          if (has(b.name, q) || has(b.owner, q) || has(b.email, q) || has(b.phone, q)) {
            out.push({ id: b.id, type: 'Business', title: b.name, subtitle: `${b.owner} · ${b.plan}`, href: `/businesses/${b.id}` })
          }
        })
        store.users.forEach((u) => {
          if (has(u.name, q) || has(u.email, q) || has(u.phone, q)) {
            out.push({ id: u.id, type: 'User', title: u.name, subtitle: `${u.business} · ${u.role}`, href: `/users/${u.id}` })
          }
        })
        store.subscriptions.forEach((s) => {
          if (has(s.business, q) || has(s.plan, q)) {
            out.push({ id: s.id, type: 'Subscription', title: s.business, subtitle: `${s.plan} · ${s.status}`, href: `/subscriptions/${s.id}` })
          }
        })
        store.invoices.forEach((i) => {
          if (has(i.number, q) || has(i.business, q)) {
            out.push({ id: i.id, type: 'Invoice', title: i.number, subtitle: `${i.business} · €${i.amount}`, href: '/invoices' })
          }
        })
        store.calls.forEach((c) => {
          if (has(c.customer, q) || has(c.phone, q) || has(c.business, q)) {
            out.push({ id: c.id, type: 'Call', title: c.customer, subtitle: `${c.business} · ${c.phone}`, href: '/calls' })
          }
        })
        store.conversations.forEach((c) => {
          if (has(c.customer, q) || has(c.lastMessage, q)) {
            out.push({ id: c.id, type: 'Conversation', title: c.customer, subtitle: c.business, href: '/conversations' })
          }
        })
        store.tickets.forEach((t) => {
          if (has(t.subject, q) || has(t.business, q) || has(t.id, q)) {
            out.push({ id: t.id, type: 'Ticket', title: t.subject, subtitle: `${t.id} · ${t.business}`, href: `/support/${t.id}` })
          }
        })

        return out.slice(0, 14)
      },
      { latency: [150, 350] },
    ),
}

export default searchService
