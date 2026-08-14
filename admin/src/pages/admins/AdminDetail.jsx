import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Ban, CheckCircle2, History, Save, ShieldCheck, Trash2, UserRound } from 'lucide-react'
import { formatDate, formatDateTime, timeAgo } from '../../lib/utils'
import PageHeader from '../../components/layout/PageHeader'
import { Card, CardBody, CardFooter, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge, { StatusBadge } from '../../components/ui/Badge'
import { ConfirmDialog } from '../../components/ui/Modal'
import { Select } from '../../components/ui/Field'
import { EmptyState, ErrorState } from '../../components/ui/States'
import { SkeletonDetail } from '../../components/ui/Skeleton'
import { Avatar, Tabs } from '../../components/ui/Misc'
import PermissionMatrix from '../../components/security/PermissionMatrix'
import { useAsync } from '../../hooks'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import adminService from '../../services/adminService'
import authService from '../../services/authService'
import { auditService } from '../../services/platformService'
import { roles, roleById } from '../../config/permissions'

const tabs = [
  { id: 'profile', label: 'Profile', icon: UserRound },
  { id: 'permissions', label: 'Permissions', icon: ShieldCheck },
  { id: 'activity', label: 'Activity', icon: History },
  { id: 'sessions', label: 'Sessions', icon: ShieldCheck },
]

function Row({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="text-[0.82rem] text-slate-500">{label}</span>
      <span className="min-w-0 text-right text-[0.84rem] font-medium text-ink-900">{children}</span>
    </div>
  )
}

export default function AdminDetail() {
  const { id } = useParams()
  const toast = useToast()
  const { admin: actor, can } = useAuth()

  const [tab, setTab] = useState('profile')
  const [roleId, setRoleId] = useState(null)
  const [permissions, setPermissions] = useState([])
  const [statusChange, setStatusChange] = useState(null)
  const [busy, setBusy] = useState(false)

  const record = useAsync(() => adminService.get(id), [id])
  const sessions = useAsync(() => adminService.getSessions(id), [id])
  const attempts = useAsync(() => authService.getLoginAttempts(), [])
  const audit = useAsync(() => auditService.list(), [])

  useEffect(() => {
    if (record.data) {
      setRoleId(record.data.roleId)
      setPermissions(record.data.permissions)
    }
  }, [record.data])

  if (record.error) {
    return (
      <Card>
        <ErrorState onRetry={record.reload} />
      </Card>
    )
  }
  if (record.loading || !roleId) return <SkeletonDetail />
  if (!record.data) {
    return (
      <Card>
        <EmptyState icon={ShieldCheck} title="Administrator not found" description="This account may have been deleted." action={<Button as={Link} to="/admins" size="sm">Back to admins</Button>} />
      </Card>
    )
  }

  const a = record.data
  const isSuper = a.roleId === 'super-admin'
  const adminAudit = (audit.data || []).filter((l) => l.admin === a.name || l.resourceId === a.id)
  const adminAttempts = (attempts.data || []).filter((x) => x.email === a.email)

  const savePermissions = async () => {
    setBusy(true)
    try {
      record.setData(await adminService.update(id, { roleId, permissions }, actor?.name))
      toast.success('Permissions updated.')
    } finally {
      setBusy(false)
    }
  }

  const pickRole = (nextRoleId) => {
    setRoleId(nextRoleId)
    if (nextRoleId !== 'custom') setPermissions(roleById(nextRoleId).permissions)
  }

  return (
    <>
      <PageHeader
        title={a.name}
        breadcrumbs={[{ label: 'Admins', to: '/admins' }, { label: a.name }]}
        description={a.email}
        badge={
          <span className="flex flex-wrap items-center gap-2">
            <StatusBadge status={a.status} />
            <Badge tone={isSuper ? 'brand' : 'neutral'} size="sm">
              <ShieldCheck className="h-3 w-3" aria-hidden="true" />
              {a.role}
            </Badge>
          </span>
        }
        actions={
          <>
            {a.status === 'Active' ? (
              <Button variant="secondary" size="sm" disabled={isSuper || !can('system.admins')} onClick={() => setStatusChange('Suspended')}>
                <Ban className="h-3.5 w-3.5" aria-hidden="true" />
                Suspend
              </Button>
            ) : (
              <Button size="sm" disabled={!can('system.admins')} onClick={() => setStatusChange('Active')}>
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                Activate
              </Button>
            )}
          </>
        }
      />

      <Tabs tabs={tabs} value={tab} onChange={setTab} className="mb-5" size="sm" />

      {tab === 'profile' && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <Card>
            <CardHeader icon={UserRound} title="Profile" />
            <CardBody>
              <div className="flex items-center gap-3.5">
                <Avatar name={a.name} size="lg" />
                <div className="min-w-0">
                  <h2 className="truncate font-display text-[1.05rem] font-semibold text-ink-900">{a.name}</h2>
                  <p className="truncate text-[0.8rem] text-slate-500">{a.role}</p>
                </div>
              </div>
              <div className="mt-5 divide-y divide-slate-100">
                <Row label="Email">{a.email}</Row>
                <Row label="Role">{a.role}</Row>
                <Row label="Status"><StatusBadge status={a.status} /></Row>
                <Row label="Two-factor"><Badge tone={a.twoFactor ? 'success' : 'warning'} size="sm">{a.twoFactor ? 'Enabled' : 'Disabled'}</Badge></Row>
                <Row label="Permissions">{isSuper ? 'All permissions' : `${a.permissions.length} granted`}</Row>
                <Row label="Created">{formatDate(a.createdAt)}</Row>
                <Row label="Last login">{a.lastLogin ? formatDateTime(a.lastLogin) : 'Never'}</Row>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader icon={History} title="Recent sign-in attempts" />
            <CardBody className="p-0">
              {adminAttempts.length === 0 && <EmptyState compact icon={History} title="No sign-in attempts" description="Nothing recorded for this account." />}
              <ul className="divide-y divide-slate-100">
                {adminAttempts.map((x) => (
                  <li key={x.id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <div className="min-w-0">
                      <p className="text-[0.83rem] font-semibold text-ink-900">{x.device}</p>
                      <p className="text-[0.73rem] text-slate-500">{x.ip} · {formatDateTime(x.at)}</p>
                    </div>
                    <StatusBadge status={x.result} />
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>
      )}

      {tab === 'permissions' && (
        <Card>
          <CardHeader
            icon={ShieldCheck}
            title="Role and permissions"
            description={isSuper ? 'Super Admins always hold every permission.' : 'Change the role preset, or switch to Custom Admin to fine-tune.'}
            action={<Badge tone="brand" size="sm">{permissions.length} selected</Badge>}
          />
          <CardBody className="space-y-5">
            <Select
              label="Role"
              value={roleId}
              onChange={(e) => pickRole(e.target.value)}
              disabled={isSuper || !can('system.admins')}
              options={roles.map((r) => ({ value: r.id, label: r.name }))}
            />
            <PermissionMatrix
              value={permissions}
              onChange={setPermissions}
              readOnly={isSuper || roleId !== 'custom' || !can('system.admins')}
            />
          </CardBody>
          <CardFooter>
            <Button size="sm" loading={busy} onClick={savePermissions} disabled={isSuper || !can('system.admins')}>
              <Save className="h-3.5 w-3.5" aria-hidden="true" />
              Save permissions
            </Button>
          </CardFooter>
        </Card>
      )}

      {tab === 'activity' && (
        <Card>
          <CardHeader icon={History} title="Admin activity" description="Everything this administrator has done." />
          <CardBody className="p-0">
            {adminAudit.length === 0 && <EmptyState compact icon={History} title="No admin activity recorded" description="This administrator has not made any changes." />}
            <ul className="divide-y divide-slate-100">
              {adminAudit.map((l) => (
                <li key={l.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="text-[0.85rem] font-semibold text-ink-900">{l.action}</p>
                    <p className="truncate text-[0.75rem] text-slate-500">{l.resourceName}{l.detail ? ` — ${l.detail}` : ''}</p>
                  </div>
                  <p className="shrink-0 text-[0.72rem] text-slate-400">{formatDateTime(l.at)}</p>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}

      {tab === 'sessions' && (
        <Card>
          <CardHeader icon={ShieldCheck} title="Active sessions" description="Where this administrator is currently signed in." />
          <CardBody className="p-0">
            {sessions.data?.length === 0 && <EmptyState compact icon={ShieldCheck} title="No active sessions" description="This administrator is not signed in anywhere." />}
            <ul className="divide-y divide-slate-100">
              {(sessions.data || []).map((s) => (
                <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-[0.85rem] font-semibold text-ink-900">
                      {s.device}
                      {s.current && <Badge tone="success" size="sm">Current</Badge>}
                    </p>
                    <p className="text-[0.74rem] text-slate-500">{s.location} · {s.ip} · {timeAgo(s.lastActive)}</p>
                  </div>
                  <Button
                    variant="dangerGhost"
                    size="xs"
                    disabled={!can('system.security')}
                    onClick={async () => {
                      sessions.setData(await adminService.revokeSession(s.id, actor?.name))
                      toast.success('Session revoked.')
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Revoke
                  </Button>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}

      <ConfirmDialog
        open={Boolean(statusChange)}
        onClose={() => setStatusChange(null)}
        onConfirm={async () => {
          setBusy(true)
          try {
            record.setData(await adminService.setStatus(id, statusChange, actor?.name))
            toast.success(`${a.name} ${statusChange === 'Active' ? 'activated' : 'suspended'}.`)
            setStatusChange(null)
          } finally {
            setBusy(false)
          }
        }}
        loading={busy}
        tone={statusChange === 'Active' ? 'primary' : 'danger'}
        title={`${statusChange === 'Active' ? 'Activate' : 'Suspend'} ${a.name}?`}
        description={statusChange === 'Active' ? 'They regain access to the admin console.' : 'They are signed out and cannot sign in again.'}
        warning={statusChange !== 'Active' ? 'Active sessions are revoked immediately.' : undefined}
        confirmLabel={statusChange === 'Active' ? 'Activate' : 'Suspend'}
      />
    </>
  )
}
