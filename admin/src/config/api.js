export const DEPLOYED_API_URL = 'https://ai-receptionist-saas-server.vercel.app/api'
export const DEPLOYED_API_ORIGIN = 'https://ai-receptionist-saas-server.vercel.app'

export const API_BASE = String(import.meta.env.VITE_API_URL || DEPLOYED_API_URL).replace(/\/$/, '')

export function authErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (error?.code === 'API_OFFLINE') return 'Cannot reach the server. Check your connection and try again.'
  if (error?.status === 401) return error.message || 'Email or password is incorrect.'
  if (error?.status === 429) return 'Too many attempts. Please wait a moment and try again.'
  return error?.message || fallback
}
