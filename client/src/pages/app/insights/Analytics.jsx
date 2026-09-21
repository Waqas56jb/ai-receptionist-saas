import { useState } from 'react'
import { Bot, MessagesSquare, Send, Target, UserCheck } from 'lucide-react'
import cn from '../../../lib/cn'
import PageHeader from '../../../components/layout/PageHeader'
import { Card, CardBody, CardHeader } from '../../../components/ui/Card'
import StatCard from '../../../components/ui/StatCard'
import { SkeletonStats, SkeletonChart } from '../../../components/ui/Skeleton'
import { ErrorState } from '../../../components/ui/States'
import { ChartFrame, ColumnChart, DonutChart, TrendChart, chartColors } from '../../../components/charts/Charts'
import useAsync from '../../../hooks/useAsync'
import analyticsService from '../../../services/analyticsService'
import { dateRanges } from '../../../data/mock/insights'
import { formatNumber, formatPercent } from '../../../lib/format'

export default function Analytics() {
  const [range, setRange] = useState('7d')

  const summary = useAsync(() => analyticsService.getSummary(range), [range])
  const series = useAsync(() => analyticsService.getTimeseries(range), [range])
  const breakdowns = useAsync(() => analyticsService.getBreakdowns(), [])
  const kpis = useAsync(() => analyticsService.getDailyKpis(), [])

  const s = summary.data

  return (
    <>
      <PageHeader
        title="Analytics"
        description="How your AI receptionist is performing, and where your customers come from."
        actions={
          <div className="flex flex-wrap gap-1.5 rounded-xl border border-slate-200 bg-white p-1">
            {dateRanges.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRange(r.id)}
                aria-pressed={range === r.id}
                className={cn(
                  'rounded-lg px-3 py-1.5 text-[0.78rem] font-semibold transition-colors',
                  range === r.id ? 'bg-brand-600 text-white' : 'text-slate-500 hover:text-ink-900',
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
        }
      />

      {summary.loading && <SkeletonStats count={4} />}
      {summary.error && (
        <Card>
          <ErrorState onRetry={summary.reload} />
        </Card>
      )}

      {s && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Messages" value={formatNumber(s.messages)} icon={Send} />
          <StatCard label="Conversations" value={formatNumber(s.conversations)} icon={MessagesSquare} />
          <StatCard label="WhatsApp" value={formatNumber(s.whatsapp)} icon={Send} />
          <StatCard label="Website" value={formatNumber(s.web)} icon={MessagesSquare} />
          <StatCard label="Inbound" value={formatNumber(s.inbound)} icon={Target} />
          <StatCard label="Replies" value={formatNumber(s.outbound)} icon={Bot} />
          <StatCard label="AI resolution rate" value={formatPercent(s.aiResolution || 0)} icon={Bot} />
          <StatCard label="Human handoff" value={formatPercent(s.handoff || 0)} icon={UserCheck} />
        </div>
      )}

      {kpis.data?.daily && (
        <div className="mt-4">
          <ChartFrame title="Daily conversations" description="This account only — WhatsApp and website widget.">
            <TrendChart
              data={kpis.data.daily}
              series={[
                { key: 'inbound', label: 'Inbound', color: chartColors.brand },
                { key: 'outbound', label: 'Replies', color: chartColors.emerald },
                { key: 'web', label: 'Website', color: chartColors.sky },
                { key: 'whatsapp', label: 'WhatsApp', color: chartColors.emerald },
              ]}
            />
          </ChartFrame>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        {series.loading ? (
          <SkeletonChart />
        ) : (
          <ChartFrame title="WhatsApp over time" description="WhatsApp messages per period">
            <TrendChart data={series.data || []} series={[{ key: 'whatsapp', label: 'WhatsApp', color: chartColors.brand }]} />
          </ChartFrame>
        )}

        {series.loading ? (
          <SkeletonChart />
        ) : (
          <ChartFrame title="Website over time" description="Website widget chats">
            <TrendChart data={series.data || []} series={[{ key: 'web', label: 'Website', color: chartColors.sky }]} />
          </ChartFrame>
        )}

        {series.loading ? (
          <SkeletonChart />
        ) : (
          <ChartFrame title="Inbound over time" description="Customer messages">
            <TrendChart data={series.data || []} series={[{ key: 'inbound', label: 'Inbound', color: chartColors.emerald }]} />
          </ChartFrame>
        )}

        {breakdowns.loading ? (
          <SkeletonChart />
        ) : (
          <ChartFrame title="Conversations by channel" description="Where your customers reach you">
            <DonutChart data={breakdowns.data?.channels || []} />
          </ChartFrame>
        )}

        {breakdowns.loading ? (
          <SkeletonChart />
        ) : (
          <ChartFrame title="AI vs human handling" description="Share of conversations resolved without your team">
            <DonutChart data={breakdowns.data?.handling || []} suffix="%" />
          </ChartFrame>
        )}

        {breakdowns.loading ? (
          <SkeletonChart />
        ) : (
          <ChartFrame title="Language distribution" description="Languages your customers use">
            <DonutChart data={breakdowns.data?.languages || []} suffix="%" />
          </ChartFrame>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        {breakdowns.loading ? (
          <SkeletonChart />
        ) : (
          <ChartFrame title="Peak hours" description="When your customers get in touch">
            <ColumnChart
              data={breakdowns.data?.peakHours || []}
              series={[{ key: 'value', label: 'Conversations', color: chartColors.brand }]}
            />
          </ChartFrame>
        )}

        <Card>
          <CardHeader title="Channel performance" description="Resolution rate and leads per channel." />
          <CardBody className="p-0 sm:p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[30rem] text-left">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50/60">
                    {['Channel', 'Conversations', 'AI resolved', 'Leads', 'Avg response'].map((h) => (
                      <th key={h} className="px-5 py-2.5 text-[0.68rem] font-bold uppercase tracking-wider text-slate-500">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(breakdowns.data?.channelPerformance || []).map((row) => (
                    <tr key={row.channel}>
                      <td className="px-5 py-3 text-[0.83rem] font-semibold text-ink-900">{row.channel}</td>
                      <td className="px-5 py-3 text-[0.83rem] text-slate-600">{formatNumber(row.conversations)}</td>
                      <td className="px-5 py-3 text-[0.83rem] text-slate-600">{row.aiResolved}%</td>
                      <td className="px-5 py-3 text-[0.83rem] text-slate-600">{row.leads}</td>
                      <td className="px-5 py-3 text-[0.83rem] text-slate-600">{row.avgResponse}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  )
}
