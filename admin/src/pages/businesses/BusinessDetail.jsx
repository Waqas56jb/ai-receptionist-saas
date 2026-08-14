import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Ban, Bot, Building2, CalendarDays, CheckCircle2, CreditCard, Gauge, Globe, Instagram,
  KeyRound, Mail, MessageSquare, MessagesSquare, Mic, Phone, Receipt, Send, ShieldAlert,
  StickyNote, Trash2, UserCog, Users,
} from 'lucide-react'
import { channelLabel, cn, formatCurrency, formatDate, formatDateTime, formatDuration, formatNumber, timeAgo } from '../../lib/utils'
import PageHeader from '../../components/layout/PageHeader'
import { Card, CardBody, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge, { StatusBadge } from '../../components/ui/Badge'
import { ConfirmDialog } from '../../components/ui/Modal'
import { Select, Textarea, Input } from '../../components/ui/Field'
import { EmptyState, ErrorState } from '../../components/ui/States'
import { SkeletonDetail } from '../../components/ui/Skeleton'
import { Avatar, MaskedCredential, ProgressBar, Tabs } from '../../components/ui/Misc'
import { useAsync } from '../../hooks'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import businessService from '../../services/businessService'
import userService from '../../services/userService'
import { subscriptionService, billingService } from '../../services/revenueService'
import { aiService, channelService, conversationService } from '../../services/aiService'
import { auditService } from '../../services/platformService'

const tabs = [
  { id: 'overview', label: 'Overview', icon: Building2 },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'subscription', label: 'Subscription', icon: CreditCard },
  { id: 'billing', label: 'Billing', icon: Receipt },
  { id: 'ai', label: 'AI', icon: Bot },
  { id: 'channels', label: 'Channels', icon: Mic },
  { id: 'conversations', label: 'Conversations', icon: MessagesSquare },
  { id: 'calls', label: 'Calls', icon: Phone },
  { id: 'messages', label: 'Messages', icon: Send },
  { id: 'usage', label: 'Usage', icon: Gauge },
  { id: 'activity', label: 'Activity', icon: CalendarDays },
  { id: 'notes', label: 'Notes', icon: StickyNote },
]

function Row({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="text-[0.82rem] text-slate-500">{label}</span>
      <span className="min-w-0 text-right text-[0.84rem] font-medium text-ink-900">{children}</span>
    </div>
  )
}

