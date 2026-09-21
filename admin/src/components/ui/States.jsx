import { AlertTriangle, RotateCw, ShieldAlert } from 'lucide-react'
import { cn } from '../../lib/utils'
import Button from './Button'

export function EmptyState({ icon: Icon, title, description, action, className = '', compact = false }) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 text-center', compact ? 'py-10' : 'py-16', className)}>
      {Icon && (
        <span className="grid h-12 w-12 place-items-center rounded-2xl border border-line bg-surface-2 text-muted">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      )}
      <h3 className="mt-4 font-display text-base font-semibold text-ink-900">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-[0.85rem] leading-relaxed text-slate-500">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}

export function ErrorState({ onRetry, title = 'Something went wrong.', description = 'We could not load this data. Please try again.', className = '', error }) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-14 text-center', className)}>
      <span className="grid h-12 w-12 place-items-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-500">
        <AlertTriangle className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="mt-4 font-display text-base font-semibold text-ink-900">{title}</h3>
      <p className="mt-2 max-w-sm text-[0.85rem] leading-relaxed text-slate-500">
        {error?.status === 401 ? 'Your admin session expired. Sign in again, then retry.' : error?.message || description}
      </p>
      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-6" onClick={onRetry}>
          <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
          Retry
        </Button>
      )}
    </div>
  )
}

/** Shown when the signed-in role does not hold the required permission. */
export function NoPermission({ permission, className = '' }) {
  return (
    <div className={cn('flex flex-col items-center justify-center rounded-2xl border border-line bg-surface px-6 py-16 text-center', className)}>
      <span className="grid h-12 w-12 place-items-center rounded-2xl border border-amber-200 bg-amber-50 text-amber-600">
        <ShieldAlert className="h-5 w-5" aria-hidden="true" />
      </span>
      <h3 className="mt-4 font-display text-base font-semibold text-ink-900">You do not have access to this area</h3>
      <p className="mt-2 max-w-md text-[0.85rem] leading-relaxed text-slate-500">
        Your role is missing the {permission ? <span className="font-mono text-[0.8rem] text-ink-900">{permission}</span> : 'required'} permission.
        Ask a Super Admin if you need it.
      </p>
    </div>
  )
}

export default EmptyState
