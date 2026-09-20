import { Link } from 'react-router-dom'
import {
  Bot,
  Brain,
  CalendarDays,
  Database,
  Instagram,
  MessageSquare,
  Mic,
  Phone,
  PhoneMissed,
  Radio,
  Send,
  Target,
  MessagesSquare,
  ArrowRight,
} from 'lucide-react'
import PageHeader from '../../components/layout/PageHeader'
import StatCard from '../../components/ui/StatCard'
import Badge from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Avatar from '../../components/ui/Avatar'
import { SkeletonStats, SkeletonChart } from '../../components/ui/Skeleton'
import { ErrorState, EmptyState } from '../../components/ui/States'
import { ChartFrame, TrendChart, DonutChart, chartColors } from '../../components/charts/Charts'
import { formatDuration, formatNumber, greeting, timeAgo } from '../../lib/format'
import { useAuth } from '../../context/AuthContext'
import useAsync from '../../hooks/useAsync'
import analyticsService from '../../services/analyticsService'
import conversationService from '../../services/conversationService'
import crmService from '../../services/crmService'

const channelIcon = { voice: Phone, whatsapp: MessageSquare, instagram: Instagram, web: Radio }

const quickActions = [
  { label: 'Train AI', description: 'Add business knowledge', to: '/app/ai-training', icon: Brain },
  { label: 'Add Knowledge', description: 'FAQs, policies, services', to: '/app/knowledge-base', icon: Database },
  { label: 'Configure Voice', description: 'Number, voice and behaviour', to: '/app/voice-agent', icon: Mic },
  { label: 'Connect WhatsApp', description: 'Meta Business setup', to: '/app/whatsapp-agent', icon: MessageSquare },
  { label: 'Connect Instagram', description: 'Direct message handling', to: '/app/instagram-agent', icon: Instagram },
]

