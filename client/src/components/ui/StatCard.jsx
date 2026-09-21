import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import cn from '../../lib/cn'

export default function StatCard({ label, value, delta, deltaTone = 'up', icon: Icon, hint, className = '' }) {
  const positive = deltaTone === 'up'
  return (
    <div className={cn('rounded-2xl border border-line bg-surface p-5 transition-shadow duration-300 hover:shadow-card', className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[0.72rem] font-bold uppercase tracking-wider text-slate-500">{label}</p>
        {Icon && (
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary-500/15 text-primary-400">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
      </div>
      <div className="mt-3 flex flex-wrap items-baseline gap-2">
        <span className="font-display text-[1.6rem] font-bold tabular-nums leading-none text-ink-900">{value}</span>
        {delta && (
          <span
            className={cn(
              'inline-flex items-center text-[0.72rem] font-semibold',
              positive ? 'text-ember-500' : 'text-rose-600',
            )}
          >
            {positive ? <ArrowUpRight className="h-3 w-3" aria-hidden="true" /> : <ArrowDownRight className="h-3 w-3" aria-hidden="true" />}
            {delta}
          </span>
        )}
      </div>
      {hint && <p className="mt-2 text-[0.75rem] text-slate-500">{hint}</p>}
    </div>
  )
}
