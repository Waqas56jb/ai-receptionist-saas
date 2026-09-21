import { request, makeId } from './mockClient'
import { store, ai } from './store'
import { api, live } from './api'

export const knowledgeService = {
  listItems: () => api('/knowledge'),

  createItem: (item) => api('/knowledge', { method: 'POST', body: item }),

  updateItem: (id, patch) => api(`/knowledge/${id}`, { method: 'PATCH', body: patch }),

  deleteItem: (id) => api(`/knowledge/${id}`, { method: 'DELETE' }),

  listDocuments: () =>
    live('/knowledge', {}, async () => {
      const items = await request(() => store.documents)
      return items
    }).then((rows) => {
      if (Array.isArray(rows) && rows[0]?.fileName) {
        return rows
          .filter((row) => row.source === 'PDF' || row.source === 'Document' || row.source === 'Image')
          .map((row) => ({
            id: row.id,
            name: row.fileName || row.title,
            type: row.source,
            size: 0,
            uploadedAt: row.updatedAt,
            status: row.status === 'Active' ? 'Indexed' : row.status,
            pages: null,
          }))
      }
      return rows
    }),

  uploadDocument: async (file) => {
    try {
      const form = new FormData()
      form.append('files', file)
      const rows = await api('/knowledge/upload', { method: 'POST', form })
      return rows
        .filter((row) => row.source === 'PDF' || row.source === 'Document' || row.source === 'Image')
        .map((row) => ({
          id: row.id,
          name: row.fileName || row.title,
          type: row.source,
          size: file.size,
          uploadedAt: row.updatedAt,
          status: 'Indexed',
          pages: null,
        }))
    } catch (error) {
      if (error.code !== 'API_OFFLINE') throw error
      return request(
        () => {
          store.documents = [
            {
              id: makeId('doc'),
              name: file.name,
              type: (file.name.split('.').pop() || '').toUpperCase(),
              size: file.size,
              uploadedAt: new Date().toISOString(),
              status: 'Processing',
              pages: null,
            },
            ...store.documents,
          ]
          return store.documents
        },
        { latency: [800, 1400] },
      )
    }
  },

  reprocessDocument: (id) =>
    request(() => {
      store.documents = store.documents.map((d) => (d.id === id ? { ...d, status: 'Processing' } : d))
      return store.documents
    }),

  deleteDocument: (id) =>
    live(`/knowledge/${id}`, { method: 'DELETE' }, () =>
      request(() => {
        store.documents = store.documents.filter((d) => d.id !== id)
        return store.documents
      }),
    ),

  listWebsiteSources: () => request(() => store.websiteSources),

  importWebsite: (url) =>
    request(
      () => {
        store.websiteSources = [
          { id: makeId('web'), url, pages: 0, status: 'Importing', importedAt: new Date().toISOString() },
          ...store.websiteSources,
        ]
        return store.websiteSources
      },
      { latency: [900, 1500] },
    ),

  removeWebsiteSource: (id) =>
    request(() => {
      store.websiteSources = store.websiteSources.filter((w) => w.id !== id)
      return store.websiteSources
    }),

  getCategories: () => request(ai.knowledgeCategories),
}

export default knowledgeService
