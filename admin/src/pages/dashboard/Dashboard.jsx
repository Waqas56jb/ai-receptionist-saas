import { Link } from 'react-router-dom'
import {
  Activity, Bot, Building2, CreditCard, Instagram, MessageSquare, MessagesSquare,
  Mic, Phone, TrendingUp, Users, Globe,
} from 'lucide-react'
import { cn, formatCompactCurrency, formatCurrency, formatNumber, formatPercent, timeAgo } from '../../lib/utils'
import PageHeader from '../../components/layout/PageHeader'
import { Card, CardBody, CardHeader } from '../../components/ui/Card'
import Badge from '../../components/ui/Badge'
import { StatCard } from '../../components/ui/Misc'
import { SkeletonChart, SkeletonStats } from '../../components/ui/Skeleton'
import { ErrorState } from '../../components/ui/States'
import { ChartFrame, ColumnChart, DonutChart, TrendChart, chartColors } from '../../components/charts/Charts'
import { useAsync } from '../../hooks'
import { analyticsService } from '../../services/platformService'
import { useAuth } from '../../context/AuthContext'

const healthTone = { Operational: 'success', Warning: 'warning', Down: 'danger' }

const activityIcon = {
  'business.created': Building2,
  'business.suspended': Building2,
  'user.created': Users,
  'subscription.started': CreditCard,
  'subscription.upgraded': TrendingUp,
  'subscription.cancelled': CreditCard,
  'channel.connected': MessageSquare,
  'ai.created': Bot,
}

