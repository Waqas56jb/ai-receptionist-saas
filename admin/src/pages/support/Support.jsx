import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { LifeBuoy, Megaphone, Plus, Send, StickyNote, Trash2 } from 'lucide-react'
import { exportCsv, formatDate, formatDateTime, timeAgo } from '../../lib/utils'
import PageHeader from '../../components/layout/PageHeader'
import { Card, CardBody, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge, { StatusBadge } from '../../components/ui/Badge'
import DataTable from '../../components/ui/DataTable'
import FilterBar from '../../components/ui/FilterBar'
import Modal, { ConfirmDialog } from '../../components/ui/Modal'
import { Input, Select, Textarea } from '../../components/ui/Field'
import { EmptyState, ErrorState } from '../../components/ui/States'
import { SkeletonDetail } from '../../components/ui/Skeleton'
import { Avatar } from '../../components/ui/Misc'
import { useAsync, useTable } from '../../hooks'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import { supportService, announcementService } from '../../services/platformService'
import adminService from '../../services/adminService'
import { ticketPriorities, ticketStatuses } from '../../data/mock/platform'

/* ------------------------------------------------------------- Ticket list --- */

export function SupportTickets() {
  const navigate = useNavigate()
  const tickets = useAsync(() => supportService.listTickets(), [])

  const table = useTable(tickets.data || [], {
    pageSize: 10,
    initialSort: { key: 'updatedAt', direction: 'desc' },
    searchFields: ['id', 'business', 'user', 'subject'],
  })

  const open = (tickets.data || []).filter((t) => t.status === 'Open' || t.status === 'In Progress').length

  const columns = [
    { key: 'id', header: 'Ticket', sortable: true, primary: true, render: (row) => <span className="font-mono text-[0.78rem] font-semibold text-ink-900">{row.id}</span> },
    { key: 'subject', header: 'Subject', sortable: true, render: (row) => <p className="line-clamp-1 max-w-xs font-medium text-ink-900">{row.subject}</p> },
    {
      key: 'business',
      header: 'Business',
      sortable: true,
      render: (row) => (
        <Link to={`/businesses/${row.businessId}`} onClick={(e) => e.stopPropagation()} className="truncate text-brand-600 hover:underline">
          {row.business}
        </Link>
      ),
    },
    { key: 'user', header: 'User', hideOnMobile: true },
    { key: 'priority', header: 'Priority', sortable: true, render: (row) => <StatusBadge status={row.priority} dot={false} /> },
    { key: 'status', header: 'Status', sortable: true, render: (row) => <StatusBadge status={row.status} /> },
    { key: 'assignee', header: 'Assigned', sortable: true, render: (row) => row.assignee || <span className="text-slate-400">Unassigned</span> },
    { key: 'updatedAt', header: 'Updated', sortable: true, render: (row) => timeAgo(row.updatedAt) },
  ]

  return (
    <>
      <PageHeader
        title="Support tickets"
        description="Which businesses need help, and who is helping them."
        badge={tickets.data && <Badge tone={open ? 'warning' : 'success'}>{open} open</Badge>}
      />

      <FilterBar
        table={table}
        searchPlaceholder="Search ticket, business, user or subject…"
        filters={[
          { key: 'status', label: 'Statuses', options: ticketStatuses },
          { key: 'priority', label: 'Priorities', options: ticketPriorities },
        ]}
        onExport={() =>
          exportCsv('tickets.csv', table.filteredRows, [
            { header: 'Ticket', value: (r) => r.id },
            { header: 'Subject', value: (r) => r.subject },
            { header: 'Business', value: (r) => r.business },
            { header: 'Priority', value: (r) => r.priority },
            { header: 'Status', value: (r) => r.status },
            { header: 'Assignee', value: (r) => r.assignee || '' },
          ])
        }
      />

      <DataTable
        columns={columns}
        table={table}
        loading={tickets.loading}
        error={tickets.error}
        onRetry={tickets.reload}
        onRowClick={(row) => navigate(`/support/${row.id}`)}
        empty={<EmptyState icon={LifeBuoy} title="No support tickets yet" description="Tickets raised by businesses appear here." />}
      />
    </>
  )
}

/* ----------------------------------------------------------- Ticket detail --- */

export function TicketDetail() {
  const { id } = useParams()
  const toast = useToast()
  const { admin, can } = useAuth()
  const ticket = useAsync(() => supportService.getTicket(id), [id])
  const admins = useAsync(() => adminService.list(), [])

  const [reply, setReply] = useState('')
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)

  if (ticket.error) {
    return (
      <Card>
        <ErrorState onRetry={ticket.reload} />
      </Card>
    )
  }
  if (ticket.loading) return <SkeletonDetail />
  if (!ticket.data) {
    return (
      <Card>
        <EmptyState icon={LifeBuoy} title="Ticket not found" description="It may have been closed and archived." action={<Button as={Link} to="/support" size="sm">Back to tickets</Button>} />
      </Card>
    )
  }

  const t = ticket.data

  const patch = async (changes, message) => {
    ticket.setData(await supportService.updateTicket(id, changes, admin?.name))
    toast.success(message)
  }

  return (
    <>
      <PageHeader
        title={t.subject}
        breadcrumbs={[{ label: 'Support', to: '/support' }, { label: t.id }]}
        description={`${t.id} · ${t.business} · raised by ${t.user}`}
        badge={
          <span className="flex flex-wrap items-center gap-2">
            <StatusBadge status={t.status} />
            <StatusBadge status={t.priority} dot={false} />
          </span>
        }
        actions={
          <>
            <Button variant="outline" size="sm" disabled={!can('support.resolve')} onClick={() => patch({ status: 'Resolved' }, 'Ticket resolved.')}>
              Resolve
            </Button>
            <Button variant="secondary" size="sm" disabled={!can('support.resolve')} onClick={() => patch({ status: 'Closed' }, 'Ticket closed.')}>
              Close
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <Card>
            <CardHeader title="Conversation" description="Everything the customer and your team have said." />
            <CardBody className="space-y-3.5">
              {t.messages.map((m) => (
                <div key={m.id} className={m.from === 'admin' ? 'flex justify-end' : ''}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${m.from === 'admin' ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                    <p className="text-[0.85rem] leading-relaxed">{m.text}</p>
                    <p className={`mt-1.5 text-[0.68rem] ${m.from === 'admin' ? 'text-brand-100' : 'text-slate-400'}`}>
                      {m.author} · {formatDateTime(m.at)}
                    </p>
                  </div>
                </div>
              ))}

              <div className="border-t border-slate-100 pt-4">
                <Textarea label="Reply to the customer" rows={3} value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Write your reply…" />
                <div className="mt-2.5 flex justify-end">
                  <Button
                    size="sm"
                    loading={busy}
                    disabled={!reply.trim() || !can('support.resolve')}
                    onClick={async () => {
                      setBusy(true)
                      try {
                        ticket.setData(await supportService.reply(id, reply.trim(), admin?.name))
                        setReply('')
                        toast.success('Reply sent.')
                      } finally {
                        setBusy(false)
                      }
                    }}
                  >
                    <Send className="h-3.5 w-3.5" aria-hidden="true" />
                    Send reply
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader icon={StickyNote} title="Internal notes" description="Never shown to the customer." />
            <CardBody>
              <ul className="space-y-3">
                {(t.notes || []).map((n) => (
                  <li key={n.id} className="rounded-xl border border-amber-200 bg-amber-50/70 p-3.5">
                    <p className="text-[0.84rem] leading-relaxed text-amber-900">{n.text}</p>
                    <p className="mt-1.5 text-[0.7rem] text-amber-700/80">{n.author} · {timeAgo(n.at)}</p>
                  </li>
                ))}
                {!t.notes?.length && <p className="text-[0.84rem] text-slate-500">No internal notes yet.</p>}
              </ul>
              <div className="mt-3 flex gap-2">
                <Input className="flex-1" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add an internal note" aria-label="New internal note" />
                <Button
                  variant="secondary"
                  size="md"
                  onClick={async () => {
                    if (!note.trim()) return
                    ticket.setData(await supportService.addNote(id, note.trim(), admin?.name))
                    setNote('')
                    toast.success('Note added.')
                  }}
                >
                  Add
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Ticket" />
            <CardBody className="space-y-4">
              <Select
                label="Status"
                options={ticketStatuses}
                value={t.status}
                disabled={!can('support.resolve')}
                onChange={(e) => patch({ status: e.target.value }, 'Status updated.')}
              />
              <Select
                label="Priority"
                options={ticketPriorities}
                value={t.priority}
                disabled={!can('support.resolve')}
                onChange={(e) => patch({ priority: e.target.value }, 'Priority updated.')}
              />
              <Select
                label="Assigned to"
                value={t.assignee || ''}
                disabled={!can('support.assign')}
                onChange={(e) => patch({ assignee: e.target.value || null }, 'Ticket assigned.')}
                options={[{ value: '', label: 'Unassigned' }, ...(admins.data || []).map((a) => ({ value: a.name, label: a.name }))]}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Context" />
            <CardBody className="divide-y divide-slate-100 py-0">
              {[
                ['Business', <Link key="b" to={`/businesses/${t.businessId}`} className="text-brand-600 hover:underline">{t.business}</Link>],
                ['Raised by', t.user],
                ['Created', formatDateTime(t.createdAt)],
                ['Updated', formatDateTime(t.updatedAt)],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 py-2.5">
                  <span className="text-[0.82rem] text-slate-500">{label}</span>
                  <span className="text-[0.84rem] font-medium text-ink-900">{value}</span>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  )
}

/* --------------------------------------------------------- Announcements --- */

const emptyAnnouncement = { title: '', message: '', type: 'Information', audience: 'All businesses', start: '', end: '', status: 'Scheduled' }

export function Announcements() {
  const toast = useToast()
  const { admin, can } = useAuth()
  const announcements = useAsync(() => announcementService.list(), [])
  const [editing, setEditing] = useState(null)
  const [draft, setDraft] = useState(emptyAnnouncement)
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)

  const save = async () => {
    if (!draft.title.trim() || !draft.message.trim()) return
    setBusy(true)
    try {
      if (editing === 'new') announcements.setData(await announcementService.create(draft, admin?.name))
      else announcements.setData(await announcementService.update(editing, draft, admin?.name))
      toast.success(editing === 'new' ? 'Announcement created.' : 'Announcement updated.')
      setEditing(null)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Announcements"
        description="Platform-wide messages shown to businesses in their portal."
        actions={
          can('support.announce') && (
            <Button size="sm" onClick={() => { setDraft(emptyAnnouncement); setEditing('new') }}>
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              New announcement
            </Button>
          )
        }
      />

      {announcements.loading && <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />}

      {announcements.data?.length === 0 && (
        <Card>
          <EmptyState icon={Megaphone} title="No announcements yet" description="Tell every business about maintenance, new features or anything important." action={<Button size="sm" onClick={() => { setDraft(emptyAnnouncement); setEditing('new') }}>New announcement</Button>} />
        </Card>
      )}

      {announcements.data && announcements.data.length > 0 && (
        <div className="space-y-3">
          {announcements.data.map((a) => (
            <Card key={a.id}>
              <CardBody>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-[0.98rem] font-semibold text-ink-900">{a.title}</h3>
                      <Badge tone={a.type === 'Maintenance' ? 'warning' : a.type === 'Important' ? 'danger' : a.type === 'Feature' ? 'brand' : 'neutral'} size="sm">{a.type}</Badge>
                      <StatusBadge status={a.status} />
                    </div>
                    <p className="mt-2 max-w-2xl text-[0.85rem] leading-relaxed text-slate-600">{a.message}</p>
                    <p className="mt-2 text-[0.75rem] text-slate-400">
                      {a.audience} · {formatDate(a.start)} — {formatDate(a.end)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <Button variant="outline" size="xs" disabled={!can('support.announce')} onClick={() => { setDraft(a); setEditing(a.id) }}>
                      Edit
                    </Button>
                    <Button variant="dangerGhost" size="xs" disabled={!can('support.announce')} onClick={() => setDeleting(a)}>
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'New announcement' : 'Edit announcement'}
        size="lg"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>Cancel</Button>
            <Button size="sm" loading={busy} onClick={save}>Save announcement</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Title" value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} required />
          <Textarea label="Message" rows={4} value={draft.message} onChange={(e) => setDraft((d) => ({ ...d, message: e.target.value }))} required />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select label="Type" options={['Information', 'Maintenance', 'Warning', 'Feature', 'Important']} value={draft.type} onChange={(e) => setDraft((d) => ({ ...d, type: e.target.value }))} />
            <Select label="Audience" options={['All businesses', 'Starter', 'Professional', 'Enterprise', 'Selected businesses']} value={draft.audience} onChange={(e) => setDraft((d) => ({ ...d, audience: e.target.value }))} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input label="Start date" type="date" value={draft.start} onChange={(e) => setDraft((d) => ({ ...d, start: e.target.value }))} />
            <Input label="End date" type="date" value={draft.end} onChange={(e) => setDraft((d) => ({ ...d, end: e.target.value }))} />
            <Select label="Status" options={['Scheduled', 'Published', 'Archived']} value={draft.status} onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))} />
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          setBusy(true)
          try {
            announcements.setData(await announcementService.remove(deleting.id, admin?.name))
            toast.success('Announcement deleted.')
            setDeleting(null)
          } finally {
            setBusy(false)
          }
        }}
        loading={busy}
        title={`Delete “${deleting?.title}”?`}
        description="Businesses will no longer see this announcement."
        confirmLabel="Delete"
      />
    </>
  )
}
