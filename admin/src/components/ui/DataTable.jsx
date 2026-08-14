import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react'
import { cn } from '../../lib/utils'
import { SkeletonTable } from './Skeleton'
import { EmptyState, ErrorState } from './States'

/**
 * Admin table: sortable headers, pagination, optional bulk selection, and a
 * stacked-card layout below md so nothing overflows on a phone.
 *
 * columns: [{ key, header, render(row), sortable, className, hideOnMobile, primary }]
 */
export default function DataTable({
  columns,
  table,
  loading,
  error,
  onRetry,
  empty,
  onRowClick,
  selectable = false,
  bulkActions,
  className = '',
}) {
  if (loading) return <SkeletonTable rows={8} cols={Math.min(columns.length, 5)} className={className} />
  if (error) {
    return (
      <div className={cn('rounded-2xl border border-slate-200/80 bg-white', className)}>
        <ErrorState onRetry={onRetry} />
      </div>
    )
  }
  if (!table.rows.length) {
    return (
      <div className={cn('rounded-2xl border border-slate-200/80 bg-white', className)}>
        {empty || <EmptyState title="Nothing to show" description="No records match the current filters." />}
      </div>
    )
  }

  const allSelected = selectable && table.selected.length === table.rows.length

  return (
    <div className={cn('overflow-hidden rounded-2xl border border-slate-200/80 bg-white', className)}>
      {selectable && table.selected.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-200 bg-brand-50/70 px-5 py-3">
          <p className="text-[0.82rem] font-semibold text-brand-900">
            {table.selected.length} selected
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {bulkActions}
            <button
              type="button"
              onClick={() => table.setSelected([])}
              className="text-[0.78rem] font-semibold text-slate-500 hover:text-ink-900"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Desktop */}
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[54rem] border-collapse text-left">
          <thead>
            <tr className="border-b border-slate-200/80 bg-slate-50/60">
              {selectable && (
                <th scope="col" className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={table.toggleAll}
                    aria-label="Select all rows on this page"
                    className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500/40"
                  />
                </th>
              )}
              {columns.map((col) => {
                const active = table.sort?.key === col.key
                return (
                  <th key={col.key} scope="col" className={cn('whitespace-nowrap px-5 py-3 text-[0.68rem] font-bold uppercase tracking-wider text-slate-500', col.className)}>
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => table.toggleSort(col.key)}
                        className="inline-flex items-center gap-1 transition-colors hover:text-ink-900"
                        aria-label={`Sort by ${col.header}`}
                      >
                        {col.header}
                        {active ? (
                          table.sort.direction === 'asc' ? (
                            <ChevronUp className="h-3 w-3" aria-hidden="true" />
                          ) : (
                            <ChevronDown className="h-3 w-3" aria-hidden="true" />
                          )
                        ) : (
                          <ChevronDown className="h-3 w-3 opacity-25" aria-hidden="true" />
                        )}
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {table.rows.map((row) => (
              <tr
                key={row.id}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={cn('transition-colors', onRowClick && 'cursor-pointer hover:bg-slate-50/80')}
              >
                {selectable && (
                  <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={table.selected.includes(row.id)}
                      onChange={() => table.toggleRow(row.id)}
                      aria-label={`Select row ${row.id}`}
                      className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500/40"
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td key={col.key} className={cn('px-5 py-3.5 align-middle text-[0.83rem] text-slate-600', col.className)}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile */}
      <ul className="divide-y divide-slate-100 md:hidden">
        {table.rows.map((row) => {
          const primary = columns.find((c) => c.primary) || columns[0]
          // Skip the actions column (no header) — its menu is not useful in a card.
          const rest = columns.filter((c) => c !== primary && !c.hideOnMobile && c.header)
          return (
            <li key={row.id}>
              <div
                role={onRowClick ? 'button' : undefined}
                tabIndex={onRowClick ? 0 : undefined}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                onKeyDown={onRowClick ? (e) => (e.key === 'Enter' || e.key === ' ') && onRowClick(row) : undefined}
                className={cn('px-4 py-4', onRowClick && 'cursor-pointer active:bg-slate-50')}
              >
                <div className="flex items-start gap-3">
                  {selectable && (
                    <input
                      type="checkbox"
                      checked={table.selected.includes(row.id)}
                      onChange={() => table.toggleRow(row.id)}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Select row ${row.id}`}
                      className="mt-1 h-4 w-4 shrink-0 rounded border-slate-300 text-brand-600 focus:ring-brand-500/40"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-[0.88rem] font-semibold text-ink-900">
                      {primary.render ? primary.render(row) : row[primary.key]}
                    </div>
                    <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
                      {rest.map((col) => (
                        <div key={col.key} className="min-w-0">
                          <dt className="text-[0.62rem] font-semibold uppercase tracking-wider text-slate-400">{col.header || '—'}</dt>
                          <dd className="mt-0.5 truncate text-[0.8rem] text-slate-600">
                            {col.render ? col.render(row) : row[col.key]}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      <Pagination table={table} />
    </div>
  )
}

export function Pagination({ table }) {
  const { page, totalPages, setPage, total, pageSize } = table
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1
  const to = Math.min(page * pageSize, total)

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 bg-slate-50/60 px-5 py-3">
      <p className="text-[0.78rem] text-slate-500">
        Showing <span className="font-semibold text-ink-900">{from}–{to}</span> of{' '}
        <span className="font-semibold text-ink-900">{total}</span>
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:text-ink-900 disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="px-2 text-[0.78rem] font-semibold text-ink-900">
          {page} / {totalPages}
        </span>
        <button
          type="button"
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:text-ink-900 disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
