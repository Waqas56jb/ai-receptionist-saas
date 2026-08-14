import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Instagram, MessageSquare, Phone, Plus, Radio, Search, Trash2, Users } from 'lucide-react'
import PageHeader from '../../../components/layout/PageHeader'
import DataTable from '../../../components/ui/DataTable'
import Badge from '../../../components/ui/Badge'
import Avatar from '../../../components/ui/Avatar'
import Button from '../../../components/ui/Button'
import Modal, { ConfirmDialog } from '../../../components/ui/Modal'
import { Input, Select } from '../../../components/ui/Field'
import { EmptyState } from '../../../components/ui/States'
import useAsync from '../../../hooks/useAsync'
import { useToast } from '../../../context/ToastContext'
import crmService from '../../../services/crmService'
import { leadStatuses } from '../../../data/mock/crm'
import { formatDate, timeAgo } from '../../../lib/format'
import { channelLabel } from '../../../lib/channels'

const channelIcon = { voice: Phone, whatsapp: MessageSquare, instagram: Instagram, web: Radio }
const leadTone = { New: 'brand', Contacted: 'info', Qualified: 'success', Interested: 'info', Converted: 'success', Lost: 'danger' }

const emptyContact = { name: '', email: '', phone: '', company: '', channel: 'web', leadStatus: 'New' }

export default function Contacts() {
  const toast = useToast()
  const navigate = useNavigate()
  const contacts = useAsync(() => crmService.listContacts(), [])

  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All statuses')
  const [creating, setCreating] = useState(false)
  const [draft, setDraft] = useState(emptyContact)
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)

  const rows = contacts.data || []

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((row) => {
      const bySearch =
        !q ||
        row.name.toLowerCase().includes(q) ||
        (row.email || '').toLowerCase().includes(q) ||
        (row.phone || '').includes(q) ||
        (row.company || '').toLowerCase().includes(q)
      const byStatus = status === 'All statuses' || row.leadStatus === status
      return bySearch && byStatus
    })
  }, [rows, query, status])

  const create = async () => {
    if (!draft.name.trim()) return
    setBusy(true)
    try {
      contacts.setData(await crmService.createContact(draft))
      setCreating(false)
      setDraft(emptyContact)
      toast.success('Contact added.')
    } finally {
      setBusy(false)
    }
  }

  const columns = [
    {
      key: 'name',
      header: 'Name',
      primary: true,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.name} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-semibold text-ink-900">{row.name}</p>
            <p className="truncate text-[0.75rem] text-slate-500">{row.email || row.phone}</p>
          </div>
        </div>
      ),
    },
    { key: 'phone', header: 'Phone', render: (row) => <span className="whitespace-nowrap">{row.phone || '—'}</span> },
    { key: 'company', header: 'Company', render: (row) => row.company || '—', hideOnMobile: true },
    {
      key: 'channel',
      header: 'Channel',
      render: (row) => {
        const Icon = channelIcon[row.channel] || Radio
        return (
          <span className="inline-flex items-center gap-1.5 text-slate-600">
            <Icon className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
            {channelLabel(row.channel)}
          </span>
        )
      },
    },
    { key: 'leadStatus', header: 'Lead status', render: (row) => <Badge tone={leadTone[row.leadStatus] || 'neutral'} size="sm">{row.leadStatus}</Badge> },
    {
      key: 'tags',
      header: 'Tags',
      render: (row) =>
        row.tags?.length ? (
          <div className="flex flex-wrap gap-1">
            {row.tags.slice(0, 2).map((t) => (
              <Badge key={t} tone="neutral" size="sm">
                {t}
              </Badge>
            ))}
            {row.tags.length > 2 && <span className="text-[0.7rem] text-slate-400">+{row.tags.length - 2}</span>}
          </div>
        ) : (
          '—'
        ),
      hideOnMobile: true,
    },
    { key: 'lastInteraction', header: 'Last interaction', render: (row) => timeAgo(row.lastInteraction) },
    { key: 'createdAt', header: 'Created', render: (row) => formatDate(row.createdAt), hideOnMobile: true },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (row) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setDeleting(row)
          }}
          className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
          aria-label={`Delete ${row.name}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Contacts"
        description="Everyone who has spoken to your AI receptionist."
        badge={<Badge tone="brand">{rows.length} contacts</Badge>}
        actions={
          <Button as="button" size="sm" onClick={() => setCreating(true)}>
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Add contact
          </Button>
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]">
        <Input icon={Search} type="search" placeholder="Search name, email, phone or company…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search contacts" />
        <Select options={['All statuses', ...leadStatuses]} value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by lead status" />
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        loading={contacts.loading}
        error={contacts.error}
        onRetry={contacts.reload}
        onRowClick={(row) => navigate(`/app/contacts/${row.id}`)}
        empty={
          <EmptyState
            icon={Users}
            title={rows.length ? 'No contacts match those filters' : 'No contacts yet'}
            description={
              rows.length
                ? 'Try a different search or status.'
                : 'Contacts are created automatically from calls and messages, or you can add them yourself.'
            }
            action={
              <Button as="button" size="sm" onClick={() => setCreating(true)}>
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                Add contact
              </Button>
            }
          />
        }
        footer={`${filtered.length} of ${rows.length} contacts`}
      />

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="Add contact"
        footer={
          <>
            <Button as="button" variant="ghost" size="sm" onClick={() => setCreating(false)}>
              Cancel
            </Button>
            <Button as="button" size="sm" loading={busy} onClick={create}>
              Add contact
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Full name" value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} required />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Email" type="email" value={draft.email} onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))} />
            <Input label="Phone" value={draft.phone} onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))} />
          </div>
          <Input label="Company" value={draft.company} onChange={(e) => setDraft((d) => ({ ...d, company: e.target.value }))} />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select label="Channel" options={['voice', 'whatsapp', 'instagram', 'web']} value={draft.channel} onChange={(e) => setDraft((d) => ({ ...d, channel: e.target.value }))} />
            <Select label="Lead status" options={leadStatuses} value={draft.leadStatus} onChange={(e) => setDraft((d) => ({ ...d, leadStatus: e.target.value }))} />
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          contacts.setData(await crmService.deleteContact(deleting.id))
          setDeleting(null)
          toast.success('Contact deleted.')
        }}
        title="Delete this contact?"
        description={`${deleting?.name} and their notes will be removed. Conversation history is kept.`}
        confirmLabel="Delete"
      />
    </>
  )
}
