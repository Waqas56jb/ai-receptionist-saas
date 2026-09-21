import { api } from './api'

export const helpService = {
  getArticles: async () => {
    try {
      const data = await api('/help')
      return data.articles || []
    } catch {
      return []
    }
  },
  getFaqs: async () => {
    try {
      const data = await api('/help')
      return data.faqs || []
    } catch {
      return []
    }
  },
  getSupportChannels: async () => {
    try {
      const data = await api('/help')
      return data.support || []
    } catch {
      return []
    }
  },
  submitIssue: (issue) => api('/help/issue', { method: 'POST', body: issue }),
}

export default helpService
