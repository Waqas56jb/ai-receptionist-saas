import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bot, Building2, CreditCard, Gauge, MessagesSquare, Phone, TrendingUp, Users } from 'lucide-react'
import { cn, exportCsv, formatCompactCurrency, formatCurrency, formatNumber, formatPercent } from '../../lib/utils'
import PageHeader from '../../components/layout/PageHeader'
import { Card, CardBody, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge, { StatusBadge } from '../../components/ui/Badge'
import DataTable from '../../components/ui/DataTable'
import FilterBar from '../../components/ui/FilterBar'
import { EmptyState } from '../../components/ui/States'
import { SkeletonChart, SkeletonStats } from '../../components/ui/Skeleton'
import { ProgressBar, StatCard } from '../../components/ui/Misc'
import { ChartFrame, ColumnChart, DonutChart, LineSeriesChart, TrendChart, chartColors } from '../../components/charts/Charts'
import { useAsync, useTable } from '../../hooks'
import { analyticsService } from '../../services/platformService'
import { aiService } from '../../services/aiService'

const ranges = ['Today', '7 days', '30 days', '90 days', '12 months', 'Custom']

function RangePicker({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-1 rounded-xl border border-slate-200 bg-white p-1">
      {ranges.map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => onChange(r)}
          aria-pressed={value === r}
          className={cn('rounded-lg px-3 py-1.5 text-[0.76rem] font-semibold transition-colors', value === r ? 'bg-brand-600 text-white' : 'text-slate-500 hover:text-ink-900')}
        >
          {r}
        </button>
      ))}
    </div>
  )
}

/* ------------------------------------------------------ Platform analytics --- */

