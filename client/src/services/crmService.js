import { request, makeId } from './mockClient'
import { store, crm } from './store'
import { api, live } from './api'

export const crmService = {
  listContacts: () => request(() => store.contacts),

  getContact: (id) => request(() => store.contacts.find((c) => c.id === id) || null),

  createContact: (contact) =>
    request(() => {
      store.contacts = [
        {
          id: makeId('ct'),
          tags: [],
          notes: [],
          leadStatus: 'New',
          channel: 'web',
          createdAt: new Date().toISOString(),
          lastInteraction: new Date().toISOString(),
          ...contact,
        },
        ...store.contacts,
      ]
      return store.contacts
    }),

  updateContact: (id, patch) =>
    request(() => {
      store.contacts = store.contacts.map((c) => (c.id === id ? { ...c, ...patch } : c))
      return store.contacts.find((c) => c.id === id)
    }),

  deleteContact: (id) =>
    request(() => {
      store.contacts = store.contacts.filter((c) => c.id !== id)
      return store.contacts
    }),

  addContactNote: (id, text, author) =>
    request(() => {
      store.contacts = store.contacts.map((c) =>
        c.id === id
          ? { ...c, notes: [...(c.notes || []), { id: makeId('n'), author, at: new Date().toISOString(), text }] }
          : c,
      )
      return store.contacts.find((c) => c.id === id)
    }),

  listLeads: () => request(() => store.leads),

  updateLead: (id, patch) =>
    request(() => {
      store.leads = store.leads.map((l) => (l.id === id ? { ...l, ...patch, lastActivity: new Date().toISOString() } : l))
      return store.leads
    }),

  // Bookings live on the server so the WhatsApp AI's pending requests show up here.
  listBookings: async () => {
    store.bookings = await live('/bookings', {}, () => store.bookings)
    return store.bookings
  },

  createBooking: async (booking) => {
    store.bookings = await api('/bookings', { method: 'POST', body: { source: 'manual', ...booking } })
    return store.bookings
  },

  updateBooking: async (id, patch) => {
    store.bookings = await api(`/bookings/${id}`, { method: 'PATCH', body: patch })
    return store.bookings
  },

  deleteBooking: async (id) => {
    store.bookings = await api(`/bookings/${id}`, { method: 'DELETE' })
    return store.bookings
  },

  getReferenceData: () =>
    request({ leadStatuses: crm.leadStatuses, bookingStatuses: crm.bookingStatuses }),
}

export default crmService
