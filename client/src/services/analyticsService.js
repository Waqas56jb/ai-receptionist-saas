import { request } from './mockClient'
import { store, insights } from './store'
import { api, live, isApiOfflineError } from './api'

const emptySummary = {
  calls: 0,
  messages: 0,
  conversations: 0,
  leads: 0,
  bookings: 0,
  missedCalls: 0,
  aiResolution: 0,
  handoff: 0,
  avgDuration: 0,
  activeChannels: 0,
  whatsapp: 0,
  web: 0,
  inbound: 0,
  outbound: 0,
  voice: 0,
}

function fromKpis(kpis) {
  const summary = {
    ...emptySummary,
    ...(kpis.summary || {}),
    messages: kpis.summary?.messages ?? 0,
    conversations: kpis.summary?.conversations ?? 0,
    leads: kpis.summary?.leads ?? kpis.summary?.inbound ?? 0,
    whatsapp: kpis.summary?.whatsapp ?? 0,
    web: kpis.summary?.web ?? 0,
    inbound: kpis.summary?.inbound ?? 0,
    outbound: kpis.summary?.outbound ?? 0,
    activeChannels: [kpis.summary?.whatsapp, kpis.summary?.web].filter(Boolean).length,
  }
  const daily = (kpis.daily || []).map((day) => ({
    date: day.date,
    messages: day.total ?? day.messages ?? 0,
    inbound: day.inbound ?? 0,
    outbound: day.outbound ?? 0,
    web: day.web ?? 0,
    whatsapp: day.whatsapp ?? 0,
    conversations: day.conversations ?? day.inbound ?? 0,
    leads: day.inbound ?? 0,
  }))
  return { summary, daily }
}

export const analyticsService = {
  getDailyKpis: () => live('/kpis', {}, () => request(() => ({ summary: emptySummary, daily: [] }))),

  getSummary: async () => {
    try {
      return fromKpis(await api('/kpis')).summary
    } catch (error) {
      if (!isApiOfflineError(error)) throw error
      return emptySummary
    }
  },

  getTimeseries: async () => {
    try {
      return fromKpis(await api('/kpis')).daily
    } catch (error) {
      if (!isApiOfflineError(error)) throw error
      return []
    }
  },

  getBreakdowns: async () => {
    const empty = {
      channels: [
        { name: 'WhatsApp', value: 0, color: '#34d399' },
        { name: 'Website', value: 0, color: '#60a5fa' },
      ],
      handling: [
        { name: 'Handled by AI', value: 0, color: '#14b8a6' },
        { name: 'Human handoff', value: 0, color: '#8aa39c' },
      ],
      languages: [],
      peakHours: [],
      channelPerformance: [
        { channel: 'WhatsApp', conversations: 0, aiResolved: 0, leads: 0, avgResponse: '—' },
        { channel: 'Website', conversations: 0, aiResolved: 0, leads: 0, avgResponse: '—' },
      ],
    }
    try {
      const kpis = await api('/kpis')
      return {
        ...empty,
        channels: (kpis.channels || empty.channels).filter((row) => row.name === 'WhatsApp' || row.name === 'Website'),
        handling: kpis.handling || empty.handling,
        channelPerformance: (kpis.channelPerformance || empty.channelPerformance).filter(
          (row) => row.channel === 'WhatsApp' || row.channel === 'Website',
        ),
      }
    } catch (error) {
      if (!isApiOfflineError(error)) throw error
      return empty
    }
  },

  getUsage: async () => {
    try {
      const kpis = await api('/kpis')
      return {
        planName: 'Starter',
        cycleStart: null,
        cycleEnd: null,
        metrics: [
          { key: 'messages', label: 'Messages', used: kpis.summary?.messages || 0, limit: 0, unit: 'messages' },
          { key: 'conversations', label: 'Conversations', used: kpis.summary?.conversations || 0, limit: 0, unit: 'conversations' },
          { key: 'whatsapp', label: 'WhatsApp', used: kpis.summary?.whatsapp || 0, limit: 0, unit: 'chats' },
          { key: 'web', label: 'Website', used: kpis.summary?.web || 0, limit: 0, unit: 'chats' },
        ],
      }
    } catch (error) {
      if (!isApiOfflineError(error)) throw error
      return { planName: 'Starter', cycleStart: null, cycleEnd: null, metrics: [] }
    }
  },

  getDateRanges: () => request(insights.dateRanges),
}

export default analyticsService
