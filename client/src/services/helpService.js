import { request } from './mockClient'
import { platform } from './store'

export const helpService = {
  getArticles: () => request(platform.helpArticles),
  getFaqs: () => request(platform.faqs),
  getSupportChannels: () => request(platform.supportChannels),
  submitIssue: () => request({ ok: true, reference: 'SUP-2026-0841' }, { latency: [600, 1100] }),
}

export default helpService
