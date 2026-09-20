import { Clock } from 'lucide-react'
import cn from '../../lib/cn'
import Toggle from '../ui/Toggle'

/** Weekly opening-hours grid, shared by onboarding and business settings. */
export default function BusinessHoursEditor({ hours, onChange, className = '' }) {
  const update = (index, patch) => {
    onChange(hours.map((row, i) => (i === index ? { ...row, ...patch } : row)))
  }

  return (
    <div className={cn('space-y-2', className)}>
      {hours.map((row, index) => (
        <div
          key={row.day}
          className={cn(
            'flex flex-wrap items-center gap-3 rounded-xl border p-3.5 transition-colors sm:flex-nowrap',
            row.open ? 'border-slate-200 bg-white' : 'border-slate-200 bg-slate-50/70',
          )}
        >
          <div className="flex w-full items-center justify-between gap-3 sm:w-40 sm:justify-start">
            <span className="text-[0.85rem] font-semibold text-ink-900">{row.day}</span>
            <Toggle
              size="sm"
              checked={row.open}
              onChange={(v) => update(index, { open: v })}
              className="sm:ml-auto"
            />
          </div>

          {row.open ? (
            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:flex-1">
              {row.allDay ? (
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-primary-400/30 bg-primary-500/15 px-3 py-1.5 text-[0.78rem] font-semibold text-primary-400">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  Open 24 hours
                </span>
              ) : (
                <>
                  <label className="sr-only" htmlFor={`from-${row.day}`}>
                    {row.day} opening time
                  </label>
                  <input
                    id={`from-${row.day}`}
                    type="time"
                    value={row.from}
                    onChange={(e) => update(index, { from: e.target.value })}
                    className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-[0.82rem] text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25"
                  />
                  <span className="text-[0.8rem] text-slate-400">to</span>
                  <label className="sr-only" htmlFor={`to-${row.day}`}>
                    {row.day} closing time
                  </label>
                  <input
                    id={`to-${row.day}`}
                    type="time"
                    value={row.to}
                    onChange={(e) => update(index, { to: e.target.value })}
                    className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-[0.82rem] text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25"
                  />
                </>
              )}

              <button
                type="button"
                onClick={() => update(index, { allDay: !row.allDay })}
                className="ml-auto rounded-lg px-2.5 py-1.5 text-[0.75rem] font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-ink-900"
              >
                {row.allDay ? 'Set specific hours' : 'Open 24 hours'}
              </button>
            </div>
          ) : (
            <span className="text-[0.82rem] font-medium text-slate-400">Closed</span>
          )}
        </div>
      ))}
    </div>
  )
}
