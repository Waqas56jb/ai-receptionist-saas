import { request, makeId } from './mockClient'
import { store, crm } from './store'

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

  listBookings: () => request(() => store.bookings),

  createBooking: (booking) =>
    request(() => {
      store.bookings = [{ id: makeId('bk'), status: 'Pending', source: 'web', notes: '', ...booking }, ...store.bookings]
      return store.bookings
    }),

  updateBooking: (id, patch) =>
    request(() => {
      store.bookings = store.bookings.map((b) => (b.id === id ? { ...b, ...patch } : b))
      return store.bookings
    }),

  deleteBooking: (id) =>
    request(() => {
      store.bookings = store.bookings.filter((b) => b.id !== id)
      return store.bookings
    }),

  getReferenceData: () =>
    request({ leadStatuses: crm.leadStatuses, bookingStatuses: crm.bookingStatuses }),
}

export default crmService
