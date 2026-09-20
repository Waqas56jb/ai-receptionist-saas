import cn from '../../lib/cn'
import { SkeletonTable } from './Skeleton'
import { EmptyState, ErrorState } from './States'

/**
 * Table on desktop, stacked cards on mobile — the same `columns` definition
 * drives both, so no page has to hand-roll a responsive variant.
 *
 * columns: [{ key, header, render(row), className, cardLabel, primary, hideOnMobile }]
 */
export default function DataTable({
  columns,
  rows,
  loading,
  error,
  onRetry,
  empty,
  rowKey = (row) => row.id,
  onRowClick,
  className = '',
  footer,
}) {
  if (loading) return <SkeletonTable rows={6} cols={Math.min(columns.length, 5)} className={className} />
  if (error) return <div className={cn('rounded-2xl border border-line bg-surface', className)}><ErrorState onRetry={onRetry} /></div>
  if (!rows?.length) {
    return (
      <div className={cn('rounded-2xl border border-line bg-surface', className)}>
        {empty || <EmptyState title="Nothing here yet" description="Records will appear as soon as there is activity." />}
      </div>
    )
  }

  return (
    <div className={cn('overflow-hidden rounded-2xl border border-line bg-surface', className)}>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[46rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-line bg-canvas-soft/80">
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={cn(
                    'whitespace-nowrap px-5 py-3 text-[0.7rem] font-bold uppercase tracking-wider text-slate-500',
                    col.className,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row) => (
              <tr
                key={rowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn('transition-colors', onRowClick && 'cursor-pointer hover:bg-slate-50/80')}
              >
                {columns.map((col) => (
                  <td key={col.key} className={cn('px-5 py-3.5 align-middle text-[0.85rem] text-slate-600', col.className)}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="divide-y divide-slate-100 md:hidden">
        {rows.map((row) => {
          const primary = columns.find((c) => c.primary) || columns[0]
          const rest = columns.filter((c) => c !== primary && !c.hideOnMobile)
          return (
            <li key={rowKey(row)}>
              <div
                role={onRowClick ? 'button' : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                onKeyDown={onRowClick ? (e) => (e.key === 'Enter' || e.key === ' ') && onRowClick(row) : undefined}
                className={cn('px-4 py-4', onRowClick && 'cursor-pointer active:bg-slate-50')}
              >
                <div className="text-[0.9rem] font-semibold text-ink-900">
                  {primary.render ? primary.render(row) : row[primary.key]}
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                  {rest.map((col) => (
                    <div key={col.key} className="min-w-0">
                      <dt className="text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">
                        {col.cardLabel || col.header}
                      </dt>
                      <dd className="mt-0.5 truncate text-[0.82rem] text-slate-600">
                        {col.render ? col.render(row) : row[col.key]}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </li>
          )
        })}
      </ul>

      {footer && <div className="border-t border-line bg-canvas-soft/80 px-5 py-3 text-[0.78rem] text-slate-500">{footer}</div>}
    </div>
  )
}
