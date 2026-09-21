import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Ban, Building2, CheckCircle2, Eye, MoreHorizontal, Plus, Trash2 } from 'lucide-react'
import { channelLabels, exportCsv, formatCurrency, formatDate, formatNumber, timeAgo } from '../../lib/utils'
import PageHeader from '../../components/layout/PageHeader'
import Button from '../../components/ui/Button'
import Badge, { StatusBadge } from '../../components/ui/Badge'
import DataTable from '../../components/ui/DataTable'
import FilterBar from '../../components/ui/FilterBar'
import Modal, { ConfirmDialog } from '../../components/ui/Modal'
import { Input, Select, Textarea } from '../../components/ui/Field'
import { EmptyState } from '../../components/ui/States'
import { Avatar, Dropdown, DropdownDivider, DropdownItem, ProgressBar } from '../../components/ui/Misc'
import { useAsync, useTable } from '../../hooks'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import businessService from '../../services/businessService'
import { industries, businessStatuses } from '../../data/mock/businesses'

const emptyBusiness = { name: '', owner: '', email: '', phone: '', industry: industries[0], country: '', plan: 'Starter' }

export default function Businesses() {
  const toast = useToast()
  const navigate = useNavigate()
  const { admin, can } = useAuth()
  const businesses = useAsync(() => businessService.list(), [])

  const table = useTable(businesses.data || [], {
    pageSize: 10,
    initialSort: { key: 'name', direction: 'asc' },
    searchFields: ['name', 'owner', 'email', 'phone'],
  })

  const [creating, setCreating] = useState(false)
  const [draft, setDraft] = useState(emptyBusiness)
  const [suspending, setSuspending] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [bulkAction, setBulkAction] = useState(null)
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)

  const refresh = (next) => businesses.setData(Array.isArray(next) ? next : businesses.data.map((b) => (b.id === next.id ? next : b)))

  const doSuspend = async () => {
    if (!reason.trim()) return
    setBusy(true)
    try {
      refresh(await businessService.suspend(suspending.id, { reason, note }, admin?.name))
      toast.warning(`${suspending.name} suspended — access is restricted immediately.`)
      setSuspending(null)
      setReason('')
      setNote('')
    } finally {
      setBusy(false)
    }
  }

  const doActivate = async (row) => {
    refresh(await businessService.activate(row.id, admin?.name))
    toast.success(`${row.name} reactivated.`)
  }

  const doDelete = async () => {
    setBusy(true)
    try {
      businesses.setData(await businessService.remove(deleting.id, admin?.name))
      toast.success(`${deleting.name} deleted.`)
      setDeleting(null)
    } finally {
      setBusy(false)
    }
  }

  const doBulk = async () => {
    setBusy(true)
    try {
      businesses.setData(await businessService.bulk(table.selected, bulkAction, admin?.name))
      toast.success(`${table.selected.length} businesses ${bulkAction === 'suspend' ? 'suspended' : 'activated'}.`)
      table.setSelected([])
      setBulkAction(null)
    } finally {
      setBusy(false)
    }
  }

  const create = async () => {
    if (!draft.name.trim() || !draft.owner.trim()) return
    setBusy(true)
    try {
      businesses.setData(await businessService.create(draft, admin?.name))
      toast.success('Business created.')
      setCreating(false)
      setDraft(emptyBusiness)
    } finally {
      setBusy(false)
    }
  }

  const columns = [
    {
      key: 'name',
      header: 'Business',
      sortable: true,
      primary: true,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.name} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-semibold text-ink-900">{row.name}</p>
            <p className="truncate text-[0.74rem] text-slate-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'owner', header: 'Owner', sortable: true, render: (row) => <span className="truncate">{row.owner}</span> },
    { key: 'industry', header: 'Industry', sortable: true, hideOnMobile: true },
    { key: 'plan', header: 'Plan', sortable: true, render: (row) => <Badge tone={row.plan === 'Enterprise' ? 'brand' : 'neutral'} size="sm">{row.plan}</Badge> },
    { key: 'status', header: 'Status', sortable: true, render: (row) => <StatusBadge status={row.status} /> },
    { key: 'aiStatus', header: 'AI', sortable: true, render: (row) => <StatusBadge status={row.aiStatus} dot={false} /> },
    {
      key: 'channels',
      header: 'Channels',
      hideOnMobile: true,
      render: (row) => (row.channels?.length ? <span className="text-slate-500">{channelLabels(row.channels)}</span> : <span className="text-slate-400">None</span>),
    },
    { key: 'usagePct', header: 'Usage', sortable: true, render: (row) => <ProgressBar value={row.usagePct} max={100} showValue={false} className="w-24" /> },
    { key: 'mrr', header: 'MRR', sortable: true, render: (row) => formatCurrency(row.mrr) },
    { key: 'createdAt', header: 'Created', sortable: true, hideOnMobile: true, render: (row) => formatDate(row.createdAt) },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Dropdown
            trigger={({ toggle }) => (
              <button type="button" onClick={toggle} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-ink-900" aria-label={`Actions for ${row.name}`}>
                <MoreHorizontal className="h-4 w-4" />
              </button>
            )}
          >
            <DropdownItem as={Link} to={`/businesses/${row.id}`} icon={Eye}>
              View details
            </DropdownItem>
            <DropdownItem as={Link} to={`/subscriptions`} icon={Building2}>
              View subscription
            </DropdownItem>
            <DropdownDivider />
            {row.status === 'Suspended' ? (
              <DropdownItem icon={CheckCircle2} onClick={() => doActivate(row)} disabled={!can('businesses.activate')}>
                Activate
              </DropdownItem>
            ) : (
              <DropdownItem icon={Ban} tone="danger" onClick={() => setSuspending(row)} disabled={!can('businesses.suspend')}>
                Suspend
              </DropdownItem>
            )}
            <DropdownItem icon={Trash2} tone="danger" onClick={() => setDeleting(row)} disabled={!can('businesses.delete')}>
              Delete
            </DropdownItem>
          </Dropdown>
        </div>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Businesses"
        description="Every business on the platform, what they pay and how they are performing."
        badge={businesses.data && <Badge tone="brand">{businesses.data.length} total</Badge>}
        actions={
          can('businesses.create') && (
            <Button size="sm" onClick={() => setCreating(true)}>
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              Add business
            </Button>
          )
        }
      />

      <FilterBar
        table={table}
        searchPlaceholder="Search business, owner, email or phone…"
        filters={[
          { key: 'industry', label: 'Industries', options: industries },
          { key: 'plan', label: 'Plans', options: ['Starter', 'Professional', 'Enterprise'] },
          { key: 'status', label: 'Statuses', options: businessStatuses },
          { key: 'aiStatus', label: 'AI status', allLabel: 'AI states', options: ['Online', 'Paused', 'Needs setup'] },
        ]}
        onExport={() =>
          exportCsv('businesses.csv', table.filteredRows, [
            { header: 'Business', value: (r) => r.name },
            { header: 'Owner', value: (r) => r.owner },
            { header: 'Email', value: (r) => r.email },
            { header: 'Industry', value: (r) => r.industry },
            { header: 'Plan', value: (r) => r.plan },
            { header: 'Status', value: (r) => r.status },
            { header: 'MRR', value: (r) => r.mrr },
            { header: 'Created', value: (r) => formatDate(r.createdAt) },
          ])
        }
      />

      <DataTable
        columns={columns}
        table={table}
        loading={businesses.loading}
        error={businesses.error}
        onRetry={businesses.reload}
        onRowClick={(row) => navigate(`/businesses/${row.id}`)}
        selectable
        bulkActions={
          <>
            <Button variant="outline" size="xs" onClick={() => setBulkAction('activate')} disabled={!can('businesses.activate')}>
              Activate
            </Button>
            <Button variant="outline" size="xs" onClick={() => setBulkAction('suspend')} disabled={!can('businesses.suspend')}>
              Suspend
            </Button>
            <Button
              variant="outline"
              size="xs"
              onClick={() =>
                exportCsv('businesses-selection.csv', table.filteredRows.filter((r) => table.selected.includes(r.id)), [
                  { header: 'Business', value: (r) => r.name },
                  { header: 'Owner', value: (r) => r.owner },
                  { header: 'Plan', value: (r) => r.plan },
                  { header: 'Status', value: (r) => r.status },
                ])
              }
            >
              Export
            </Button>
          </>
        }
        empty={
          <EmptyState
            icon={Building2}
            title={table.sourceTotal ? 'No businesses match those filters' : 'No businesses found'}
            description={table.sourceTotal ? 'Try clearing a filter or widening your search.' : 'Businesses appear here as soon as they sign up.'}
            action={table.sourceTotal ? <Button variant="secondary" size="sm" onClick={table.clearFilters}>Clear filters</Button> : undefined}
          />
        }
      />

      {/* Create */}
      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="Add business"
        description="Creates the business record. The owner still completes onboarding in their own portal."
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setCreating(false)}>Cancel</Button>
            <Button size="sm" loading={busy} onClick={create}>Create business</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Business name" value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} required />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Owner name" value={draft.owner} onChange={(e) => setDraft((d) => ({ ...d, owner: e.target.value }))} required />
            <Input label="Owner email" type="email" value={draft.email} onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Phone" value={draft.phone} onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))} />
            <Input label="Country" value={draft.country} onChange={(e) => setDraft((d) => ({ ...d, country: e.target.value }))} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select label="Industry" options={industries} value={draft.industry} onChange={(e) => setDraft((d) => ({ ...d, industry: e.target.value }))} />
            <Select label="Plan" options={['Starter', 'Professional', 'Enterprise']} value={draft.plan} onChange={(e) => setDraft((d) => ({ ...d, plan: e.target.value }))} />
          </div>
        </div>
      </Modal>

      {/* Suspend */}
      <ConfirmDialog
        open={Boolean(suspending)}
        onClose={() => setSuspending(null)}
        onConfirm={doSuspend}
        loading={busy}
        title={`Suspend ${suspending?.name}?`}
        description="The business loses access to the portal and its AI receptionist stops answering immediately."
        warning="This will immediately restrict access for every user in this business."
        confirmLabel="Suspend business"
      >
        <Select
          label="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          options={['', 'Payment failed', 'Terms of service violation', 'Customer request', 'Abuse investigation', 'Other'].map((o) => ({ value: o, label: o || 'Choose a reason…' }))}
        />
        <Textarea label="Internal note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} help="Visible to admins only. Recorded in the audit log." />
      </ConfirmDialog>

      {/* Delete */}
      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={doDelete}
        loading={busy}
        title={`Delete ${deleting?.name}?`}
        description="The business, its users and its conversation history are removed from the platform."
        warning="This cannot be undone."
        confirmLabel="Delete permanently"
        confirmPhrase={deleting?.name}
      />

      {/* Bulk */}
      <ConfirmDialog
        open={Boolean(bulkAction)}
        onClose={() => setBulkAction(null)}
        onConfirm={doBulk}
        loading={busy}
        tone={bulkAction === 'suspend' ? 'danger' : 'primary'}
        title={`${bulkAction === 'suspend' ? 'Suspend' : 'Activate'} ${table.selected.length} businesses?`}
        description={
          bulkAction === 'suspend'
            ? 'Every selected business loses access and its AI stops answering.'
            : 'Every selected business regains access and its AI resumes answering.'
        }
        warning={bulkAction === 'suspend' ? 'This will immediately restrict access for all selected accounts.' : undefined}
        confirmLabel={bulkAction === 'suspend' ? 'Suspend all' : 'Activate all'}
      />
    </>
  )
}
