import { useId, useState } from 'react'
import { Eye, EyeOff, ChevronDown } from 'lucide-react'
import cn from '../../lib/cn'
import { emailError, isValidEmail } from '../../lib/email'

const controlBase =
  'w-full rounded-xl border bg-surface text-[0.9rem] text-ink placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-400/30 disabled:bg-canvas-soft disabled:text-slate-400'

const controlState = (error) =>
  error
    ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-500/25'
    : 'border-line hover:border-line-strong focus:border-primary-400'

export function Label({ htmlFor, children, required, hint }) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-3">
      <label htmlFor={htmlFor} className="text-[0.8rem] font-semibold text-ink">
        {children}
        {required && <span className="ml-0.5 text-rose-500">*</span>}
      </label>
      {hint && <span className="text-[0.7rem] text-slate-400">{hint}</span>}
    </div>
  )
}

export function FieldError({ children, id }) {
  if (!children) return null
  return (
    <p id={id} className="mt-1.5 text-[0.75rem] font-medium text-rose-600">
      {children}
    </p>
  )
}

export function FieldHelp({ children }) {
  if (!children) return null
  return <p className="mt-1.5 text-[0.75rem] leading-relaxed text-slate-500">{children}</p>
}

export function Input({
  label,
  error,
  help,
  required,
  hint,
  icon: Icon,
  type = 'text',
  className = '',
  id,
  onChange,
  onBlur,
  ...props
}) {
  const autoId = useId()
  const inputId = id || autoId
  const [reveal, setReveal] = useState(false)
  const [emailHint, setEmailHint] = useState('')
  const isPassword = type === 'password'
  const isEmail = type === 'email'
  const resolvedType = isPassword && reveal ? 'text' : type
  const shownError = error || emailHint
  const liveValue = props.value ?? props.defaultValue ?? ''
  const emailOk = isEmail && !shownError && isValidEmail(liveValue)

  return (
    <div className={className}>
      {label && (
        <Label htmlFor={inputId} required={required} hint={hint}>
          {label}
        </Label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        )}
        <input
          id={inputId}
          type={resolvedType}
          aria-invalid={Boolean(shownError) || undefined}
          aria-describedby={shownError ? `${inputId}-error` : undefined}
          className={cn(
            controlBase,
            controlState(shownError),
            emailOk && 'border-emerald-400 focus:border-emerald-400 focus:ring-emerald-500/20',
            'h-11 px-3.5',
            Icon && 'pl-10',
            isPassword && 'pr-11',
          )}
          onChange={(e) => {
            if (isEmail) {
              const value = e.target.value
              setEmailHint(value.trim() ? emailError(value) : '')
            }
            onChange?.(e)
          }}
          onBlur={(e) => {
            if (isEmail) setEmailHint(emailError(e.target.value) || (required && !String(e.target.value).trim() ? 'Enter your email address.' : ''))
            onBlur?.(e)
          }}
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
      {shownError ? (
        <FieldError id={`${inputId}-error`}>{shownError}</FieldError>
      ) : emailOk ? (
        <FieldHelp>This email looks valid.</FieldHelp>
      ) : (
        <FieldHelp>{help}</FieldHelp>
      )}
    </div>
  )
}

export function Textarea({ label, error, help, required, hint, rows = 4, className = '', id, ...props }) {
  const autoId = useId()
  const areaId = id || autoId
  return (
    <div className={className}>
      {label && (
        <Label htmlFor={areaId} required={required} hint={hint}>
          {label}
        </Label>
      )}
      <textarea
        id={areaId}
        rows={rows}
        aria-invalid={Boolean(error) || undefined}
        className={cn(controlBase, controlState(error), 'resize-y px-3.5 py-3 leading-relaxed')}
        {...props}
      />
      {error ? <FieldError>{error}</FieldError> : <FieldHelp>{help}</FieldHelp>}
    </div>
  )
}

export function Select({ label, error, help, required, hint, options = [], className = '', id, children, ...props }) {
  const autoId = useId()
  const selectId = id || autoId
  return (
    <div className={className}>
      {label && (
        <Label htmlFor={selectId} required={required} hint={hint}>
          {label}
        </Label>
      )}
      <div className="relative">
        <select
          id={selectId}
          aria-invalid={Boolean(error) || undefined}
          className={cn(controlBase, controlState(error), 'h-11 appearance-none px-3.5 pr-10')}
          {...props}
        >
          {children ||
            options.map((opt) => {
              const value = typeof opt === 'string' ? opt : opt.value
              const labelText = typeof opt === 'string' ? opt : opt.label
              return (
                <option key={value} value={value}>
                  {labelText}
                </option>
              )
            })}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
      </div>
      {error ? <FieldError>{error}</FieldError> : <FieldHelp>{help}</FieldHelp>}
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
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-primary-400 focus:ring-brand-500/40"
        {...props}
      />
      <div className="min-w-0">
        <label htmlFor={boxId} className="block text-[0.85rem] font-medium text-ink-900">
          {label}
        </label>
        {description && <p className="mt-0.5 text-[0.78rem] leading-relaxed text-slate-500">{description}</p>}
      </div>
    </div>
  )
}

/** Large selectable card used for radio-style choices across the portal. */
export function RadioCard({ checked, onChange, title, description, icon: Icon, name, value, className = '' }) {
  return (
    <label
      className={cn(
        'flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all duration-200',
        checked
          ? 'border-primary-400 bg-primary-500/10 ring-1 ring-primary-400/40'
          : 'border-line bg-surface hover:border-line-strong hover:bg-surface-2',
        className,
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="mt-0.5 h-4 w-4 shrink-0 border-slate-300 text-primary-400 focus:ring-brand-500/40"
      />
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {Icon && <Icon className={cn('h-4 w-4', checked ? 'text-primary-400' : 'text-slate-400')} aria-hidden="true" />}
          <span className="text-[0.875rem] font-semibold text-ink-900">{title}</span>
        </div>
        {description && <p className="mt-1 text-[0.8rem] leading-relaxed text-slate-500">{description}</p>}
      </div>
    </label>
  )
}
