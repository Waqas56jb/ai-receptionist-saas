import { useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { cn, initials } from '../../lib/utils'
import { useOnClickOutside } from '../../hooks'

/* ---------------------------------------------------------------- Tabs --- */

export function Tabs({ tabs, value, onChange, className = '', size = 'md' }) {
  return (
    <div className={cn('-mx-1 overflow-x-auto px-1 pb-1', className)}>
      <div className="inline-flex min-w-full gap-1 rounded-xl border border-line bg-canvas-soft p-1" role="tablist">
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
                'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-semibold transition-all duration-200',
                size === 'sm' ? 'px-3 py-1.5 text-[0.76rem]' : 'px-3.5 py-2 text-[0.82rem]',
                active ? 'bg-surface text-ink shadow-subtle' : 'text-slate-500 hover:text-ink',
              )}
            >
              {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
              {label}
              {count !== undefined && (
                <span className={cn('rounded-full px-1.5 py-0.5 text-[0.62rem] font-bold', active ? 'bg-brand-50 text-brand-700' : 'bg-slate-200/70 text-slate-500')}>
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

/* ------------------------------------------------------------ Dropdown --- */

export function Dropdown({ trigger, children, align = 'right', width = 'w-56', className = '' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useOnClickOutside(ref, () => setOpen(false), open)

  return (
    <div ref={ref} className={cn('relative', className)}>
      {trigger({ open, toggle: () => setOpen((v) => !v), close: () => setOpen(false) })}
      <AnimatePresence>
        {open && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setOpen(false)}
            className={cn(
              'absolute z-50 mt-2 overflow-hidden rounded-xl border border-line bg-surface p-1.5 shadow-lift',
              align === 'right' ? 'right-0' : 'left-0',
              width,
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function DropdownItem({ icon: Icon, children, onClick, as: Tag = 'button', tone = 'default', disabled, ...props }) {
  return (
    <Tag
      type={Tag === 'button' ? 'button' : undefined}
      onClick={onClick}
      disabled={Tag === 'button' ? disabled : undefined}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[0.82rem] font-medium transition-colors disabled:opacity-40',
        tone === 'danger' ? 'text-rose-600 hover:bg-rose-50' : 'text-slate-700 hover:bg-slate-100 hover:text-ink-900',
      )}
      {...props}
    >
      {Icon && <Icon className="h-4 w-4 shrink-0 opacity-70" aria-hidden="true" />}
      <span className="min-w-0 flex-1 truncate">{children}</span>
    </Tag>
  )
}

export function DropdownDivider() {
  return <div className="my-1.5 h-px bg-slate-100" />
}

export function DropdownLabel({ children }) {
  return <p className="px-3 py-1.5 text-[0.66rem] font-bold uppercase tracking-wider text-slate-400">{children}</p>
}

/* -------------------------------------------------------------- Toggle --- */

export function Toggle({ checked, onChange, label, description, disabled, size = 'md', className = '', id }) {
  const autoId = useId()
  const toggleId = id || autoId
  const dims = size === 'sm' ? { track: 'h-5 w-9', knob: 'h-3.5 w-3.5', shift: 'translate-x-4' } : { track: 'h-6 w-11', knob: 'h-4 w-4', shift: 'translate-x-5' }

  const control = (
    <button
      type="button"
      id={toggleId}
      role="switch"
      aria-checked={checked}
      aria-label={!label ? 'Toggle' : undefined}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cn('relative inline-flex shrink-0 items-center rounded-full transition-colors duration-200 disabled:opacity-50', dims.track, checked ? 'bg-primary-400' : 'bg-slate-300')}
    >
      <span className={cn('inline-block transform rounded-full bg-white shadow transition-transform duration-200', dims.knob, checked ? dims.shift : 'translate-x-1')} />
    </button>
  )

  if (!label) return <span className={className}>{control}</span>

  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <div className="min-w-0">
        <label htmlFor={toggleId} className="block cursor-pointer text-[0.83rem] font-semibold text-ink-900">
          {label}
        </label>
        {description && <p className="mt-0.5 text-[0.78rem] leading-relaxed text-slate-500">{description}</p>}
      </div>
      {control}
    </div>
  )
}

/* -------------------------------------------------------------- Avatar --- */

const avatarSizes = { xs: 'h-7 w-7 text-[0.6rem]', sm: 'h-8 w-8 text-[0.66rem]', md: 'h-10 w-10 text-[0.76rem]', lg: 'h-14 w-14 text-base' }

export function Avatar({ name = '', size = 'md', tone = 'brand', className = '' }) {
  return (
    <span
      className={cn(
        'inline-grid shrink-0 place-items-center rounded-full font-display font-bold',
        avatarSizes[size],
        tone === 'brand' ? 'bg-gradient-to-br from-brand-400 to-brand-600 text-white' : 'bg-slate-100 text-slate-500',
        className,
      )}
      aria-hidden="true"
    >
      {initials(name) || '?'}
    </span>
  )
}

/* ------------------------------------------------------------ StatCard --- */

export function StatCard({ label, value, delta, deltaTone = 'up', icon: Icon, hint, className = '' }) {
  const positive = deltaTone === 'up'
  return (
    <div className={cn('rounded-2xl border border-line bg-surface p-5 transition-shadow duration-300 hover:shadow-card', className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[0.7rem] font-bold uppercase tracking-wider text-slate-500">{label}</p>
        {Icon && (
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600">
            <Icon className="h-4 w-4" aria-hidden="true" />
          </span>
        )}
      </div>
      <div className="mt-3 flex flex-wrap items-baseline gap-2">
        <span className="font-display text-[1.55rem] font-bold tabular-nums leading-none text-ink-900">{value}</span>
        {delta && (
          <span className={cn('inline-flex items-center text-[0.72rem] font-semibold', positive ? 'text-emerald-600' : 'text-rose-600')}>
            {positive ? <ArrowUpRight className="h-3 w-3" aria-hidden="true" /> : <ArrowDownRight className="h-3 w-3" aria-hidden="true" />}
            {delta}
          </span>
        )}
      </div>
      {hint && <p className="mt-2 text-[0.74rem] text-slate-500">{hint}</p>}
    </div>
  )
}

/* --------------------------------------------------------- ProgressBar --- */

export function ProgressBar({ value, max = 100, label, hint, showValue = true, className = '' }) {
  const pct = max ? Math.min(100, Math.round((value / max) * 100)) : 0
  const tone = pct >= 90 ? 'bg-rose-500' : pct >= 75 ? 'bg-amber-500' : 'bg-brand-600'

  return (
    <div className={className}>
      {(label || showValue) && (
        <div className="mb-2 flex items-baseline justify-between gap-3">
          {label && <span className="text-[0.8rem] font-semibold text-ink-900">{label}</span>}
          {showValue && <span className="text-[0.76rem] tabular-nums text-slate-500">{value} / {max}</span>}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <div className={cn('h-full rounded-full transition-[width] duration-700', tone)} style={{ width: `${pct}%` }} />
      </div>
      {hint && <p className="mt-2 text-[0.74rem] text-slate-500">{hint}</p>}
    </div>
  )
}

/* ------------------------------------------------------ MaskedCredential --- */

/** Credentials are never shown in full anywhere in the console. */
export function MaskedCredential({ value, className = '' }) {
  return (
    <span className={cn('inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[0.75rem] tracking-wider text-slate-600', className)}>
      {value || '—'}
    </span>
  )
}
