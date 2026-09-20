import { useId, useState } from 'react'
import { ChevronDown, Eye, EyeOff } from 'lucide-react'
import { cn } from '../../lib/utils'

const controlBase =
  'w-full rounded-xl border bg-surface text-[0.88rem] text-ink placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400/30 disabled:bg-canvas-soft disabled:text-slate-400'

const state = (error) =>
  error
    ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-500/25'
    : 'border-line hover:border-line-strong focus:border-primary-400'

export function Label({ htmlFor, children, required, hint }) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-3">
      <label htmlFor={htmlFor} className="text-[0.78rem] font-semibold text-ink">
        {children}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
      {hint && <span className="text-[0.7rem] text-slate-400">{hint}</span>}
    </div>
  )
}

export function Input({ label, error, help, required, hint, icon: Icon, type = 'text', className = '', id, ...props }) {
  const autoId = useId()
  const inputId = id || autoId
  const [reveal, setReveal] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className={className}>
      {label && (
        <Label htmlFor={inputId} required={required} hint={hint}>
          {label}
        </Label>
      )}
      <div className="relative">
        {Icon && <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />}
        <input
          id={inputId}
          type={isPassword && reveal ? 'text' : type}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={cn(controlBase, state(error), 'h-11 px-3.5', Icon && 'pl-10', isPassword && 'pr-11')}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setReveal((v) => !v)}
            className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-slate-400 transition-colors hover:text-ink-900"
            aria-label={reveal ? 'Hide password' : 'Show password'}
          >
            {reveal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error ? (
        <p id={`${inputId}-error`} className="mt-1.5 text-[0.75rem] font-medium text-rose-600">
          {error}
        </p>
      ) : (
        help && <p className="mt-1.5 text-[0.75rem] leading-relaxed text-slate-500">{help}</p>
      )}
    </div>
  )
}

export function Textarea({ label, error, help, required, rows = 4, className = '', id, ...props }) {
  const autoId = useId()
  const areaId = id || autoId
  return (
    <div className={className}>
      {label && (
        <Label htmlFor={areaId} required={required}>
          {label}
        </Label>
      )}
      <textarea
        id={areaId}
        rows={rows}
        aria-invalid={Boolean(error) || undefined}
        className={cn(controlBase, state(error), 'resize-y px-3.5 py-3 leading-relaxed')}
        {...props}
      />
      {error ? (
        <p className="mt-1.5 text-[0.75rem] font-medium text-rose-600">{error}</p>
      ) : (
        help && <p className="mt-1.5 text-[0.75rem] leading-relaxed text-slate-500">{help}</p>
      )}
    </div>
  )
}

export function Select({ label, error, help, required, options = [], className = '', id, children, ...props }) {
  const autoId = useId()
  const selectId = id || autoId
  return (
    <div className={className}>
      {label && (
        <Label htmlFor={selectId} required={required}>
          {label}
        </Label>
      )}
      <div className="relative">
        <select
          id={selectId}
          aria-invalid={Boolean(error) || undefined}
          className={cn(controlBase, state(error), 'h-11 appearance-none px-3.5 pr-10')}
          {...props}
        >
          {children ||
            options.map((opt) => {
              const value = typeof opt === 'string' ? opt : opt.value
              const text = typeof opt === 'string' ? opt : opt.label
              return (
                <option key={value} value={value}>
                  {text}
                </option>
              )
            })}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
      </div>
      {error ? (
        <p className="mt-1.5 text-[0.75rem] font-medium text-rose-600">{error}</p>
      ) : (
        help && <p className="mt-1.5 text-[0.75rem] leading-relaxed text-slate-500">{help}</p>
      )}
    </div>
  )
}

export function Checkbox({ label, description, className = '', id, ...props }) {
  const autoId = useId()
  const boxId = id || autoId
  return (
    <div className={cn('flex items-start gap-3', className)}>
      <input
        id={boxId}
        type="checkbox"
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-brand-600 focus:ring-brand-500/40"
        {...props}
      />
      <div className="min-w-0">
        <label htmlFor={boxId} className="block text-[0.83rem] font-medium text-ink-900">
          {label}
        </label>
        {description && <p className="mt-0.5 text-[0.76rem] leading-relaxed text-slate-500">{description}</p>}
      </div>
    </div>
  )
}
