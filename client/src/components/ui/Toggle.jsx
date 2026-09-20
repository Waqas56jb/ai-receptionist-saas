import { useId } from 'react'
import cn from '../../lib/cn'

export default function Toggle({ checked, onChange, label, description, disabled, size = 'md', className = '', id }) {
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
      className={cn(
        'relative inline-flex shrink-0 items-center rounded-full transition-colors duration-200 disabled:opacity-50',
        dims.track,
        checked ? 'bg-primary-400' : 'bg-slate-300',
      )}
    >
      <span
        className={cn(
          'inline-block transform rounded-full bg-white shadow transition-transform duration-200',
          dims.knob,
          checked ? dims.shift : 'translate-x-1',
        )}
      />
    </button>
  )

  if (!label) return <span className={className}>{control}</span>

  return (
    <div className={cn('flex items-start justify-between gap-4', className)}>
      <div className="min-w-0">
        <label htmlFor={toggleId} className="block cursor-pointer text-[0.85rem] font-semibold text-ink-900">
          {label}
        </label>
        {description && <p className="mt-0.5 text-[0.8rem] leading-relaxed text-slate-500">{description}</p>}
      </div>
      {control}
    </div>
  )
}
