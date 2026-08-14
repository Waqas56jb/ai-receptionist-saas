import { cn } from '../../lib/utils'

const tones = {
  neutral: 'border-slate-200 bg-slate-50 text-slate-600',
  brand: 'border-brand-200 bg-brand-50 text-brand-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  warning: 'border-amber-200 bg-amber-50 text-amber-700',
  danger: 'border-rose-200 bg-rose-50 text-rose-700',
  info: 'border-sky-200 bg-sky-50 text-sky-700',
  purple: 'border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700',
  dark: 'border-ink-800 bg-ink-900 text-white',
}

/**
 * Status vocabulary for the whole console. Red is reserved for genuinely
 * dangerous states so it keeps its meaning.
 */
export const statusTone = {
  Active: 'success', Online: 'success', Connected: 'success', Operational: 'success', Successful: 'success',
  Paid: 'success', Resolved: 'success', Success: 'success', Published: 'success', Answered: 'success',
  Trial: 'info', 'In Progress': 'info', Open: 'brand', Pending: 'warning', Invited: 'warning', Waiting: 'warning',
  Scheduled: 'info', Warning: 'warning', 'Past Due': 'warning', Overdue: 'warning', 'Needs setup': 'warning',
  Suspended: 'danger', Blocked: 'danger', Failed: 'danger', Down: 'danger', Cancelled: 'danger', Deleted: 'danger',
  Expired: 'neutral', Closed: 'neutral', Disabled: 'neutral', Paused: 'neutral', Archived: 'neutral',
  Refunded: 'purple', Void: 'neutral', Disconnected: 'neutral', Escalated: 'warning',
  Low: 'neutral', Medium: 'info', High: 'warning', Urgent: 'danger',
}

export default function Badge({ children, tone = 'neutral', dot = false, size = 'md', className = '' }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-semibold',
        size === 'sm' ? 'px-2 py-0.5 text-[0.65rem]' : 'px-2.5 py-1 text-[0.7rem]',
        tones[tone] || tones.neutral,
        className,
      )}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" aria-hidden="true" />}
      {children}
    </span>
  )
}

export function StatusBadge({ status, size = 'sm', dot = true, className = '' }) {
  if (!status) return <span className="text-slate-400">—</span>
  return (
    <Badge tone={statusTone[status] || 'neutral'} size={size} dot={dot} className={className}>
      {status}
    </Badge>
  )
}
