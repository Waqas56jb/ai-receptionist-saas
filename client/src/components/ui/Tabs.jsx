import cn from '../../lib/cn'

/**
 * Horizontal tab strip. Scrolls sideways inside its own container on narrow
 * screens rather than pushing the page wide.
 */
export default function Tabs({ tabs, value, onChange, className = '', size = 'md' }) {
  return (
    <div className={cn('-mx-1 overflow-x-auto px-1 pb-1', className)}>
      <div className="inline-flex min-w-full gap-1 rounded-xl border border-slate-200/80 bg-slate-50/80 p-1" role="tablist">
        {tabs.map((tab) => {
          const id = typeof tab === 'string' ? tab : tab.id
          const label = typeof tab === 'string' ? tab : tab.label
          const count = typeof tab === 'string' ? undefined : tab.count
          const Icon = typeof tab === 'string' ? undefined : tab.icon
          const active = value === id
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(id)}
              className={cn(
                'inline-flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-all duration-200',
                size === 'sm' ? 'px-3 py-1.5 text-[0.78rem]' : 'px-3.5 py-2 text-[0.83rem]',
                active ? 'bg-white text-ink-900 shadow-subtle' : 'text-slate-500 hover:text-ink-900',
              )}
            >
              {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
              {label}
              {count !== undefined && (
                <span
                  className={cn(
                    'rounded-full px-1.5 py-0.5 text-[0.65rem] font-bold',
                    active ? 'bg-brand-50 text-brand-700' : 'bg-slate-200/70 text-slate-500',
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/** Compact pill filters used above tables and lists. */
export function FilterPills({ options, value, onChange, className = '' }) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {options.map((opt) => {
        const id = typeof opt === 'string' ? opt : opt.id
        const label = typeof opt === 'string' ? opt : opt.label
        const count = typeof opt === 'string' ? undefined : opt.count
        const active = value === id
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            aria-pressed={active}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[0.78rem] font-semibold transition-colors',
              active
                ? 'border-brand-300 bg-brand-50 text-brand-700'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-ink-900',
            )}
          >
            {label}
            {count !== undefined && <span className="text-[0.7rem] opacity-70">{count}</span>}
          </button>
        )
      })}
    </div>
  )
}
