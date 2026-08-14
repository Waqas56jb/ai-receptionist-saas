import { useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import cn from '../../lib/cn'
import Button from '../ui/Button'
import Modal, { ConfirmDialog } from '../ui/Modal'
import { Input, Textarea } from '../ui/Field'
import Toggle from '../ui/Toggle'
import { EmptyState } from '../ui/States'

/**
 * Generic add/edit/delete list used for services, products, policies and
 * booking rules. `fields` describes the editor form.
 */
export default function CrudList({
  items = [],
  fields,
  onCreate,
  onUpdate,
  onDelete,
  onToggle,
  addLabel = 'Add item',
  emptyIcon,
  emptyTitle = 'Nothing added yet',
  emptyDescription = 'Add your first entry so the AI can use it when answering customers.',
  renderMeta,
  titleKey = 'name',
  bodyKey = 'description',
  className = '',
}) {
  const [editing, setEditing] = useState(null)
  const [draft, setDraft] = useState({})
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)

  const openCreate = () => {
    setDraft(Object.fromEntries(fields.map((f) => [f.key, f.defaultValue ?? ''])))
    setEditing('new')
  }

  const openEdit = (item) => {
    setDraft({ ...item })
    setEditing(item.id)
  }

  const save = async () => {
    setBusy(true)
    try {
      if (editing === 'new') await onCreate?.(draft)
      else await onUpdate?.(editing, draft)
      setEditing(null)
    } finally {
      setBusy(false)
    }
  }

  const confirmDelete = async () => {
    setBusy(true)
    try {
      await onDelete?.(deleting.id)
      setDeleting(null)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className={className}>
      <div className="mb-4 flex justify-end">
        <Button as="button" size="sm" variant="secondary" onClick={openCreate}>
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          {addLabel}
        </Button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          compact
          icon={emptyIcon}
          title={emptyTitle}
          description={emptyDescription}
          action={
            <Button as="button" size="sm" onClick={openCreate}>
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              {addLabel}
            </Button>
          }
        />
      ) : (
        <ul className="space-y-2.5">
          {items.map((item) => (
            <li
              key={item.id}
              className={cn(
                'flex flex-wrap items-start justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4',
                item.active === false && 'opacity-60',
              )}
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[0.88rem] font-semibold text-ink-900">{item[titleKey]}</p>
                  {renderMeta?.(item)}
                </div>
                {item[bodyKey] && (
                  <p className="mt-1 text-[0.82rem] leading-relaxed text-slate-500">{item[bodyKey]}</p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-1">
                {onToggle && (
                  <Toggle size="sm" checked={item.active !== false} onChange={(v) => onToggle(item.id, v)} className="mr-2" />
                )}
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-ink-900"
                  aria-label={`Edit ${item[titleKey]}`}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleting(item)}
                  className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                  aria-label={`Delete ${item[titleKey]}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? addLabel : 'Edit entry'}
        footer={
          <>
            <Button as="button" variant="ghost" size="sm" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button as="button" size="sm" loading={busy} onClick={save}>
              Save
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {fields.map((field) =>
            field.type === 'textarea' ? (
              <Textarea
                key={field.key}
                label={field.label}
                rows={field.rows || 3}
                value={draft[field.key] ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, [field.key]: e.target.value }))}
                placeholder={field.placeholder}
              />
            ) : (
              <Input
                key={field.key}
                label={field.label}
                type={field.type || 'text'}
                value={draft[field.key] ?? ''}
                onChange={(e) =>
                  setDraft((d) => ({
                    ...d,
                    [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value,
                  }))
                }
                placeholder={field.placeholder}
              />
            ),
          )}
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        loading={busy}
        title="Delete this entry?"
        description={`“${deleting?.[titleKey]}” will be removed from your business information and the AI will stop using it.`}
        confirmLabel="Delete"
      />
    </div>
  )
}
