import { Link } from 'react-router-dom'
import {
  Bot,
  Brain,
  Database,
  Globe,
  MessageSquare,
  Radio,
  Send,
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
import { formatNumber, greeting, timeAgo } from '../../lib/format'
import { useAuth } from '../../context/AuthContext'
import useAsync from '../../hooks/useAsync'
import analyticsService from '../../services/analyticsService'
import conversationService from '../../services/conversationService'

const channelIcon = { whatsapp: MessageSquare, web: Globe }

const quickActions = [
  { label: 'Train AI', description: 'Add business knowledge', to: '/app/ai-training', icon: Brain },
  { label: 'Add Knowledge', description: 'FAQs, policies, services', to: '/app/knowledge-base', icon: Database },
  { label: 'Connect WhatsApp', description: 'Scan QR and go live', to: '/app/whatsapp-agent', icon: MessageSquare },
  { label: 'Website widget', description: 'Copy embed for your site', to: '/app/website-widget', icon: Globe },
]

export default function Dashboard() {
  const { business } = useAuth()

  const summary = useAsync(() => analyticsService.getSummary('7d'), [])
  const series = useAsync(() => analyticsService.getTimeseries('7d'), [])
  const breakdowns = useAsync(() => analyticsService.getBreakdowns(), [])
  const conversations = useAsync(() => conversationService.list(), [])

  const stats = summary.data
  const recent = (conversations.data || []).slice(0, 5)

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
          <StatCard label="Messages" value={formatNumber(stats.messages)} icon={Send} hint="WhatsApp and website widget" />
          <StatCard label="Conversations" value={formatNumber(stats.conversations)} icon={MessagesSquare} hint="This account only" />
          <StatCard label="WhatsApp chats" value={formatNumber(stats.whatsapp)} icon={MessageSquare} hint="Live WhatsApp threads" />
          <StatCard label="Website chats" value={formatNumber(stats.web)} icon={Globe} hint="Widget voice and text" />
          <StatCard label="Inbound" value={formatNumber(stats.inbound)} icon={Radio} hint="Customer messages" />
          <StatCard label="Replies" value={formatNumber(stats.outbound)} icon={Bot} hint="AI receptionist replies" />
          <StatCard label="Active channels" value={`${stats.activeChannels} / 2`} icon={Radio} hint="WhatsApp and Website" />
        </div>
      )}

      {/* Charts */}
      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        {series.loading ? (
          <SkeletonChart />
        ) : (
          <ChartFrame title="WhatsApp and website" description="Live messages for this account" height={280}>
            <TrendChart
              data={series.data || []}
              series={[
                { key: 'whatsapp', label: 'WhatsApp', color: chartColors.emerald },
                { key: 'web', label: 'Website', color: chartColors.sky },
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
          <ChartFrame title="Inbound messages" description="Customer messages per day" height={240}>
            <TrendChart data={series.data || []} series={[{ key: 'inbound', label: 'Inbound', color: chartColors.emerald }]} />
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
              description="WhatsApp and website widget chats will appear here."
              action={
                <Button as={Link} to="/app/website-widget" size="sm">
                  Add website widget
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
                      {c.unread && <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-ember-500" aria-label="Unread" />}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
          <div className="border-b border-slate-200/80 px-5 py-4">
            <h2 className="font-display text-[0.95rem] font-semibold text-ink-900">Live channels</h2>
          </div>
          <ul className="divide-y divide-slate-100">
            <li>
              <Link to="/app/whatsapp-agent" className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-slate-50">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-500/15 text-primary-400">
                  <MessageSquare className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-[0.85rem] font-semibold text-ink-900">WhatsApp</span>
                  <span className="block text-[0.75rem] text-slate-500">Scan QR and go live</span>
                </span>
              </Link>
            </li>
            <li>
              <Link to="/app/website-widget" className="flex items-center gap-3 px-5 py-4 transition-colors hover:bg-slate-50">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-500/15 text-primary-400">
                  <Globe className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-[0.85rem] font-semibold text-ink-900">Website widget</span>
                  <span className="block text-[0.75rem] text-slate-500">Voice and text on your site</span>
                </span>
              </Link>
            </li>
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
