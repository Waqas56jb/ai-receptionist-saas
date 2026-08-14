import { request, makeId } from './mockClient'
import { store, ai } from './store'

export const knowledgeService = {
  listItems: () => request(() => store.knowledgeItems),

  createItem: (item) =>
    request(() => {
      store.knowledgeItems = [
        { id: makeId('kb'), status: 'Active', source: 'Manual', updatedAt: new Date().toISOString(), ...item },
        ...store.knowledgeItems,
      ]
      return store.knowledgeItems
    }),

  updateItem: (id, patch) =>
    request(() => {
      store.knowledgeItems = store.knowledgeItems.map((k) =>
        k.id === id ? { ...k, ...patch, updatedAt: new Date().toISOString() } : k,
      )
      return store.knowledgeItems
    }),

  deleteItem: (id) =>
    request(() => {
      store.knowledgeItems = store.knowledgeItems.filter((k) => k.id !== id)
      return store.knowledgeItems
    }),

  listDocuments: () => request(() => store.documents),

  uploadDocument: (file) =>
    request(
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
    ),

  reprocessDocument: (id) =>
    request(() => {
      store.documents = store.documents.map((d) => (d.id === id ? { ...d, status: 'Processing' } : d))
      return store.documents
    }),

  deleteDocument: (id) =>
    request(() => {
      store.documents = store.documents.filter((d) => d.id !== id)
      return store.documents
    }),

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
