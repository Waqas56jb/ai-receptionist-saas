import cn from '../../lib/cn'

export default function ProgressBar({ value, max = 100, label, hint, className = '', showValue = true }) {
  const pct = max ? Math.min(100, Math.round((value / max) * 100)) : 0
  const tone = pct >= 90 ? 'bg-rose-500' : pct >= 75 ? 'bg-amber-500' : 'bg-brand-600'

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="mb-2 flex items-baseline justify-between gap-3">
          {label && <span className="text-[0.82rem] font-semibold text-ink-900">{label}</span>}
          {showValue && (
            <span className="text-[0.78rem] tabular-nums text-slate-500">
              {value} / {max}
            </span>
          )}
        </div>
      )}
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-slate-100"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <div className={cn('h-full rounded-full transition-[width] duration-700', tone)} style={{ width: `${pct}%` }} />
      </div>
      {hint && <p className="mt-2 text-[0.75rem] text-slate-500">{hint}</p>}
    </div>
  )
}
