import { cn } from '../../lib/utils'

export default function Skeleton({ className = '', ...props }) {
  return <div className={cn('animate-pulse rounded-lg bg-slate-200/70', className)} {...props} />
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={cn('rounded-2xl border border-line bg-surface p-5', className)}>
      <Skeleton className="h-8 w-8 rounded-xl" />
      <Skeleton className="mt-4 h-3 w-24" />
      <Skeleton className="mt-3 h-6 w-20" />
    </div>
  )
}

export function SkeletonStats({ count = 4, className = '' }) {
  return (
    <div className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export function SkeletonTable({ rows = 8, cols = 5, className = '' }) {
  return (
    <div className={cn('overflow-hidden rounded-2xl border border-line bg-surface', className)}>
      <div className="border-b border-slate-200/80 bg-slate-50/60 px-5 py-3">
        <Skeleton className="h-3 w-32" />
      </div>
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-4 px-5 py-4">
            <Skeleton className="h-8 w-8 shrink-0 rounded-lg" />
            {Array.from({ length: cols - 1 }).map((__, c) => (
              <Skeleton key={c} className={cn('h-3', c === 0 ? 'w-40' : 'hidden w-24 sm:block')} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function SkeletonChart({ className = '' }) {
  return (
    <div className={cn('rounded-2xl border border-line bg-surface p-5', className)}>
      <Skeleton className="h-3 w-28" />
      <div className="mt-6 flex h-40 items-end gap-3">
        {[45, 70, 55, 85, 62, 90, 48].map((h, i) => (
          <Skeleton key={i} className="flex-1" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  )
}

export function SkeletonDetail({ className = '' }) {
  return (
    <div className={cn('space-y-4', className)}>
      <Skeleton className="h-24 w-full rounded-2xl" />
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-48 rounded-2xl lg:col-span-2" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    </div>
  )
}
