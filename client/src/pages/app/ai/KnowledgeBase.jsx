import { useMemo, useState } from 'react'
import { Database, Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import PageHeader from '../../../components/layout/PageHeader'
import { Card } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge, { StatusBadge } from '../../../components/ui/Badge'
import Tabs from '../../../components/ui/Tabs'
import Toggle from '../../../components/ui/Toggle'
import DataTable from '../../../components/ui/DataTable'
import Modal, { ConfirmDialog } from '../../../components/ui/Modal'
import { Input, Select, Textarea } from '../../../components/ui/Field'
import { EmptyState } from '../../../components/ui/States'
import useAsync from '../../../hooks/useAsync'
import { useToast } from '../../../context/ToastContext'
import knowledgeService from '../../../services/knowledgeService'
import { knowledgeCategories } from '../../../data/mock/ai'
import { formatDate } from '../../../lib/format'

const emptyDraft = { title: '', category: 'Business Info', body: '', status: 'Active', source: 'Manual' }

export default function KnowledgeBase() {
  const toast = useToast()
  const items = useAsync(() => knowledgeService.listItems(), [])

  const [tab, setTab] = useState('all')
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(null)
  const [draft, setDraft] = useState(emptyDraft)
  const [viewing, setViewing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)

  const rows = items.data || []

  const tabs = useMemo(
    () => [
      { id: 'all', label: 'All knowledge', count: rows.length },
      ...knowledgeCategories.map((c) => ({ id: c, label: c, count: rows.filter((r) => r.category === c).length })),
    ],
    [rows],
  )

  const filtered = rows.filter((row) => {
    const byTab = tab === 'all' || row.category === tab
    const q = query.trim().toLowerCase()
    const bySearch = !q || row.title.toLowerCase().includes(q) || row.body.toLowerCase().includes(q)
    return byTab && bySearch
  })

  const openCreate = () => {
    setDraft(emptyDraft)
    setEditing('new')
  }

  const save = async () => {
    setBusy(true)
    try {
      if (editing === 'new') items.setData(await knowledgeService.createItem(draft))
      else items.setData(await knowledgeService.updateItem(editing, draft))
      setEditing(null)
      toast.success('Knowledge saved.')
    } finally {
      setBusy(false)
    }
  }

  const columns = [
    {
      key: 'title',
      header: 'Title',
      primary: true,
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate font-semibold text-ink-900">{row.title}</p>
          <p className="mt-0.5 line-clamp-1 text-[0.78rem] text-slate-500 md:max-w-md">{row.body}</p>
        </div>
      ),
    },
    { key: 'category', header: 'Category', render: (row) => <Badge tone="neutral" size="sm">{row.category}</Badge> },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} size="sm" /> },
    { key: 'source', header: 'Source', render: (row) => <span className="text-slate-500">{row.source}</span> },
    { key: 'updatedAt', header: 'Last updated', render: (row) => formatDate(row.updatedAt) },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Toggle
            size="sm"
            checked={row.status === 'Active'}
            onChange={async (v) => {
              items.setData(await knowledgeService.updateItem(row.id, { status: v ? 'Active' : 'Disabled' }))
            }}
            className="mr-1"
          />
          <button
            type="button"
            onClick={() => setViewing(row)}
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-ink-900"
            aria-label={`View ${row.title}`}
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setDraft(row)
              setEditing(row.id)
            }}
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-ink-900"
            aria-label={`Edit ${row.title}`}
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDeleting(row)}
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
            aria-label={`Delete ${row.title}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Knowledge Base"
        description="Every fact your AI receptionist can use, in one place."
        actions={
          <Button as="button" size="sm" onClick={openCreate}>
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Add Knowledge
          </Button>
        }
      />

      <Tabs tabs={tabs} value={tab} onChange={setTab} className="mb-4" />

      <div className="mb-4 max-w-sm">
        <Input
          icon={Search}
          type="search"
          placeholder="Search knowledge…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search knowledge"
        />
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        loading={items.loading}
        error={items.error}
        onRetry={items.reload}
        empty={
          <EmptyState
            icon={Database}
            title={query || tab !== 'all' ? 'No matching knowledge' : 'No knowledge yet'}
            description={
              query || tab !== 'all'
                ? 'Try a different search or category.'
                : 'Add your first entry so the AI can answer customers accurately.'
            }
            action={
              <Button as="button" size="sm" onClick={openCreate}>
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                Add Knowledge
              </Button>
            }
          />
        }
        footer={`${filtered.length} of ${rows.length} entries`}
      />

      {/* Create / edit */}
      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'Add knowledge' : 'Edit knowledge'}
        description="Write it the way you would say it to a customer."
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
          <Input label="Title" value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} required />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Category"
              options={knowledgeCategories}
              value={draft.category}
              onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
            />
            <Select
              label="Status"
              options={['Active', 'Draft', 'Disabled']}
              value={draft.status}
              onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))}
            />
          </div>
          <Textarea
            label="Content"
            rows={6}
            value={draft.body}
            onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
            help="The AI answers with this content, so keep it factual and current."
          />
        </div>
      </Modal>

      {/* View */}
      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} title={viewing?.title} size="lg">
        {viewing && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="neutral" size="sm">{viewing.category}</Badge>
              <StatusBadge status={viewing.status} size="sm" />
              <span className="text-[0.75rem] text-slate-500">
                {viewing.source} · updated {formatDate(viewing.updatedAt)}
              </span>
            </div>
            <p className="whitespace-pre-line rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-[0.88rem] leading-relaxed text-slate-700">
              {viewing.body}
            </p>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          items.setData(await knowledgeService.deleteItem(deleting.id))
          setDeleting(null)
          toast.success('Knowledge deleted.')
        }}
        title="Delete this knowledge?"
        description={`“${deleting?.title}” will be removed and the AI will stop using it.`}
        confirmLabel="Delete"
      />
    </>
  )
}
