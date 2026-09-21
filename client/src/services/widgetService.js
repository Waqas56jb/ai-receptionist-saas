import { apiOrigin } from '../config/api'
import { api } from './api'

function fallbackWidget() {
  const origin = apiOrigin()
  return {
    token: '',
    scriptUrl: `${origin}/widget.js`,
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
