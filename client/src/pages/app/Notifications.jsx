import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  Bell,
  BellOff,
  CalendarDays,
  CheckCheck,
  Gauge,
  Radio,
  Sparkles,
  Target,
  UserCheck,
} from 'lucide-react'
import cn from '../../lib/cn'
import PageHeader from '../../components/layout/PageHeader'
import { Card } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { EmptyState, ErrorState } from '../../components/ui/States'
import useAsync from '../../hooks/useAsync'
import { useToast } from '../../context/ToastContext'
import notificationService from '../../services/notificationService'
import { timeAgo } from '../../lib/format'

const typeMeta = {
  lead: { icon: Target, tone: 'bg-brand-50 text-brand-600' },
  booking: { icon: CalendarDays, tone: 'bg-emerald-50 text-emerald-600' },
  ai: { icon: Sparkles, tone: 'bg-brand-50 text-brand-600' },
  usage: { icon: Gauge, tone: 'bg-amber-50 text-amber-600' },
  channel: { icon: Radio, tone: 'bg-sky-50 text-sky-600' },
  escalation: { icon: UserCheck, tone: 'bg-amber-50 text-amber-600' },
  error: { icon: AlertTriangle, tone: 'bg-rose-50 text-rose-600' },
}

export default function Notifications() {
  const toast = useToast()
  const notifications = useAsync(() => notificationService.list(), [])

  const rows = notifications.data || []
  const unread = rows.filter((n) => !n.read).length

  if (notifications.error) {
    return (
      <Card>
        <ErrorState onRetry={notifications.reload} />
      </Card>
    )
  }

  return (
    <>
      <PageHeader
        title="Notifications"
        description="Everything that happened while you were away."
        badge={unread > 0 && <Badge tone="brand">{unread} unread</Badge>}
        actions={
          <>
            <Button as={Link} to="/app/settings/notifications" variant="outline" size="sm">
              <BellOff className="h-3.5 w-3.5" aria-hidden="true" />
              Preferences
            </Button>
            <Button
              as="button"
              size="sm"
              disabled={!unread}
              onClick={async () => {
                notifications.setData(await notificationService.markAllRead())
                toast.success('All notifications marked as read.')
              }}
            >
              <CheckCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Mark all read
            </Button>
          </>
        }
      />

      {notifications.loading && <div className="h-72 animate-pulse rounded-2xl bg-slate-100" />}

      {!notifications.loading && !rows.length && (
        <Card>
          <EmptyState icon={Bell} title="No notifications yet" description="Leads, bookings and channel updates will show up here." />
        </Card>
      )}

      {!notifications.loading && rows.length > 0 && (
        <Card className="overflow-hidden">
          <ul className="divide-y divide-slate-100">
            {rows.map((n) => {
              const meta = typeMeta[n.type] || typeMeta.ai
              const Icon = meta.icon
              return (
                <li key={n.id}>
                  <Link
                    to={n.href}
                    onClick={async () => {
                      if (!n.read) notifications.setData(await notificationService.markRead(n.id))
                    }}
                    className={cn('flex items-start gap-3.5 px-5 py-4 transition-colors hover:bg-slate-50', !n.read && 'bg-brand-50/40')}
                  >
                    <span className={cn('grid h-9 w-9 shrink-0 place-items-center rounded-xl', meta.tone)}>
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-[0.88rem] font-semibold text-ink-900">{n.title}</span>
                        {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-brand-500" aria-label="Unread" />}
                      </span>
                      <span className="mt-0.5 block text-[0.82rem] leading-relaxed text-slate-600">{n.body}</span>
                      <span className="mt-1 block text-[0.72rem] text-slate-400">{timeAgo(n.at)}</span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </Card>
      )}
    </>
  )
}
