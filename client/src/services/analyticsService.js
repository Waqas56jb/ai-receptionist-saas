import { request } from './mockClient'
import { store, insights } from './store'

export const analyticsService = {
  getSummary: (range = '7d') => request(() => insights.summary[range] || insights.summary['7d']),

  getTimeseries: (range = '7d') => request(() => insights.timeseries[range] || insights.timeseries['7d']),

  getBreakdowns: () =>
    request({
      channels: insights.channelBreakdown,
      handling: insights.handlingBreakdown,
      languages: insights.languageBreakdown,
      peakHours: insights.peakHours,
      channelPerformance: insights.channelPerformance,
    }),

  getUsage: () => request(() => store.usage),

  getDateRanges: () => request(insights.dateRanges),
}

export default analyticsService
