import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, KeyRound, Lock, LogOut, ScrollText, ShieldAlert, ShieldCheck } from 'lucide-react'
import { exportCsv, formatDateTime, timeAgo } from '../../lib/utils'
import PageHeader from '../../components/layout/PageHeader'
import { Card, CardBody, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge, { StatusBadge } from '../../components/ui/Badge'
import DataTable from '../../components/ui/DataTable'
import FilterBar from '../../components/ui/FilterBar'
import Modal, { ConfirmDialog } from '../../components/ui/Modal'
import { EmptyState, ErrorState } from '../../components/ui/States'
import { useAsync, useTable } from '../../hooks'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import { auditService } from '../../services/platformService'
import adminService from '../../services/adminService'
import authService from '../../services/authService'

/* -------------------------------------------------------------- Audit log --- */

export function AuditLogs() {
  const logs = useAsync(() => auditService.list(), [])
  const admins = useAsync(() => adminService.list(), [])
  const [viewing, setViewing] = useState(null)

  const table = useTable(logs.data || [], {
    pageSize: 12,
    initialSort: { key: 'at', direction: 'desc' },
    searchFields: ['admin', 'action', 'resourceName', 'detail'],
  })

  const columns = [
    { key: 'admin', header: 'Admin', sortable: true, primary: true, render: (row) => <span className="font-semibold text-ink-900">{row.admin}</span> },
    { key: 'action', header: 'Action', sortable: true },
    { key: 'resource', header: 'Resource', sortable: true, render: (row) => <Badge tone="neutral" size="sm">{row.resource}</Badge> },
    { key: 'resourceName', header: 'Target', render: (row) => <span className="truncate text-slate-600">{row.resourceName || '—'}</span> },
    { key: 'ip', header: 'IP address', hideOnMobile: true, render: (row) => <span className="font-mono text-[0.76rem] text-slate-500">{row.ip}</span> },
    { key: 'result', header: 'Result', sortable: true, render: (row) => <StatusBadge status={row.result} /> },
    { key: 'at', header: 'When', sortable: true, render: (row) => formatDateTime(row.at) },
  ]

  return (
    <>
      <PageHeader
        title="Audit logs"
        description="Every administrative action on the platform, and who performed it."
        badge={logs.data && <Badge tone="brand">{logs.data.length} entries</Badge>}
      />

      <FilterBar
        table={table}
        searchPlaceholder="Search admin, action or target…"
        filters={[
          { key: 'admin', label: 'Admins', options: (admins.data || []).map((a) => a.name) },
          { key: 'resource', label: 'Resources', options: ['Business', 'User', 'Admin', 'Subscription', 'Plan', 'Payment', 'Channel', 'AI agent', 'Settings', 'System'] },
          { key: 'result', label: 'Results', options: ['Success', 'Blocked'] },
        ]}
        onExport={() =>
          exportCsv('audit-logs.csv', table.filteredRows, [
            { header: 'Admin', value: (r) => r.admin },
            { header: 'Action', value: (r) => r.action },
            { header: 'Resource', value: (r) => r.resource },
            { header: 'Target', value: (r) => r.resourceName },
            { header: 'IP', value: (r) => r.ip },
            { header: 'Result', value: (r) => r.result },
            { header: 'When', value: (r) => formatDateTime(r.at) },
          ])
        }
      />

      <DataTable
        columns={columns}
        table={table}
        loading={logs.loading}
        error={logs.error}
        onRetry={logs.reload}
        onRowClick={(row) => setViewing(row)}
        empty={<EmptyState icon={ScrollText} title="No admin activity recorded" description="Administrative actions will appear here as they happen." />}
      />

      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} title={viewing?.action} description={viewing && formatDateTime(viewing.at)} size="md">
        {viewing && (
          <dl className="divide-y divide-slate-100">
            {[
              ['Admin', viewing.admin],
              ['Action', viewing.action],
              ['Resource type', viewing.resource],
              ['Resource ID', viewing.resourceId || '—'],
              ['Target', viewing.resourceName || '—'],
              ['IP address', viewing.ip],
              ['Result', <StatusBadge key="r" status={viewing.result} />],
              ['Detail', viewing.detail || '—'],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 py-2.5">
                <dt className="text-[0.82rem] text-slate-500">{label}</dt>
                <dd className="max-w-[60%] text-right text-[0.84rem] font-medium text-ink-900">{value}</dd>
              </div>
            ))}
          </dl>
        )}
      </Modal>
    </>
  )
}

/* --------------------------------------------------------- Security centre --- */

