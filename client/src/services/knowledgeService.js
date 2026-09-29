import { request, makeId } from './mockClient'
import { store, ai } from './store'
import { api, live } from './api'
import { compressImage } from '../lib/image'

const MAX_UPLOAD_BYTES = 20 * 1024 * 1024

/** Toast text for files that did not upload. */
export function describeUploadFailures(failed = []) {
  if (!failed.length) return ''
  const names = failed.map((row) => `${row.name} (${row.reason})`).join(', ')
  const dropped = failed.some((row) => row.reason === 'connection dropped')
  return `Could not upload ${names}.${dropped ? ' The connection dropped — try again on Wi-Fi or with a smaller file.' : ''}`
}

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
      if (!Array.isArray(rows)) return rows
      const docs = rows.filter((row) => row.source === 'PDF' || row.source === 'Document' || row.source === 'Image')
      if (docs.length || rows.some((row) => row.fileName)) {
        return docs.map((row) => ({
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

  uploadDocument: async (file, options = {}) => {
    const { items, failed } = await knowledgeService.uploadDocuments([file], options)
    if (!items) throw new Error(describeUploadFailures(failed) || 'Upload failed.')
    return items
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
  },

  /**
   * One request per file (photos compressed first), so a slow or dropping mobile connection
   * only has to carry one small file at a time. A dropped upload is retried once; the server
   * ignores an identical re-upload. Resolves to { items, uploaded, failed: [{ name, reason }] }.
   */
  uploadDocuments: async (files, { sector, category } = {}) => {
    let items = null
    let uploaded = 0
    const failed = []
    for (const original of files) {
      const file = await compressImage(original)
      if (file.size > MAX_UPLOAD_BYTES) {
        failed.push({ name: original.name, reason: 'larger than 20 MB' })
        continue
      }
      const form = new FormData()
      form.append('files', file)
      if (sector) form.append('sector', sector)
      if (category) form.append('category', category)
      for (let attempt = 1; attempt <= 2; attempt += 1) {
        try {
          items = await api('/knowledge/upload', { method: 'POST', body: form })
          uploaded += 1
          break
        } catch (error) {
          if (error.code === 'API_OFFLINE' && attempt === 1) {
            await new Promise((resolve) => setTimeout(resolve, 1500))
            continue
          }
          failed.push({ name: original.name, reason: error.code === 'API_OFFLINE' ? 'connection dropped' : error.message })
          break
        }
      }
    }
    return { items, uploaded, failed }
  },

  listSectors: () => api('/knowledge/sectors'),

  loadSectorPack: (sector) => api('/knowledge/sector-pack', { method: 'POST', body: { sector } }),

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