export default function BusinessDetail() {
  const { id } = useParams()
  const toast = useToast()
  const navigate = useNavigate()
  const { admin, can } = useAuth()

  const [tab, setTab] = useState('overview')
  const [suspending, setSuspending] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [impersonating, setImpersonating] = useState(false)
  const [supportSession, setSupportSession] = useState(null)
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')
  const [newNote, setNewNote] = useState('')
  const [busy, setBusy] = useState(false)

  const business = useAsync(() => businessService.get(id), [id])
  const users = useAsync(() => userService.listByBusiness(id), [id])
  const subscription = useAsync(() => subscriptionService.listByBusiness(id), [id])
  const payments = useAsync(() => billingService.listPaymentsByBusiness(id), [id])
  const invoices = useAsync(() => billingService.listInvoicesByBusiness(id), [id])
  const agent = useAsync(() => aiService.getAgentByBusiness(id), [id])
  const voice = useAsync(() => channelService.listVoice(), [])
  const whatsapp = useAsync(() => channelService.listWhatsApp(), [])
  const instagram = useAsync(() => channelService.listInstagram(), [])
  const conversations = useAsync(() => conversationService.listConversationsByBusiness(id), [id])
  const calls = useAsync(() => conversationService.listCallsByBusiness(id), [id])
  const messages = useAsync(() => conversationService.listMessagesByBusiness(id), [id])
  const notes = useAsync(() => businessService.getNotes(id), [id])
  const audit = useAsync(() => auditService.list(), [])

  if (business.error) {
    return (
      <Card>
        <ErrorState onRetry={business.reload} />
      </Card>
    )
  }
  if (business.loading) return <SkeletonDetail />
  if (!business.data) {
    return (
      <Card>
        <EmptyState icon={Building2} title="Business not found" description="It may have been deleted." action={<Button as={Link} to="/businesses" size="sm">Back to businesses</Button>} />
      </Card>
    )
  }

  const b = business.data
  const businessAudit = (audit.data || []).filter((l) => l.resourceId === id || l.resourceName === b.name)

  const doSuspend = async () => {
    if (!reason.trim()) return
    setBusy(true)
    try {
      business.setData(await businessService.suspend(id, { reason, note }, admin?.name))
      toast.warning(`${b.name} suspended — access restricted immediately.`)
      setSuspending(false)
      setReason('')
      setNote('')
    } finally {
      setBusy(false)
    }
  }

  const doActivate = async () => {
    business.setData(await businessService.activate(id, admin?.name))
    toast.success(`${b.name} reactivated.`)
  }

  const doImpersonate = async () => {
    if (!reason.trim()) return
    setBusy(true)
    try {
      const session = await businessService.startSupportAccess(id, reason, admin?.name)
      setSupportSession(session)
      setImpersonating(false)
      setReason('')
      toast.info('Support session recorded in the audit log.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      {supportSession && (
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" aria-hidden="true" />
            <div>
              <p className="text-[0.9rem] font-bold text-amber-900">You are in support mode for {supportSession.business}</p>
              <p className="mt-1 text-[0.82rem] leading-relaxed text-amber-900/90">
                Admin: {admin?.name} · started {formatDateTime(supportSession.startedAt)} · reason: {supportSession.reason}.
                Every action you take is recorded in the audit log.
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setSupportSession(null)}>
            End support session
          </Button>
        </div>
      )}

      <PageHeader
        title={b.name}
        breadcrumbs={[{ label: 'Businesses', to: '/businesses' }, { label: b.name }]}
        description={`${b.industry} · ${b.country}`}
        badge={
          <span className="flex flex-wrap items-center gap-2">
            <StatusBadge status={b.status} />
            <Badge tone={b.plan === 'Enterprise' ? 'brand' : 'neutral'} size="sm">{b.plan}</Badge>
            <StatusBadge status={b.aiStatus} dot={false} />
          </span>
        }
        actions={
          <>
            {can('businesses.impersonate') && (
              <Button variant="outline" size="sm" onClick={() => setImpersonating(true)}>
                <UserCog className="h-3.5 w-3.5" aria-hidden="true" />
                Support access
              </Button>
            )}
            {b.status === 'Suspended' ? (
              <Button size="sm" onClick={doActivate} disabled={!can('businesses.activate')}>
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                Activate
              </Button>
            ) : (
              <Button variant="secondary" size="sm" onClick={() => setSuspending(true)} disabled={!can('businesses.suspend')}>
                <Ban className="h-3.5 w-3.5" aria-hidden="true" />
                Suspend
              </Button>
            )}
            <Button variant="dangerGhost" size="sm" onClick={() => setDeleting(true)} disabled={!can('businesses.delete')}>
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              Delete
            </Button>
          </>
        }
      />

      {b.status === 'Suspended' && b.suspendedReason && (
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4">
          <Ban className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" aria-hidden="true" />
          <p className="text-[0.85rem] leading-relaxed text-rose-900">
            Suspended {formatDate(b.suspendedAt)} — {b.suspendedReason}
          </p>
        </div>
      )}

      <Tabs tabs={tabs} value={tab} onChange={setTab} className="mb-5" size="sm" />

      {tab === 'overview' && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <Card>
            <CardHeader icon={Building2} title="Business information" />
            <CardBody className="divide-y divide-slate-100 py-0">
              <Row label="Business name">{b.name}</Row>
              <Row label="Industry">{b.industry}</Row>
              <Row label="Owner">{b.owner}</Row>
              <Row label="Email">{b.email}</Row>
              <Row label="Phone">{b.phone}</Row>
              <Row label="Website">{b.website ? <a href={b.website} target="_blank" rel="noreferrer" className="text-brand-600 hover:underline">{b.website}</a> : '—'}</Row>
              <Row label="Address">{b.address}</Row>
              <Row label="Country">{b.country}</Row>
              <Row label="Registered">{formatDate(b.createdAt)}</Row>
              <Row label="Last active">{timeAgo(b.lastActive)}</Row>
            </CardBody>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader title="Plan & status" />
              <CardBody className="divide-y divide-slate-100 py-0">
                <Row label="Current plan"><Badge tone="brand" size="sm">{b.plan}</Badge></Row>
                <Row label="Subscription">{subscription.data ? <StatusBadge status={subscription.data.status} /> : '—'}</Row>
                <Row label="MRR">{formatCurrency(b.mrr)}</Row>
                <Row label="AI status"><StatusBadge status={b.aiStatus} dot={false} /></Row>
                <Row label="Users">{b.users}</Row>
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Connected channels" />
              <CardBody>
                {b.channels.length === 0 ? (
                  <p className="text-[0.84rem] text-slate-500">No channels connected yet.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {b.channels.map((c) => (
                      <Badge key={c} tone="success" size="sm" dot>
                        {channelLabel(c)}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Volume" />
              <CardBody className="divide-y divide-slate-100 py-0">
                <Row label="Calls">{formatNumber(b.calls)}</Row>
                <Row label="Messages">{formatNumber(b.messages)}</Row>
                <Row label="Plan usage">{b.usagePct}%</Row>
              </CardBody>
            </Card>
          </div>
        </div>
      )}

      {tab === 'users' && (
        <Card>
          <CardHeader icon={Users} title="Users" description="Everyone with access to this business account." />
          <CardBody className="p-0">
            {users.loading && <div className="space-y-2 p-5">{[0, 1, 2].map((i) => <div key={i} className="h-12 animate-pulse rounded-lg bg-slate-100" />)}</div>}
            {users.data?.length === 0 && <EmptyState compact icon={Users} title="No users yet" description="The owner has not invited anyone." />}
            <ul className="divide-y divide-slate-100">
              {(users.data || []).map((u) => (
                <li key={u.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
                  <Link to={`/users/${u.id}`} className="flex min-w-0 items-center gap-3">
                    <Avatar name={u.name} size="sm" />
                    <span className="min-w-0">
                      <span className="block truncate text-[0.85rem] font-semibold text-ink-900">{u.name}</span>
                      <span className="block truncate text-[0.75rem] text-slate-500">{u.email}</span>
                    </span>
                  </Link>
                  <div className="flex items-center gap-3">
                    <Badge tone="neutral" size="sm">{u.role}</Badge>
                    <StatusBadge status={u.status} />
                    <span className="hidden text-[0.74rem] text-slate-400 sm:inline">{u.lastLogin ? timeAgo(u.lastLogin) : 'Never'}</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}

      {tab === 'subscription' && (
        <Card>
          <CardHeader icon={CreditCard} title="Subscription" action={subscription.data && <Button as={Link} to={`/subscriptions/${subscription.data.id}`} variant="outline" size="sm">Manage</Button>} />
          <CardBody className="divide-y divide-slate-100 py-0">
            {!subscription.data ? (
              <EmptyState compact icon={CreditCard} title="No subscription" description="This business has never subscribed." />
            ) : (
              <>
                <Row label="Plan">{subscription.data.plan}</Row>
                <Row label="Status"><StatusBadge status={subscription.data.status} /></Row>
                <Row label="Billing cycle">{subscription.data.cycle}</Row>
                <Row label="Amount">{formatCurrency(subscription.data.amount)}</Row>
                <Row label="Started">{formatDate(subscription.data.startDate)}</Row>
                <Row label="Renews">{formatDate(subscription.data.renewalDate)}</Row>
                <Row label="Payment"><StatusBadge status={subscription.data.paymentStatus} dot={false} /></Row>
              </>
            )}
          </CardBody>
        </Card>
      )}

      {tab === 'billing' && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <Card>
            <CardHeader icon={Receipt} title="Payments" />
            <CardBody className="p-0">
              {payments.data?.length === 0 && <EmptyState compact icon={Receipt} title="No payments" description="Nothing has been charged yet." />}
              <ul className="divide-y divide-slate-100">
                {(payments.data || []).map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <div className="min-w-0">
                      <p className="text-[0.84rem] font-semibold text-ink-900">{formatCurrency(p.amount)}</p>
                      <p className="truncate text-[0.74rem] text-slate-500">{p.method} · {formatDate(p.at)}</p>
                    </div>
                    <StatusBadge status={p.status} />
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader icon={Receipt} title="Invoices" />
            <CardBody className="p-0">
              {invoices.data?.length === 0 && <EmptyState compact icon={Receipt} title="No invoices" description="Nothing has been invoiced yet." />}
              <ul className="divide-y divide-slate-100">
                {(invoices.data || []).map((i) => (
                  <li key={i.id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <div className="min-w-0">
                      <p className="text-[0.84rem] font-semibold text-ink-900">{i.number}</p>
                      <p className="text-[0.74rem] text-slate-500">Issued {formatDate(i.issued)} · due {formatDate(i.due)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[0.82rem] font-semibold text-ink-900">{formatCurrency(i.amount)}</span>
                      <StatusBadge status={i.status} />
                    </div>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>
      )}

      {tab === 'ai' && (
        <Card>
          <CardHeader icon={Bot} title="AI configuration" description="Read-only view of the customer's AI setup." action={agent.data && <Button as={Link} to={`/ai-agents/${agent.data.id}`} variant="outline" size="sm">Open agent</Button>} />
          <CardBody className="divide-y divide-slate-100 py-0">
            {!agent.data ? (
              <EmptyState compact icon={Bot} title="No AI agent" description="This business has not set up its receptionist." />
            ) : (
              <>
                <Row label="Agent"><StatusBadge status={agent.data.status} /></Row>
                <Row label="Knowledge source">{agent.data.knowledgeMode}</Row>
                <Row label="Prompt mode">{agent.data.promptMode}</Row>
                <Row label="Personality">{agent.data.personality}</Row>
                <Row label="Languages">{agent.data.languages.join(', ')}</Row>
                <Row label="Human handoff">{agent.data.handoff ? 'Enabled' : 'Disabled'}</Row>
                <Row label="Knowledge items">{agent.data.knowledgeItems}</Row>
                <Row label="AI minutes">{formatNumber(agent.data.aiMinutes)}</Row>
              </>
            )}
          </CardBody>
        </Card>
      )}

      {tab === 'channels' && (
        <div className="space-y-4">
          {[
            { title: 'Voice', icon: Mic, kind: 'voice', rows: (voice.data || []).filter((v) => v.businessId === id) },
            { title: 'WhatsApp', icon: MessageSquare, kind: 'whatsapp', rows: (whatsapp.data || []).filter((v) => v.businessId === id) },
            { title: 'Instagram', icon: Instagram, kind: 'instagram', rows: (instagram.data || []).filter((v) => v.businessId === id) },
          ].map((group) => (
            <Card key={group.kind}>
              <CardHeader icon={group.icon} title={group.title} />
              <CardBody className="p-0">
                {group.rows.length === 0 ? (
                  <EmptyState compact icon={group.icon} title={`${group.title} not connected`} description="This business has not connected this channel." />
                ) : (
                  <ul className="divide-y divide-slate-100">
                    {group.rows.map((c) => (
                      <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
                        <div className="min-w-0">
                          <p className="text-[0.85rem] font-semibold text-ink-900">{c.number || c.account}</p>
                          <p className="text-[0.74rem] text-slate-500">Last activity {timeAgo(c.lastActivity)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <MaskedCredential value={c.credential} />
                          <StatusBadge status={c.status} />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}

      {tab === 'conversations' && (
        <Card>
          <CardHeader icon={MessagesSquare} title="Conversations" />
          <CardBody className="p-0">
            {conversations.data?.length === 0 && <EmptyState compact icon={MessagesSquare} title="No conversations" description="Nothing has come through yet." />}
            <ul className="divide-y divide-slate-100">
              {(conversations.data || []).map((c) => (
                <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="text-[0.85rem] font-semibold text-ink-900">{c.customer}</p>
                    <p className="truncate text-[0.76rem] text-slate-500">{c.lastMessage}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge tone="neutral" size="sm">{channelLabel(c.channel)}</Badge>
                    <Badge tone={c.handledBy === 'AI' ? 'brand' : 'info'} size="sm">{c.handledBy}</Badge>
                    <span className="text-[0.72rem] text-slate-400">{timeAgo(c.at)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}

      {tab === 'calls' && (
        <Card>
          <CardHeader icon={Phone} title="Calls" />
          <CardBody className="p-0">
            {calls.data?.length === 0 && <EmptyState compact icon={Phone} title="No calls" description="This business has not received calls." />}
            <ul className="divide-y divide-slate-100">
              {(calls.data || []).map((c) => (
                <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="text-[0.85rem] font-semibold text-ink-900">{c.customer}</p>
                    <p className="text-[0.74rem] text-slate-500">{c.phone} · {formatDateTime(c.at)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[0.78rem] text-slate-500">{formatDuration(c.duration)}</span>
                    <Badge tone={c.transferred ? 'info' : c.aiHandled ? 'brand' : 'neutral'} size="sm">
                      {c.transferred ? 'Transferred' : c.aiHandled ? 'AI handled' : 'Not answered'}
                    </Badge>
                    <StatusBadge status={c.status} />
                  </div>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}

      {tab === 'messages' && (
        <Card>
          <CardHeader icon={Send} title="Messages" />
          <CardBody className="p-0">
            {messages.data?.length === 0 && <EmptyState compact icon={Send} title="No messages" description="Nothing has come through this channel." />}
            <ul className="divide-y divide-slate-100">
              {(messages.data || []).map((m) => (
                <li key={m.id} className="px-5 py-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[0.85rem] font-semibold text-ink-900">{m.customer}</p>
                    <div className="flex items-center gap-2">
                      <Badge tone="neutral" size="sm">{channelLabel(m.channel)}</Badge>
                      <StatusBadge status={m.status} dot={false} />
                    </div>
                  </div>
                  <p className="mt-1 text-[0.8rem] text-slate-600">{m.text}</p>
                  <p className="mt-1 text-[0.78rem] text-slate-500">AI: {m.aiResponse}</p>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}

      {tab === 'usage' && (
        <Card>
          <CardHeader icon={Gauge} title="Usage against plan" description="Demo allowances — the backend enforces the real limits." />
          <CardBody className="space-y-6">
            <ProgressBar label="Overall plan usage" value={b.usagePct} max={100} hint={`${100 - b.usagePct}% of the allowance remaining`} />
            <ProgressBar label="Calls" value={b.calls} max={Math.max(b.calls, 2000)} />
            <ProgressBar label="Messages" value={b.messages} max={Math.max(b.messages, 5000)} />
          </CardBody>
        </Card>
      )}

      {tab === 'activity' && (
        <Card>
          <CardHeader icon={CalendarDays} title="Admin activity" description="Every administrative action taken on this business." />
          <CardBody className="p-0">
            {businessAudit.length === 0 && <EmptyState compact icon={CalendarDays} title="No admin activity recorded" description="Nothing has been changed by an administrator." />}
            <ul className="divide-y divide-slate-100">
              {businessAudit.map((l) => (
                <li key={l.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="text-[0.85rem] font-semibold text-ink-900">{l.action}</p>
                    <p className="truncate text-[0.75rem] text-slate-500">{l.detail || l.resourceName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[0.76rem] font-medium text-slate-600">{l.admin}</p>
                    <p className="text-[0.7rem] text-slate-400">{formatDateTime(l.at)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}

      {tab === 'notes' && (
        <Card>
          <CardHeader icon={StickyNote} title="Internal notes" description="Visible to administrators only." />
          <CardBody>
            <ul className="space-y-3">
              {(notes.data || []).map((n) => (
                <li key={n.id} className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                  <p className="text-[0.84rem] leading-relaxed text-slate-700">{n.text}</p>
                  <p className="mt-1.5 text-[0.7rem] text-slate-400">{n.author} · {timeAgo(n.at)}</p>
                </li>
              ))}
              {notes.data?.length === 0 && <p className="text-[0.84rem] text-slate-500">No notes yet.</p>}
            </ul>

            <div className="mt-4 flex gap-2">
              <Input className="flex-1" value={newNote} onChange={(e) => setNewNote(e.target.value)} placeholder="Add an internal note" aria-label="New note" />
              <Button
                variant="secondary"
                size="md"
                onClick={async () => {
                  if (!newNote.trim()) return
                  notes.setData(await businessService.addNote(id, newNote.trim(), admin?.name))
                  setNewNote('')
                  toast.success('Note added.')
                }}
              >
                Add note
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Dialogs */}
      <ConfirmDialog
        open={suspending}
        onClose={() => setSuspending(false)}
        onConfirm={doSuspend}
        loading={busy}
        title={`Suspend ${b.name}?`}
        description="The business loses portal access and its AI receptionist stops answering."
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
        <Textarea label="Internal note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
      </ConfirmDialog>

      <ConfirmDialog
        open={deleting}
        onClose={() => setDeleting(false)}
        onConfirm={async () => {
          setBusy(true)
          try {
            await businessService.remove(id, admin?.name)
            toast.success('Business deleted.')
            navigate('/businesses')
          } finally {
            setBusy(false)
          }
        }}
        loading={busy}
        title={`Delete ${b.name}?`}
        description="The business, its users and its conversation history are removed."
        warning="This cannot be undone."
        confirmLabel="Delete permanently"
        confirmPhrase={b.name}
      />

      <ConfirmDialog
        open={impersonating}
        onClose={() => setImpersonating(false)}
        onConfirm={doImpersonate}
        loading={busy}
        tone="primary"
        title={`Enter support mode for ${b.name}?`}
        description="You will see the business account as its owner does, for support purposes."
        warning="A reason is required. The session and everything you do inside it is recorded in the audit log."
        confirmLabel="Start support session"
      >
        <Textarea label="Reason for access" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} required help="Shown in the audit log alongside your name." />
        <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
          <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          <p className="text-[0.78rem] leading-relaxed text-slate-500">
            This console never bypasses authentication. Real support access will be granted by the
            backend against your admin identity.
          </p>
        </div>
      </ConfirmDialog>
    </>
  )
}
