import { AlertTriangle, RotateCw } from 'lucide-react'
import cn from '../../lib/cn'
import Button from './Button'

export function EmptyState({ icon: Icon, title, description, action, secondaryAction, className = '', compact = false }) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 text-center', compact ? 'py-10' : 'py-16', className)}>
      {Icon && (
        <span className="grid h-12 w-12 place-items-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-400">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      )}
      <h3 className="mt-4 font-display text-base font-semibold text-ink-900">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-[0.875rem] leading-relaxed text-slate-500">{description}</p>}
      {(action || secondaryAction) && (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  )
}

export function ErrorState({ onRetry, title = 'Something went wrong.', description = 'Please try again in a moment.', className = '' }) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-14 text-center', className)}>
      <span className="grid h-12 w-12 place-items-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-500">
        <AlertTriangle className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="mt-4 font-display text-base font-semibold text-ink-900">{title}</h3>
      <p className="mt-2 max-w-sm text-[0.875rem] leading-relaxed text-slate-500">{description}</p>
      {onRetry && (
        <Button as="button" variant="secondary" size="sm" className="mt-6" onClick={onRetry}>
          <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
          Retry
        </Button>
      )}
    </div>
  )
}

export default EmptyState