export function PlatformAnalytics() {
  const [range, setRange] = useState('12 months')
  const summary = useAsync(() => analyticsService.getSummary(), [])
  const growth = useAsync(() => analyticsService.getGrowth(), [])
  const channels = useAsync(() => analyticsService.getChannelDistribution(), [])

  const s = summary.data

  return (
    <>
      <PageHeader
        title="Platform analytics"
        description="Growth, revenue and AI activity across every business."
        actions={<RangePicker value={range} onChange={setRange} />}
      />

      {summary.loading && <SkeletonStats count={4} />}

      {s && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="New businesses" value={formatNumber(s.businesses.newThisMonth)} delta="+18%" icon={Building2} hint={`${s.businesses.total} total`} />
            <StatCard label="Active businesses" value={formatNumber(s.businesses.active)} icon={Building2} hint={`${s.businesses.trial} on trial`} />
            <StatCard label="New users" value={formatNumber(s.users.newThisMonth)} delta="+12%" icon={Users} hint={`${s.users.total} total`} />
            <StatCard label="Active users" value={formatNumber(s.users.active)} icon={Users} hint="Signed in this month" />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="MRR" value={formatCurrency(s.revenue.mrr)} delta={formatPercent(s.revenue.growthPct, 1)} icon={CreditCard} />
            <StatCard label="ARR" value={formatCompactCurrency(s.revenue.arr)} icon={TrendingUp} />
            <StatCard label="Avg revenue per business" value={formatCurrency(Math.round(s.revenue.mrr / s.businesses.active))} icon={CreditCard} hint="Active businesses only" />
            <StatCard label="AI resolution rate" value={formatPercent(s.ai.resolutionRate, 1)} delta="+2.4%" icon={Bot} />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Calls" value={formatNumber(s.ai.calls)} icon={Phone} />
            <StatCard label="Messages" value={formatNumber(s.ai.messages)} icon={MessagesSquare} />
            <StatCard label="AI minutes" value={formatNumber(s.ai.minutes)} icon={Gauge} />
            <StatCard label="Conversations" value={formatNumber(s.ai.conversations)} icon={MessagesSquare} />
          </div>
        </>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        {growth.loading ? <SkeletonChart /> : (
          <ChartFrame title="Business growth" description="Cumulative businesses per month">
            <TrendChart data={growth.data || []} series={[{ key: 'businesses', label: 'Businesses', color: chartColors.brand }]} />
          </ChartFrame>
        )}
        {growth.loading ? <SkeletonChart /> : (
          <ChartFrame title="User growth" description="Cumulative users per month">
            <TrendChart data={growth.data || []} series={[{ key: 'users', label: 'Users', color: chartColors.brandLight }]} />
          </ChartFrame>
        )}
        {growth.loading ? <SkeletonChart /> : (
          <ChartFrame title="Calls and messages" description="Volume handled by the platform">
            <ColumnChart
              data={growth.data || []}
              series={[
                { key: 'calls', label: 'Calls', color: chartColors.brand },
                { key: 'messages', label: 'Messages', color: chartColors.brandPale },
              ]}
            />
          </ChartFrame>
        )}
        {channels.loading ? <SkeletonChart /> : (
          <ChartFrame title="Channel distribution" description="Businesses using each channel">
            <DonutChart data={channels.data || []} />
          </ChartFrame>
        )}
      </div>
    </>
  )
}

/* ------------------------------------------------------- Revenue analytics --- */

export function RevenueAnalytics() {
  const [range, setRange] = useState('12 months')
  const growth = useAsync(() => analyticsService.getGrowth(), [])
  const byPlan = useAsync(() => analyticsService.getRevenueByPlan(), [])
  const movement = useAsync(() => analyticsService.getSubscriptionMovement(), [])
  const summary = useAsync(() => analyticsService.getSummary(), [])

  const s = summary.data

  return (
    <>
      <PageHeader
        title="Revenue analytics"
        breadcrumbs={[{ label: 'Analytics', to: '/analytics' }, { label: 'Revenue' }]}
        description="Recurring revenue, plan mix and subscription movement."
        actions={<RangePicker value={range} onChange={setRange} />}
      />

      {summary.loading && <SkeletonStats count={4} />}

      {s && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="MRR" value={formatCurrency(s.revenue.mrr)} delta={formatPercent(s.revenue.growthPct, 1)} icon={CreditCard} />
          <StatCard label="ARR" value={formatCompactCurrency(s.revenue.arr)} icon={TrendingUp} />
          <StatCard label="This month" value={formatCurrency(s.revenue.currentMonth)} hint={`Previous ${formatCurrency(s.revenue.previousMonth)}`} icon={CreditCard} />
          <StatCard label="Total revenue" value={formatCompactCurrency(s.revenue.totalRevenue)} icon={TrendingUp} hint="Since launch" />
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        {growth.loading ? <SkeletonChart /> : (
          <ChartFrame title="Monthly recurring revenue" description="MRR per month">
            <TrendChart data={growth.data || []} series={[{ key: 'revenue', label: 'Revenue', color: chartColors.emerald }]} prefix="€" />
          </ChartFrame>
        )}
        {byPlan.loading ? <SkeletonChart /> : (
          <ChartFrame title="Revenue by plan" description="Share of MRR">
            <DonutChart data={byPlan.data || []} prefix="€" />
          </ChartFrame>
        )}
        {movement.loading ? <SkeletonChart /> : (
          <ChartFrame title="Subscription movement" description="New, upgrades, downgrades and churn" className="xl:col-span-2" height={280}>
            <LineSeriesChart
              data={movement.data || []}
              series={[
                { key: 'new', label: 'New', color: chartColors.brand },
                { key: 'upgrades', label: 'Upgrades', color: chartColors.emerald },
                { key: 'downgrades', label: 'Downgrades', color: chartColors.amber },
                { key: 'churn', label: 'Churn', color: chartColors.rose },
              ]}
            />
          </ChartFrame>
        )}
      </div>
    </>
  )
}

/* --------------------------------------------------------- Usage analytics --- */

export function UsageAnalytics() {
  const usage = useAsync(() => analyticsService.getUsageByBusiness(), [])
  const aiUsage = useAsync(() => aiService.getUsage(), [])

  const table = useTable(usage.data || [], {
    pageSize: 10,
    initialSort: { key: 'usagePct', direction: 'desc' },
    searchFields: ['business', 'plan'],
  })

  const atRisk = (usage.data || []).filter((u) => u.usagePct >= 80)

  const columns = [
    {
      key: 'business',
      header: 'Business',
      sortable: true,
      primary: true,
      render: (row) => (
        <Link to={`/businesses/${row.businessId}`} className="font-semibold text-ink-900 hover:text-brand-600">
          {row.business}
        </Link>
      ),
    },
    { key: 'plan', header: 'Plan', sortable: true, render: (row) => <Badge tone="neutral" size="sm">{row.plan}</Badge> },
    { key: 'status', header: 'Status', sortable: true, render: (row) => <StatusBadge status={row.status} /> },
    { key: 'usagePct', header: 'Plan usage', sortable: true, render: (row) => <ProgressBar value={row.usagePct} max={100} showValue={false} className="w-28" /> },
    { key: 'calls', header: 'Calls', sortable: true, render: (row) => `${formatNumber(row.calls)} / ${formatNumber(row.callLimit)}` },
    { key: 'messages', header: 'Messages', sortable: true, hideOnMobile: true, render: (row) => `${formatNumber(row.messages)} / ${formatNumber(row.messageLimit)}` },
  ]

  return (
    <>
      <PageHeader
        title="Usage analytics"
        breadcrumbs={[{ label: 'Analytics', to: '/analytics' }, { label: 'Usage' }]}
        description="Which businesses are close to their plan limits."
        badge={<Badge tone={atRisk.length ? 'warning' : 'success'}>{atRisk.length} near or over limit</Badge>}
      />

      {atRisk.length > 0 && (
        <div className="mb-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
          <Gauge className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
          <p className="text-[0.85rem] leading-relaxed text-amber-900">
            {atRisk.map((a) => a.business).join(', ')} {atRisk.length === 1 ? 'is' : 'are'} above 80% of the plan allowance.
            Consider reaching out about an upgrade before they hit the limit.
          </p>
        </div>
      )}

      <FilterBar
        table={table}
        searchPlaceholder="Search business or plan…"
        filters={[{ key: 'plan', label: 'Plans', options: ['Starter', 'Professional', 'Enterprise'] }]}
        onExport={() =>
          exportCsv('usage.csv', table.filteredRows, [
            { header: 'Business', value: (r) => r.business },
            { header: 'Plan', value: (r) => r.plan },
            { header: 'Usage %', value: (r) => r.usagePct },
            { header: 'Calls', value: (r) => r.calls },
            { header: 'Messages', value: (r) => r.messages },
          ])
        }
      />

      <DataTable
        columns={columns}
        table={table}
        loading={usage.loading}
        error={usage.error}
        onRetry={usage.reload}
        empty={<EmptyState icon={Gauge} title="No usage data" description="Usage appears once businesses start handling conversations." />}
      />

      <Card className="mt-4">
        <CardHeader icon={Bot} title="AI consumption by business" description="Minutes used and estimated cost — demo cost model." />
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[38rem] text-left">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/60">
                  {['Business', 'AI minutes', 'Conversations', 'Knowledge items', 'Estimated cost'].map((h) => (
                    <th key={h} className="px-5 py-2.5 text-[0.66rem] font-bold uppercase tracking-wider text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(aiUsage.data || []).map((row) => (
                  <tr key={row.businessId}>
                    <td className="px-5 py-3 text-[0.83rem] font-semibold text-ink-900">{row.business}</td>
                    <td className="px-5 py-3 text-[0.83rem] text-slate-600">{formatNumber(row.minutes)}</td>
                    <td className="px-5 py-3 text-[0.83rem] text-slate-600">{formatNumber(row.conversations)}</td>
                    <td className="px-5 py-3 text-[0.83rem] text-slate-600">{row.knowledgeItems}</td>
                    <td className="px-5 py-3 text-[0.83rem] text-slate-600">{formatCurrency(row.estimatedCost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </>
  )
}

/* ---------------------------------------------------------------- AI usage --- */

export function AIUsage() {
  const [range, setRange] = useState('12 months')
  const summary = useAsync(() => analyticsService.getSummary(), [])
  const growth = useAsync(() => analyticsService.getGrowth(), [])
  const aiUsage = useAsync(() => aiService.getUsage(), [])

  const s = summary.data
  const totalCost = (aiUsage.data || []).reduce((sum, r) => sum + r.estimatedCost, 0)

  const byBusiness = (aiUsage.data || [])
    .slice()
    .sort((a, b) => b.minutes - a.minutes)
    .slice(0, 8)
    .map((r) => ({ date: r.business.split(' ')[0], minutes: r.minutes }))

  return (
    <>
      <PageHeader
        title="AI usage"
        description="How much AI the platform is consuming, and what it is costing."
        actions={<RangePicker value={range} onChange={setRange} />}
      />

      {summary.loading && <SkeletonStats count={4} />}

      {s && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total AI calls" value={formatNumber(s.ai.calls)} icon={Phone} />
          <StatCard label="AI minutes" value={formatNumber(s.ai.minutes)} icon={Gauge} />
          <StatCard label="Messages" value={formatNumber(s.ai.messages)} icon={MessagesSquare} />
          <StatCard label="Estimated AI cost" value={formatCurrency(totalCost)} icon={CreditCard} hint="Demo cost model" />
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        {growth.loading ? <SkeletonChart /> : (
          <ChartFrame title="AI usage over time" description="AI minutes consumed per month">
            <TrendChart data={growth.data || []} series={[{ key: 'minutes', label: 'AI minutes', color: chartColors.brand }]} />
          </ChartFrame>
        )}
        {aiUsage.loading ? <SkeletonChart /> : (
          <ChartFrame title="Usage by business" description="Top consumers by AI minutes">
            <ColumnChart data={byBusiness} series={[{ key: 'minutes', label: 'AI minutes', color: chartColors.brandLight }]} />
          </ChartFrame>
        )}
      </div>

      <Card className="mt-4">
        <CardHeader title="Consumption detail" description="Per-business AI minutes, conversations and estimated cost." />
        <CardBody className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[38rem] text-left">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/60">
                  {['Business', 'AI minutes', 'Conversations', 'Channels', 'Estimated cost'].map((h) => (
                    <th key={h} className="px-5 py-2.5 text-[0.66rem] font-bold uppercase tracking-wider text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(aiUsage.data || []).map((row) => (
                  <tr key={row.businessId}>
                    <td className="px-5 py-3 text-[0.83rem] font-semibold text-ink-900">
                      <Link to={`/businesses/${row.businessId}`} className="hover:text-brand-600">{row.business}</Link>
                    </td>
                    <td className="px-5 py-3 text-[0.83rem] text-slate-600">{formatNumber(row.minutes)}</td>
                    <td className="px-5 py-3 text-[0.83rem] text-slate-600">{formatNumber(row.conversations)}</td>
                    <td className="px-5 py-3 text-[0.83rem] text-slate-600">{row.channels}</td>
                    <td className="px-5 py-3 text-[0.83rem] text-slate-600">{formatCurrency(row.estimatedCost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </>
  )
}