export function SecurityCentre() {
  const toast = useToast()
  const { admin, can } = useAuth()
  const sessions = useAsync(() => adminService.getSessions(), [])
  const events = useAsync(() => auditService.getSecurityEvents(), [])
  const attempts = useAsync(() => authService.getLoginAttempts(), [])
  const admins = useAsync(() => adminService.list(), [])
  const [confirm, setConfirm] = useState(null)
  const [busy, setBusy] = useState(false)

  if (sessions.error) {
    return (
      <Card>
        <ErrorState onRetry={sessions.reload} />
      </Card>
    )
  }

  const failed = (attempts.data || []).filter((a) => a.result !== 'Success')
  const without2fa = (admins.data || []).filter((a) => !a.twoFactor && a.status === 'Active')

  return (
    <>
      <PageHeader title="Security centre" description="Sessions, sign-in attempts and anything that looks unusual." />

      {(failed.length > 0 || without2fa.length > 0) && (
        <div className="mb-4 space-y-3">
          {failed.length > 0 && (
            <div className="flex items-start gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" aria-hidden="true" />
              <p className="text-[0.85rem] leading-relaxed text-rose-900">
                {failed.length} failed or blocked sign-in {failed.length === 1 ? 'attempt' : 'attempts'} recorded. Review them below.
              </p>
            </div>
          )}
          {without2fa.length > 0 && (
            <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
              <p className="text-[0.85rem] leading-relaxed text-amber-900">
                {without2fa.map((a) => a.name).join(', ')} {without2fa.length === 1 ? 'does' : 'do'} not have two-factor authentication enabled.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <Card>
            <CardHeader icon={ShieldCheck} title="Active admin sessions" description="Every device currently signed in to the console." />
            <CardBody className="p-0">
              {sessions.data?.length === 0 && <EmptyState compact icon={ShieldCheck} title="No active sessions" description="Nobody is signed in." />}
              <ul className="divide-y divide-slate-100">
                {(sessions.data || []).map((s) => (
                  <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-[0.85rem] font-semibold text-ink-900">
                        {s.device}
                        {s.current && <Badge tone="success" size="sm">This device</Badge>}
                      </p>
                      <p className="text-[0.74rem] text-slate-500">{s.location} · {s.ip} · {timeAgo(s.lastActive)}</p>
                    </div>
                    {!s.current && (
                      <Button variant="dangerGhost" size="xs" disabled={!can('system.security')} onClick={() => setConfirm({ type: 'revoke', session: s })}>
                        Revoke
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader icon={AlertTriangle} title="Security events" description="Permission changes, new admins and unusual activity." />
            <CardBody className="p-0">
              <ul className="divide-y divide-slate-100">
                {(events.data || []).map((e) => (
                  <li key={e.id} className="flex flex-wrap items-start justify-between gap-3 px-5 py-3.5">
                    <div className="min-w-0">
                      <p className="text-[0.85rem] font-semibold text-ink-900">{e.type}</p>
                      <p className="truncate text-[0.76rem] text-slate-500">{e.detail}</p>
                      <p className="mt-0.5 text-[0.7rem] text-slate-400">{e.admin} · {e.ip} · {formatDateTime(e.at)}</p>
                    </div>
                    <Badge tone={e.severity === 'High' ? 'danger' : e.severity === 'Medium' ? 'warning' : 'neutral'} size="sm">
                      {e.severity}
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader icon={KeyRound} title="Sign-in attempts" />
            <CardBody className="p-0">
              <ul className="divide-y divide-slate-100">
                {(attempts.data || []).map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-[0.83rem] font-semibold text-ink-900">{a.email}</p>
                      <p className="text-[0.73rem] text-slate-500">{a.device} · {a.ip}</p>
                      <p className="text-[0.7rem] text-slate-400">{formatDateTime(a.at)}</p>
                    </div>
                    <StatusBadge status={a.result} />
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader icon={Lock} title="Admin security posture" />
            <CardBody className="p-0">
              <ul className="divide-y divide-slate-100">
                {(admins.data || []).map((a) => (
                  <li key={a.id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <Link to={`/admins/${a.id}`} className="min-w-0 truncate text-[0.83rem] font-medium text-ink-900 hover:text-brand-600">
                      {a.name}
                    </Link>
                    <div className="flex items-center gap-2">
                      <Badge tone={a.twoFactor ? 'success' : 'warning'} size="sm">2FA {a.twoFactor ? 'on' : 'off'}</Badge>
                      <StatusBadge status={a.status} />
                    </div>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                disabled={!can('system.security')}
                onClick={() => setConfirm({ type: 'revokeAll' })}
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                Revoke all other admin sessions
              </Button>
              <p className="mt-2.5 text-center text-[0.72rem] text-slate-400">Everyone except you will have to sign in again.</p>
            </CardBody>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        onConfirm={async () => {
          setBusy(true)
          try {
            if (confirm.type === 'revoke') {
              sessions.setData(await adminService.revokeSession(confirm.session.id, admin?.name))
              toast.success('Session revoked.')
            } else {
              for (const s of (sessions.data || []).filter((x) => !x.current)) {
                // eslint-disable-next-line no-await-in-loop
                sessions.setData(await adminService.revokeSession(s.id, admin?.name))
              }
              toast.success('All other sessions revoked.')
            }
            setConfirm(null)
          } finally {
            setBusy(false)
          }
        }}
        loading={busy}
        title={confirm?.type === 'revoke' ? 'Revoke this session?' : 'Revoke all other sessions?'}
        description={confirm?.type === 'revoke' ? 'That device will be signed out immediately.' : 'Every administrator except you will be signed out.'}
        warning="Anyone signed out will need to authenticate again."
        confirmLabel="Revoke"
      />
    </>
  )
}
