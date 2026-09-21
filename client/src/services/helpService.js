import { request } from './mockClient'

export const helpService = {
  getArticles: () => request([]),
  getFaqs: () => request([]),
  getSupportChannels: () => request([]),
  submitIssue: () => request({ ok: true, reference: `SUP-${Date.now()}` }),
}

export default helpService
