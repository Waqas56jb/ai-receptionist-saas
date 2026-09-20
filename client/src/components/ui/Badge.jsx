import cn from '../../lib/cn'

const tones = {
  neutral: 'border-line bg-surface-2 text-muted',
  brand: 'border-brand-200 bg-brand-50 text-brand-700',
  success: 'border-emerald-400/25 bg-emerald-400/10 text-emerald-400',
  warning: 'border-amber-400/25 bg-amber-400/10 text-amber-300',
  danger: 'border-rose-400/25 bg-rose-400/10 text-rose-400',
  info: 'border-sky-400/25 bg-sky-400/10 text-sky-300',
  purple: 'border-fuchsia-400/25 bg-fuchsia-400/10 text-fuchsia-300',
  dark: 'border-line bg-ink-900 text-ink',
}

/** Maps the demo domain vocabulary onto a consistent colour language. */
export const statusTone = {
  Active: 'success', Online: 'success', Connected: 'success', Confirmed: 'success', Completed: 'success',
  Indexed: 'success', Paid: 'success', Success: 'success', Converted: 'success', Answered: 'success', Qualified: 'success',
  Processing: 'info', Importing: 'info', Pending: 'warning', Draft: 'warning', Invited: 'warning', Interested: 'info',
  Contacted: 'info', New: 'brand', Open: 'brand',
  Failed: 'danger', Cancelled: 'danger', Missed: 'danger', Lost: 'danger', Blocked: 'danger', Escalated: 'warning',
  Disabled: 'neutral', 'Not Connected': 'neutral', Voicemail: 'neutral', Resolved: 'neutral',
}

export default function Badge({ children, tone = 'neutral', dot = false, className = '', size = 'md' }) {
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

export function StatusBadge({ status, ...props }) {
  return (
    <Badge tone={statusTone[status] || 'neutral'} dot {...props}>
      {status}
    </Badge>
  )
}
