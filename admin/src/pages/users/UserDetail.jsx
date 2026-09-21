import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Ban, Building2, CalendarDays, CheckCircle2, History, KeyRound, Mail, MessagesSquare,
  Phone, ShieldOff, StickyNote, UserRound, BarChart3,
} from 'lucide-react'
import { formatDate, formatDateTime, formatDuration, timeAgo } from '../../lib/utils'
import PageHeader from '../../components/layout/PageHeader'
import { Card, CardBody, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge, { StatusBadge } from '../../components/ui/Badge'
import { ConfirmDialog } from '../../components/ui/Modal'
import { Input, Select, Textarea } from '../../components/ui/Field'
import { EmptyState, ErrorState } from '../../components/ui/States'
import { SkeletonDetail } from '../../components/ui/Skeleton'
import { Avatar, Tabs } from '../../components/ui/Misc'
import { useAsync } from '../../hooks'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import userService from '../../services/userService'
import { subscriptionService } from '../../services/revenueService'
import { conversationService } from '../../services/aiService'
import { auditService } from '../../services/platformService'
import { ChartFrame, TrendChart, chartColors } from '../../components/charts/Charts'

const tabs = [
  { id: 'profile', label: 'Profile', icon: UserRound },
  { id: 'kpis', label: 'KPIs', icon: BarChart3 },
  { id: 'activity', label: 'Activity', icon: CalendarDays },
  { id: 'security', label: 'Security', icon: KeyRound },
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

export default function UserDetail() {
  const { id } = useParams()
  const toast = useToast()
  const { admin, can } = useAuth()
  const [tab, setTab] = useState('profile')
  const [statusChange, setStatusChange] = useState(null)
  const [reason, setReason] = useState('')
  const [newNote, setNewNote] = useState('')
  const [busy, setBusy] = useState(false)

  const user = useAsync(() => userService.get(id), [id])
  const history = useAsync(() => userService.getLoginHistory(id), [id])
  const notes = useAsync(() => userService.getNotes(id), [id])
  const calls = useAsync(() => conversationService.listCalls(), [])
  const conversations = useAsync(() => conversationService.listConversations(), [])
  const audit = useAsync(() => auditService.list(), [])
  const subscription = useAsync(() => (user.data ? subscriptionService.listByBusiness(user.data.businessId) : Promise.resolve(null)), [user.data?.businessId])
  const kpis = useAsync(() => userService.getKpis(id), [id])

  if (user.error) {
    return (
      <Card>
        <ErrorState onRetry={user.reload} />
      </Card>
    )
  }
  if (user.loading) return <SkeletonDetail />
  if (!user.data) {
    return (
      <Card>
        <EmptyState icon={UserRound} title="User not found" description="This account may have been deleted." action={<Button as={Link} to="/users" size="sm">Back to users</Button>} />
      </Card>
    )
  }

  const u = user.data
  const userAudit = (audit.data || []).filter((l) => l.resourceId === u.id)
  const userCalls = (calls.data || []).filter((c) => c.businessId === u.businessId).slice(0, 5)
  const userConversations = (conversations.data || []).filter((c) => c.businessId === u.businessId).slice(0, 5)

  const applyStatus = async () => {
    if (statusChange !== 'Active' && !reason.trim()) return
    setBusy(true)
    try {
      user.setData(await userService.setStatus(id, statusChange, { reason }, admin?.name))
      toast[statusChange === 'Active' ? 'success' : 'warning'](`${u.name} ${statusChange === 'Active' ? 'activated' : statusChange.toLowerCase()}.`)
      setStatusChange(null)
      setReason('')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <PageHeader
        title={u.name}
        breadcrumbs={[{ label: 'Users', to: '/users' }, { label: u.name }]}
        description={u.email}
        badge={
          <span className="flex flex-wrap items-center gap-2">
            <StatusBadge status={u.status} />
            <Badge tone="neutral" size="sm">{u.role}</Badge>
          </span>
        }
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              disabled={!can('users.edit')}
              onClick={async () => {
                await userService.resetPassword(id, admin?.name)
                toast.success('Password reset email sent.')
              }}
            >
              <KeyRound className="h-3.5 w-3.5" aria-hidden="true" />
              Reset password
            </Button>
            {u.status === 'Active' ? (
              <>
                <Button variant="secondary" size="sm" disabled={!can('users.suspend')} onClick={() => setStatusChange('Suspended')}>
                  <Ban className="h-3.5 w-3.5" aria-hidden="true" />
                  Suspend
                </Button>
                <Button variant="dangerGhost" size="sm" disabled={!can('users.suspend')} onClick={() => setStatusChange('Blocked')}>
                  <ShieldOff className="h-3.5 w-3.5" aria-hidden="true" />
                  Block
                </Button>
              </>
            ) : (
              <Button size="sm" disabled={!can('users.suspend')} onClick={() => setStatusChange('Active')}>
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                Activate
              </Button>
            )}
          </>
        }
      />

      {(u.blockedReason || u.suspendedReason) && (
        <div className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4">
          <Ban className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" aria-hidden="true" />
          <p className="text-[0.85rem] leading-relaxed text-rose-900">{u.blockedReason || u.suspendedReason}</p>
        </div>
      )}

      <Tabs tabs={tabs} value={tab} onChange={setTab} className="mb-5" size="sm" />

      {tab === 'kpis' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            <Card><CardBody><p className="text-[0.7rem] uppercase text-slate-500">Conversations</p><p className="mt-1 font-display text-2xl font-bold">{kpis.data?.summary?.conversations || 0}</p></CardBody></Card>
            <Card><CardBody><p className="text-[0.7rem] uppercase text-slate-500">Messages</p><p className="mt-1 font-display text-2xl font-bold">{kpis.data?.summary?.messages || 0}</p></CardBody></Card>
            <Card><CardBody><p className="text-[0.7rem] uppercase text-slate-500">Inbound</p><p className="mt-1 font-display text-2xl font-bold">{kpis.data?.summary?.inbound || 0}</p></CardBody></Card>
            <Card><CardBody><p className="text-[0.7rem] uppercase text-slate-500">Voice notes</p><p className="mt-1 font-display text-2xl font-bold">{kpis.data?.summary?.voice || 0}</p></CardBody></Card>
          </div>
          <ChartFrame title="Daily conversations" description="This account only.">
            <TrendChart
              data={kpis.data?.daily || []}
              series={[
                { key: 'inbound', label: 'Inbound', color: chartColors.brand },
                { key: 'outbound', label: 'Replies', color: chartColors.emerald },
                { key: 'voice', label: 'Voice', color: chartColors.brandLight || chartColors.brand },
              ]}
            />
          </ChartFrame>
        </div>
      )}

      {tab === 'profile' && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <Card>
            <CardHeader icon={UserRound} title="Profile" />
            <CardBody>
              <div className="flex items-center gap-3.5">
                <Avatar name={u.name} size="lg" />
                <div className="min-w-0">
                  <h2 className="truncate font-display text-[1.05rem] font-semibold text-ink-900">{u.name}</h2>
                  <p className="truncate text-[0.8rem] text-slate-500">{u.role}</p>
                </div>
              </div>
              <div className="mt-5 divide-y divide-slate-100">
                <Row label="Email"><span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />{u.email}</span></Row>
                <Row label="Phone"><span className="inline-flex items-center gap-1.5"><Phone className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />{u.phone}</span></Row>
                <Row label="Business">
                  <Link to={`/businesses/${u.businessId}`} className="inline-flex items-center gap-1.5 text-brand-600 hover:underline">
                    <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
                    {u.business}
                  </Link>
                </Row>
                <Row label="Role">{u.role}</Row>
                <Row label="Status"><StatusBadge status={u.status} /></Row>
                <Row label="Created">{formatDate(u.createdAt)}</Row>
                <Row label="Last login">{u.lastLogin ? formatDateTime(u.lastLogin) : 'Never'}</Row>
              </div>
            </CardBody>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader icon={Building2} title="Subscription" />
              <CardBody className="divide-y divide-slate-100 py-0">
                {subscription.data ? (
                  <>
                    <Row label="Plan">{subscription.data.plan}</Row>
                    <Row label="Status"><StatusBadge status={subscription.data.status} /></Row>
                    <Row label="Renews">{formatDate(subscription.data.renewalDate)}</Row>
                  </>
                ) : (
                  <p className="py-4 text-[0.84rem] text-slate-500">No subscription found for this business.</p>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader icon={MessagesSquare} title="Recent business activity" description="Conversations and calls handled for this business." />
              <CardBody className="p-0">
                <ul className="divide-y divide-slate-100">
                  {userConversations.map((c) => (
                    <li key={c.id} className="flex items-center justify-between gap-3 px-5 py-2.5">
                      <span className="min-w-0 truncate text-[0.82rem] text-slate-600">{c.customer}</span>
                      <span className="shrink-0 text-[0.72rem] text-slate-400">{timeAgo(c.at)}</span>
                    </li>
                  ))}
                  {userCalls.map((c) => (
                    <li key={c.id} className="flex items-center justify-between gap-3 px-5 py-2.5">
                      <span className="min-w-0 truncate text-[0.82rem] text-slate-600">Call · {c.customer}</span>
                      <span className="shrink-0 text-[0.72rem] text-slate-400">{formatDuration(c.duration)}</span>
                    </li>
                  ))}
                  {!userConversations.length && !userCalls.length && (
                    <li className="px-5 py-6 text-center text-[0.82rem] text-slate-500">No activity recorded.</li>
                  )}
                </ul>
              </CardBody>
            </Card>
          </div>
        </div>
      )}

      {tab === 'activity' && (
        <Card>
          <CardHeader icon={CalendarDays} title="Administrative activity" description="Actions taken on this account by administrators." />
          <CardBody className="p-0">
            {userAudit.length === 0 && <EmptyState compact icon={CalendarDays} title="No admin activity recorded" description="No administrator has changed this account." />}
            <ul className="divide-y divide-slate-100">
              {userAudit.map((l) => (
                <li key={l.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="text-[0.85rem] font-semibold text-ink-900">{l.action}</p>
                    <p className="truncate text-[0.75rem] text-slate-500">{l.detail}</p>
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

      {tab === 'security' && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <Card>
            <CardHeader icon={History} title="Login history" />
            <CardBody className="p-0">
              <ul className="divide-y divide-slate-100">
                {(history.data || []).map((h) => (
                  <li key={h.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                    <div className="min-w-0">
                      <p className="text-[0.84rem] font-semibold text-ink-900">{h.device}</p>
                      <p className="text-[0.74rem] text-slate-500">{h.location} · {formatDateTime(h.at)}</p>
                    </div>
                    <StatusBadge status={h.result} />
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader icon={KeyRound} title="Account security" />
            <CardBody className="divide-y divide-slate-100 py-0">
              <Row label="Two-factor authentication">
                <Badge tone={u.twoFactor ? 'success' : 'warning'} size="sm">{u.twoFactor ? 'Enabled' : 'Disabled'}</Badge>
              </Row>
              <Row label="Account status"><StatusBadge status={u.status} /></Row>
              <Row label="Password">Never shown — reset only</Row>
            </CardBody>
          </Card>
        </div>
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
                  notes.setData(await userService.addNote(id, newNote.trim(), admin?.name))
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

      <ConfirmDialog
        open={Boolean(statusChange)}
        onClose={() => setStatusChange(null)}
        onConfirm={applyStatus}
        loading={busy}
        tone={statusChange === 'Active' ? 'primary' : 'danger'}
        title={statusChange === 'Active' ? `Activate ${u.name}?` : `${statusChange} ${u.name}?`}
        description={statusChange === 'Active' ? 'The user regains access immediately.' : 'The user is signed out and cannot sign in again.'}
        warning={statusChange !== 'Active' ? 'This will immediately restrict access.' : undefined}
        confirmLabel={statusChange === 'Active' ? 'Activate user' : `${statusChange} user`}
      >
        {statusChange !== 'Active' && (
          <Select
            label="Reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
            options={['', 'Left the company', 'Suspicious activity', 'Abuse investigation', 'Customer request', 'Other'].map((o) => ({ value: o, label: o || 'Choose a reason…' }))}
          />
        )}
      </ConfirmDialog>
    </>
  )
}
