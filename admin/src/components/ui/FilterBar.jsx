import { Download, Search, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import Button from './Button'
import { Input, Select } from './Field'

/**
 * Search + dropdown filters with removable chips for whatever is active.
 * `filters`: [{ key, label, options: string[] }]
 */
export default function FilterBar({ table, filters = [], searchPlaceholder = 'Search…', onExport, actions, className = '' }) {
  return (
    <div className={cn('mb-4 space-y-3', className)}>
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[14rem] flex-1">
          <Input
            icon={Search}
            type="search"
            value={table.query}
            onChange={(e) => table.setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
          />
        </div>

        {filters.map((filter) => (
          <div key={filter.key} className="w-[10.5rem]">
            <Select
              value={table.filters[filter.key] || 'All'}
              onChange={(e) => table.setFilter(filter.key, e.target.value)}
              aria-label={filter.label}
              options={['All', ...filter.options].map((o) => ({
                value: o,
                label: o === 'All' ? `All ${filter.allLabel || filter.label.toLowerCase()}` : o,
              }))}
            />
          </div>
        ))}

        <div className="flex flex-wrap items-center gap-2">
          {actions}
          {onExport && (
            <Button variant="outline" size="md" onClick={onExport}>
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              Export CSV
            </Button>
          )}
        </div>
      </div>

      {(table.activeFilters.length > 0 || table.query) && (
        <div className="flex flex-wrap items-center gap-2">
          {table.query && (
            <Chip label={`Search: ${table.query}`} onRemove={() => table.setQuery('')} />
          )}
          {table.activeFilters.map(([key, value]) => (
            <Chip key={key} label={`${filters.find((f) => f.key === key)?.label || key}: ${value}`} onRemove={() => table.setFilter(key, 'All')} />
          ))}
          <button
            type="button"
            onClick={table.clearFilters}
            className="text-[0.76rem] font-semibold text-brand-600 underline-offset-4 hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  )
}

function Chip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2.5 py-1 text-[0.75rem] font-medium text-muted">
      {label}
      <button type="button" onClick={onRemove} className="text-slate-400 transition-colors hover:text-rose-600" aria-label={`Remove ${label}`}>
        <X className="h-3 w-3" />
      </button>
    </span>
  )
}