export default function Dashboard() {
  const { business } = useAuth()

  const summary = useAsync(() => analyticsService.getSummary('7d'), [])
  const series = useAsync(() => analyticsService.getTimeseries('7d'), [])
  const breakdowns = useAsync(() => analyticsService.getBreakdowns(), [])
  const conversations = useAsync(() => conversationService.list(), [])
  const leads = useAsync(() => crmService.listLeads(), [])

  const stats = summary.data
  const recent = (conversations.data || []).slice(0, 5)
  const recentLeads = (leads.data || []).slice(0, 4)

  return (
    <>
      <PageHeader
        title={`${greeting()}, ${business?.name || 'there'}`}
        description="Here is how your AI receptionist has been performing over the last seven days."
        badge={
          <Badge tone="success" dot>
            AI Receptionist Online
          </Badge>
        }
        actions={
          <>
            <Button as={Link} to="/app/ai-test" variant="secondary" size="sm">
              <Bot className="h-3.5 w-3.5" aria-hidden="true" />
              Test AI
            </Button>
            <Button as={Link} to="/app/conversations" size="sm">
              <MessagesSquare className="h-3.5 w-3.5" aria-hidden="true" />
              Open inbox
            </Button>
          </>
        }
      />

      {/* Stats */}
      {summary.loading && <SkeletonStats count={4} />}
      {summary.error && (
        <div className="rounded-2xl border border-slate-200/80 bg-white">
          <ErrorState onRetry={summary.reload} />
        </div>
      )}
      {stats && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Calls today" value={formatNumber(34)} delta="+12.4%" icon={Phone} hint={`${formatNumber(stats.calls)} in the last 7 days`} />
          <StatCard label="Messages today" value={formatNumber(47)} delta="+8.1%" icon={Send} hint={`${formatNumber(stats.messages)} in the last 7 days`} />
          <StatCard label="Conversations" value={formatNumber(stats.conversations)} delta="+6.2%" icon={MessagesSquare} hint="Across every channel" />
          <StatCard label="Leads" value={formatNumber(stats.leads)} delta="+21.6%" icon={Target} hint="Captured by the AI" />
          <StatCard label="Bookings" value={formatNumber(stats.bookings)} delta="+9.4%" icon={CalendarDays} hint="Created from conversations" />
          <StatCard label="Missed calls" value={formatNumber(stats.missedCalls)} delta="-32%" deltaTone="down" icon={PhoneMissed} hint="Outside AI coverage" />
          <StatCard label="AI resolution rate" value={`${stats.aiResolution}%`} delta="+3.2%" icon={Bot} hint={`Average call ${formatDuration(stats.avgDuration)}`} />
          <StatCard label="Active channels" value={`${stats.activeChannels} / 4`} icon={Radio} hint="Voice, WhatsApp, Web" />
        </div>
      )}

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        {series.loading ? (
          <SkeletonChart />
        ) : (
          <ChartFrame title="Calls and messages" description="Last 7 days across all channels" height={280}>
            <TrendChart
              data={series.data || []}
              series={[
                { key: 'calls', label: 'Calls', color: chartColors.brand },
                { key: 'messages', label: 'Messages', color: chartColors.brandLight },
              ]}
            />
          </ChartFrame>
        )}

        {breakdowns.loading ? (
          <SkeletonChart />
        ) : (
          <ChartFrame title="Conversations by channel" description="Share of total volume" height={280}>
            <DonutChart data={breakdowns.data?.channels || []} />
          </ChartFrame>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {series.loading ? (
          <SkeletonChart />
        ) : (
          <ChartFrame title="Leads over time" description="New leads captured per day" height={240}>
            <TrendChart data={series.data || []} series={[{ key: 'leads', label: 'Leads', color: chartColors.emerald }]} />
          </ChartFrame>
        )}

        {breakdowns.loading ? (
          <SkeletonChart />
        ) : (
          <ChartFrame title="AI activity" description="Handled by AI vs escalated to your team" height={240}>
            <DonutChart data={breakdowns.data?.handling || []} suffix="%" />
          </ChartFrame>
        )}
      </div>

      {/* Recent activity + leads */}
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 px-5 py-4">
            <h2 className="font-display text-[0.95rem] font-semibold text-ink-900">Recent activity</h2>
            <Link to="/app/conversations" className="text-[0.78rem] font-semibold text-primary-400 underline-offset-4 hover:underline">
              View all
            </Link>
          </div>

          {conversations.loading && (
            <div className="space-y-3 p-5">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          )}

          {!conversations.loading && !recent.length && (
            <EmptyState
              compact
              icon={MessagesSquare}
              title="No conversations yet"
              description="As soon as a customer calls or messages you, it will appear here."
              action={
                <Button as={Link} to="/app/channels" size="sm">
                  Connect Channel
                </Button>
              }
            />
          )}

          <ul className="divide-y divide-slate-100">
            {recent.map((c) => {
              const Icon = channelIcon[c.channel] || MessagesSquare
              return (
                <li key={c.id}>
                  <Link to={`/app/conversations?id=${c.id}`} className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50">
                    <Avatar name={c.customer} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-[0.85rem] font-semibold text-ink-900">{c.customer}</span>
                        <Icon className="h-3 w-3 shrink-0 text-slate-400" aria-hidden="true" />
                      </span>
                      <span className="mt-0.5 block truncate text-[0.78rem] text-slate-500">{c.preview}</span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block text-[0.7rem] text-slate-400">{timeAgo(c.lastMessageAt)}</span>
                      {c.unread && <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-brand-500" aria-label="Unread" />}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 px-5 py-4">
            <h2 className="font-display text-[0.95rem] font-semibold text-ink-900">Recent leads</h2>
            <Link to="/app/leads" className="text-[0.78rem] font-semibold text-primary-400 underline-offset-4 hover:underline">
              View all
            </Link>
          </div>

          {leads.loading && (
            <div className="space-y-3 p-5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-14 animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          )}

          <ul className="divide-y divide-slate-100">
            {recentLeads.map((l) => (
              <li key={l.id} className="flex items-center gap-3 px-5 py-3.5">
                <Avatar name={l.name} size="sm" tone="muted" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[0.85rem] font-semibold text-ink-900">{l.name}</span>
                  <span className="block truncate text-[0.75rem] text-slate-500">{l.note}</span>
                </span>
                <Badge tone={l.status === 'Converted' ? 'success' : l.status === 'Lost' ? 'danger' : 'brand'} size="sm">
                  {l.status}
                </Badge>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quick actions */}
      <div className="mt-4 rounded-2xl border border-slate-200/80 bg-white p-5">
        <h2 className="font-display text-[0.95rem] font-semibold text-ink-900">Quick actions</h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.to}
              className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition-all hover:-translate-y-0.5 hover:border-primary-400/30 hover:shadow-card"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary-500/15 text-primary-400 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                <action.icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-1 text-[0.85rem] font-semibold text-ink-900">
                  {action.label}
                  <ArrowRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                </span>
                <span className="mt-0.5 block text-[0.75rem] leading-relaxed text-slate-500">{action.description}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