export default function Dashboard() {
  const { admin } = useAuth()
  const summary = useAsync(() => analyticsService.getSummary(), [])
  const growth = useAsync(() => analyticsService.getGrowth(), [])
  const revenueByPlan = useAsync(() => analyticsService.getRevenueByPlan(), [])
  const channels = useAsync(() => analyticsService.getChannelDistribution(), [])
  const health = useAsync(() => analyticsService.getHealth(), [])
  const activity = useAsync(() => analyticsService.getActivity(), [])

  const s = summary.data

  return (
    <>
      <PageHeader
        title={`Platform overview`}
        description={`Welcome back, ${admin?.name?.split(' ')[0] || 'admin'}. Here is how the platform is performing.`}
        badge={<Badge tone="brand">Live data · demo dataset</Badge>}
      />

      {summary.loading && <SkeletonStats count={4} />}
      {summary.error && (
        <Card>
          <ErrorState onRetry={summary.reload} />
        </Card>
      )}

      {s && (
        <>
          {/* Businesses + users */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total businesses" value={formatNumber(s.businesses.total)} delta={`+${s.businesses.newThisMonth} this month`} icon={Building2} hint={`${s.businesses.active} active · ${s.businesses.trial} on trial`} />
            <StatCard label="Suspended businesses" value={formatNumber(s.businesses.suspended)} delta="needs review" deltaTone="down" icon={Building2} hint={`${s.businesses.pending} pending setup`} />
            <StatCard label="Total users" value={formatNumber(s.users.total)} delta={`+${s.users.newThisMonth} this month`} icon={Users} hint={`${s.users.active} active · ${s.users.invited} invited`} />
            <StatCard label="Blocked / suspended users" value={formatNumber(s.users.blocked + s.users.suspended)} icon={Users} hint="Across all businesses" />
          </div>

          {/* Revenue */}
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="MRR" value={formatCurrency(s.revenue.mrr)} delta={formatPercent(s.revenue.growthPct, 1)} icon={CreditCard} hint="Monthly recurring revenue" />
            <StatCard label="ARR" value={formatCompactCurrency(s.revenue.arr)} icon={TrendingUp} hint="Annualised run rate" />
            <StatCard label="Revenue this month" value={formatCurrency(s.revenue.currentMonth)} delta={formatPercent(s.revenue.growthPct, 1)} icon={CreditCard} hint={`Previous month ${formatCurrency(s.revenue.previousMonth)}`} />
            <StatCard label="Total revenue" value={formatCompactCurrency(s.revenue.totalRevenue)} icon={TrendingUp} hint="Since launch" />
          </div>

          {/* AI + channels */}
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="AI calls" value={formatNumber(s.ai.calls)} icon={Phone} hint={`${formatNumber(s.ai.minutes)} AI minutes`} />
            <StatCard label="Messages" value={formatNumber(s.ai.messages)} icon={MessagesSquare} hint={`${formatNumber(s.ai.conversations)} conversations`} />
            <StatCard label="AI resolution rate" value={formatPercent(s.ai.resolutionRate, 1)} delta="+2.4%" icon={Bot} hint="Resolved without a human" />
            <StatCard label="Connected channels" value={formatNumber(s.channels.voice + s.channels.whatsapp + s.channels.instagram + s.channels.web)} icon={Activity} hint="Across all businesses" />
          </div>

          {/* Channel counts */}
          <Card className="mt-4">
            <CardHeader title="Channel adoption" description="How many businesses use each channel." />
            <CardBody>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { label: 'Voice', value: s.channels.voice, icon: Mic, to: '/voice' },
                  { label: 'WhatsApp', value: s.channels.whatsapp, icon: MessageSquare, to: '/whatsapp' },
                  { label: 'Instagram', value: s.channels.instagram, icon: Instagram, to: '/instagram' },
                  { label: 'Website', value: s.channels.web, icon: Globe, to: '/conversations' },
                ].map((c) => (
                  <Link key={c.label} to={c.to} className="group rounded-xl border border-slate-200 p-4 transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                      <c.icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <p className="mt-3 font-display text-xl font-bold text-ink-900">{c.value}</p>
                    <p className="text-[0.78rem] text-slate-500">{c.label} businesses</p>
                  </Link>
                ))}
              </div>
            </CardBody>
          </Card>
        </>
      )}

      {/* Charts */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        {growth.loading ? (
          <SkeletonChart />
        ) : (
          <ChartFrame title="Business and user growth" description="Cumulative totals per month" height={280}>
            <TrendChart
              data={growth.data || []}
              series={[
                { key: 'businesses', label: 'Businesses', color: chartColors.brand },
                { key: 'users', label: 'Users', color: chartColors.brandLight },
              ]}
            />
          </ChartFrame>
        )}

        {revenueByPlan.loading ? (
          <SkeletonChart />
        ) : (
          <ChartFrame title="Revenue by plan" description="Share of monthly recurring revenue" height={280}>
            <DonutChart data={revenueByPlan.data || []} prefix="€" />
          </ChartFrame>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {growth.loading ? (
          <SkeletonChart />
        ) : (
          <ChartFrame title="Revenue growth" description="Monthly recurring revenue" height={240}>
            <TrendChart data={growth.data || []} series={[{ key: 'revenue', label: 'Revenue', color: chartColors.emerald }]} prefix="€" />
          </ChartFrame>
        )}

        {growth.loading ? (
          <SkeletonChart />
        ) : (
          <ChartFrame title="AI volume" description="Calls, messages and AI minutes" height={240}>
            <ColumnChart
              data={growth.data || []}
              series={[
                { key: 'calls', label: 'Calls', color: chartColors.brand },
                { key: 'messages', label: 'Messages', color: chartColors.brandPale },
              ]}
            />
          </ChartFrame>
        )}
      </div>

      {/* Health + activity */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
        <Card>
          <CardHeader icon={Activity} title="Platform health" description="Live status of every dependency." />
          <CardBody className="p-0">
            {health.loading && <div className="space-y-2 p-5">{[0, 1, 2, 3].map((i) => <div key={i} className="h-10 animate-pulse rounded-lg bg-slate-100" />)}</div>}
            <ul className="divide-y divide-slate-100">
              {(health.data || []).map((h) => (
                <li key={h.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                  <div className="min-w-0">
                    <p className="text-[0.84rem] font-semibold text-ink-900">{h.name}</p>
                    <p className="truncate text-[0.74rem] text-slate-500">{h.detail}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[0.72rem] tabular-nums text-slate-400">{h.uptime}</span>
                    <Badge tone={healthTone[h.status]} size="sm" dot>
                      {h.status}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Recent platform activity"
            description="What changed across the platform, and who changed it."
            action={
              <Link to="/audit-logs" className="text-[0.78rem] font-semibold text-brand-600 underline-offset-4 hover:underline">
                Audit logs
              </Link>
            }
          />
          <CardBody className="p-0">
            {activity.loading && <div className="space-y-2 p-5">{[0, 1, 2, 3, 4].map((i) => <div key={i} className="h-12 animate-pulse rounded-lg bg-slate-100" />)}</div>}
            <ul className="divide-y divide-slate-100">
              {(activity.data || []).map((a) => {
                const Icon = activityIcon[a.type] || Activity
                const danger = a.type.includes('suspended') || a.type.includes('cancelled')
                return (
                  <li key={a.id} className="flex items-start gap-3 px-5 py-3">
                    <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-lg', danger ? 'bg-rose-50 text-rose-600' : 'bg-brand-50 text-brand-600')}>
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.84rem] font-semibold text-ink-900">{a.title}</p>
                      <p className="truncate text-[0.76rem] text-slate-500">{a.subject}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[0.7rem] text-slate-400">{timeAgo(a.at)}</p>
                      <p className="text-[0.68rem] text-slate-400">{a.actor}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          </CardBody>
        </Card>
      </div>
    </>
  )
}
