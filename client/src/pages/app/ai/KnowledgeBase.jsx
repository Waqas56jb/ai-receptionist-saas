import { useMemo, useRef, useState } from 'react'
import { Check, Database, Eye, FileUp, Pencil, Plus, Search, Trash2, UploadCloud } from 'lucide-react'
import PageHeader from '../../../components/layout/PageHeader'
import { Card, CardBody, CardHeader } from '../../../components/ui/Card'
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
import { businessTypes } from '../../../data/mock/business'
import { formatDate } from '../../../lib/format'
import cn from '../../../lib/cn'

const emptyDraft = { title: '', category: 'Business Info', body: '', status: 'Active', source: 'Manual' }
const ACCEPT = '.pdf,.doc,.docx,.txt,.csv,.md,image/*'
const MAX_FILES = 8

export default function KnowledgeBase() {
  const toast = useToast()
  const fileRef = useRef(null)
  const items = useAsync(() => knowledgeService.listItems(), [])
  const sectors = useAsync(() => knowledgeService.listSectors(), [])

  const [tab, setTab] = useState('all')
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState(null)
  const [draft, setDraft] = useState(emptyDraft)
  const [viewing, setViewing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [uploadSector, setUploadSector] = useState(null)
  const [loadingSector, setLoadingSector] = useState('')

  const rows = items.data || []
  const sectorList = sectors.data?.sectors?.length
    ? sectors.data.sectors
    : businessTypes.map((id) => ({ id, title: id, summary: '', itemCount: 4, loaded: false }))
  const businessType = sectors.data?.businessType || ''

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

  const applyItems = (next) => {
    items.setData(next)
    sectors.reload()
  }

  const save = async () => {
    if (!draft.title.trim() || !draft.body.trim()) {
      toast.error('Title and content are required.')
      return
    }
    setBusy(true)
    try {
      if (editing === 'new') applyItems(await knowledgeService.createItem(draft))
      else applyItems(await knowledgeService.updateItem(editing, draft))
      setEditing(null)
      toast.success('Knowledge saved.')
    } catch (error) {
      toast.error(error.message || 'Could not save knowledge.')
    } finally {
      setBusy(false)
    }
  }

  const handleFiles = async (list) => {
    const files = Array.from(list || []).slice(0, MAX_FILES)
    if (!files.length) return
    setUploading(true)
    try {
      applyItems(
        await knowledgeService.uploadDocuments(files, {
          sector: uploadSector === null ? businessType : uploadSector,
        }),
      )
      toast.success(`${files.length} document${files.length > 1 ? 's' : ''} uploaded. Text is now in the knowledge base.`)
      setTab('Documents')
    } catch (error) {
      toast.error(error.message || 'Upload failed. Use PDF, Word, text or an image under 20 MB.')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const loadPack = async (sector) => {
    setLoadingSector(sector)
    try {
      const result = await knowledgeService.loadSectorPack(sector)
      applyItems(result.items)
      if (result.added) toast.success(`Added ${result.added} ${sector === 'all' ? 'sector' : sector} knowledge entries.`)
      else toast.info('That sector pack is already in your knowledge base.')
    } catch (error) {
      toast.error(error.message || 'Could not add sector knowledge.')
    } finally {
      setLoadingSector('')
    }
  }

  const columns = [
    {
      key: 'title',
      header: 'Title',
      primary: true,
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate font-semibold text-ink-900" data-no-i18n>{row.title}</p>
          <p className="mt-0.5 line-clamp-1 text-[0.78rem] text-slate-500 md:max-w-md" data-no-i18n>{row.body}</p>
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

  const sectorOptions = [
    { value: '', label: 'No sector tag' },
    ...sectorList.map((sector) => ({ value: sector.id, label: sector.id })),
  ]

  return (
    <>
      <PageHeader
        title="Knowledge Base"
        description="Upload PDF, Word and other documents, add sector packs, and the AI will read them. Questions outside this knowledge are answered by ChatGPT."
        actions={
          <Button as="button" size="sm" onClick={openCreate}>
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Add Knowledge
          </Button>
        }
      />

      <div className="mb-5 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <Card>
          <CardHeader
            icon={FileUp}
            title="Upload documents"
            description="PDF, DOC, DOCX, TXT, CSV or images · up to 20 MB each. Extracted text becomes searchable knowledge."
          />
          <CardBody>
            <div className="mb-4 max-w-sm">
              <Select
                label="Tag upload with sector"
                options={sectorOptions}
                value={uploadSector === null ? businessType || '' : uploadSector}
                onChange={(e) => setUploadSector(e.target.value)}
                help={businessType ? `Your business type is ${businessType}.` : 'Optional — helps the AI know which sector the file belongs to.'}
              />
            </div>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept={ACCEPT}
              onChange={(e) => handleFiles(e.target.files)}
              className="sr-only"
              aria-label="Upload knowledge documents"
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileRef.current?.click()}
              onDragEnter={(e) => {
                e.preventDefault()
                setDragging(true)
              }}
              onDragOver={(e) => {
                e.preventDefault()
                setDragging(true)
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragging(false)
                handleFiles(e.dataTransfer.files)
              }}
              className={cn(
                'flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors',
                dragging ? 'border-[#FF7A00] bg-[#FF7A00]/10' : 'border-slate-200 bg-slate-50/60 hover:border-[#0066FF]/50 hover:bg-[#0066FF]/10',
                uploading && 'pointer-events-none opacity-70',
              )}
            >
              <UploadCloud className="h-6 w-6 text-[#0066FF]" aria-hidden="true" />
              <span className="mt-3 text-[0.88rem] font-semibold text-ink-900">
                {uploading ? 'Uploading and extracting text…' : 'Drop files here or click to upload'}
              </span>
              <span className="mt-1 text-[0.78rem] text-slate-500">PDF, DOC, DOCX, TXT, CSV or images · max {MAX_FILES} files</span>
            </button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            icon={Database}
            title="Business sector packs"
            description="Add ready receptionist facts for any of the 20 sectors — FAQs, services and policies."
            action={
              <Button as="button" size="sm" variant="secondary" loading={loadingSector === 'all'} onClick={() => loadPack('all')}>
                Add all 20
              </Button>
            }
          />
          <CardBody className="max-h-[22rem] overflow-y-auto">
            <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {sectorList.map((sector) => {
                const mine = sector.id === businessType
                const busyPack = loadingSector === sector.id
                return (
                  <li key={sector.id}>
                    <div
                      className={cn(
                        'flex items-start justify-between gap-2 rounded-xl border px-3 py-2.5',
                        mine ? 'border-[#0066FF]/40 bg-[#0066FF]/10' : 'border-slate-200 bg-surface',
                      )}
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[0.82rem] font-semibold text-ink-900">
                          {sector.title}
                          {mine ? <span className="ml-1.5 text-[0.68rem] font-medium text-[#3D82FF]">Your type</span> : null}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-[0.72rem] leading-snug text-slate-500">{sector.summary}</p>
                      </div>
                      {sector.loaded ? (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[#FF7A00]/15 px-2 py-1 text-[0.68rem] font-semibold text-[#FF7A00]">
                          <Check className="h-3 w-3" aria-hidden="true" />
                          Added
                        </span>
                      ) : (
                        <Button as="button" size="xs" variant="secondary" loading={busyPack} onClick={() => loadPack(sector.id)}>
                          Add
                        </Button>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          </CardBody>
        </Card>
      </div>

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
                : 'Upload a PDF or Word file, or add a sector pack so the AI can answer customers accurately.'
            }
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <Button as="button" size="sm" variant="secondary" onClick={() => fileRef.current?.click()}>
                  <UploadCloud className="h-3.5 w-3.5" aria-hidden="true" />
                  Upload document
                </Button>
                <Button as="button" size="sm" onClick={openCreate}>
                  <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                  Add Knowledge
                </Button>
              </div>
            }
          />
        }
        footer={`${filtered.length} of ${rows.length} entries`}
      />

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
            <p className="whitespace-pre-line rounded-xl border border-slate-200 bg-slate-50/70 p-4 text-[0.88rem] leading-relaxed text-slate-700" data-no-i18n>
              {viewing.body}
            </p>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          applyItems(await knowledgeService.deleteItem(deleting.id))
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
