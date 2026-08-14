import cn from '../../lib/cn'

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
