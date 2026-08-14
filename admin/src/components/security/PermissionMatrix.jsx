import { ShieldAlert } from 'lucide-react'
import { cn } from '../../lib/utils'
import { permissionGroups } from '../../config/permissions'
import Badge from '../ui/Badge'

/**
 * Every permission as a checkbox, grouped by area. `readOnly` renders the same
 * matrix as a summary on the admin detail page.
 */
export default function PermissionMatrix({ value = [], onChange, readOnly = false, className = '' }) {
  const selected = new Set(value)

  const toggle = (id) => {
    if (readOnly) return
    const next = new Set(selected)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    onChange?.([...next])
  }

  const toggleGroup = (group) => {
    if (readOnly) return
    const ids = group.permissions.map((p) => p.id)
    const allOn = ids.every((id) => selected.has(id))
    const next = new Set(selected)
    ids.forEach((id) => (allOn ? next.delete(id) : next.add(id)))
    onChange?.([...next])
  }

  return (
    <div className={cn('space-y-3', className)}>
      {permissionGroups.map((group) => {
        const ids = group.permissions.map((p) => p.id)
        const on = ids.filter((id) => selected.has(id)).length
        const allOn = on === ids.length

        return (
          <div key={group.id} className="rounded-xl border border-slate-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <h4 className="text-[0.85rem] font-semibold text-ink-900">{group.label}</h4>
                <Badge tone={on === 0 ? 'neutral' : allOn ? 'success' : 'info'} size="sm">
                  {on} / {ids.length}
                </Badge>
              </div>
              {!readOnly && (
                <button
                  type="button"
                  onClick={() => toggleGroup(group)}
                  className="text-[0.75rem] font-semibold text-brand-600 underline-offset-4 hover:underline"
                >
                  {allOn ? 'Clear group' : 'Select all'}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-2 p-4 sm:grid-cols-2">
              {group.permissions.map((p) => {
                const checked = selected.has(p.id)
                return (
                  <label
                    key={p.id}
                    className={cn(
                      'flex items-start gap-2.5 rounded-lg px-2 py-1.5 transition-colors',
                      readOnly ? 'cursor-default' : 'cursor-pointer hover:bg-slate-50',
                      readOnly && !checked && 'opacity-45',
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={readOnly}
                      onChange={() => toggle(p.id)}
                      className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-brand-600 focus:ring-brand-500/40 disabled:opacity-60"
                    />
                    <span className="min-w-0">
                      <span className="flex items-center gap-1.5 text-[0.82rem] font-medium text-ink-900">
                        {p.label}
                        {p.danger && <ShieldAlert className="h-3 w-3 text-amber-500" aria-label="Sensitive permission" />}
                      </span>
                      <span className="block font-mono text-[0.68rem] text-slate-400">{p.id}</span>
                    </span>
                  </label>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
