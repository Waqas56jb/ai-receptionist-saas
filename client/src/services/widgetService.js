import { api } from './api'

function fallbackWidget() {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:4000'
  const apiOrigin = origin.includes('517') ? 'http://localhost:4000' : origin
  return {
    token: '',
    scriptUrl: `${apiOrigin}/widget.js`,
    frameUrl: '',
    snippet: `<!-- Sign in again if this stays empty, then copy the snippet from Website Widget. -->`,
    iframe: '',
    businessName: 'Your business',
  }
}

export const widgetService = {
  get: async () => {
    try {
      return await api('/widget')
    } catch {
      return fallbackWidget()
    }
  },

  regenerate: async () => {
    try {
      return await api('/widget/regenerate', { method: 'POST' })
    } catch (error) {
      if (error.code === 'API_OFFLINE') return fallbackWidget()
      throw error
    }
  },
}

export default widgetService
