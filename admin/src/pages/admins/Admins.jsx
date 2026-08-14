import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Ban, CheckCircle2, Eye, MoreHorizontal, Plus, ShieldCheck, Trash2 } from 'lucide-react'
import { exportCsv, formatDate, timeAgo } from '../../lib/utils'
import PageHeader from '../../components/layout/PageHeader'
import Button from '../../components/ui/Button'
import Badge, { StatusBadge } from '../../components/ui/Badge'
import DataTable from '../../components/ui/DataTable'
import FilterBar from '../../components/ui/FilterBar'
import { ConfirmDialog } from '../../components/ui/Modal'
import { EmptyState } from '../../components/ui/States'
import { Avatar, Dropdown, DropdownDivider, DropdownItem } from '../../components/ui/Misc'
import { useAsync, useTable } from '../../hooks'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import adminService from '../../services/adminService'
import { roles } from '../../config/permissions'

export default function Admins() {
  const toast = useToast()
  const navigate = useNavigate()
  const { admin, can } = useAuth()
  const admins = useAsync(() => adminService.list(), [])

  const table = useTable(admins.data || [], {
    pageSize: 10,
    initialSort: { key: 'name', direction: 'asc' },
    searchFields: ['name', 'email', 'role'],
  })

  const [statusChange, setStatusChange] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)

  const columns = [
    {
      key: 'name',
      header: 'Administrator',
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
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      render: (row) => (
        <Badge tone={row.roleId === 'super-admin' ? 'brand' : 'neutral'} size="sm">
          <ShieldCheck className="h-3 w-3" aria-hidden="true" />
          {row.role}
        </Badge>
      ),
    },
    {
      key: 'permissions',
      header: 'Permissions',
      render: (row) => <span className="text-slate-500">{row.roleId === 'super-admin' ? 'All permissions' : `${row.permissions.length} granted`}</span>,
    },
    { key: 'status', header: 'Status', sortable: true, render: (row) => <StatusBadge status={row.status} /> },
    { key: 'twoFactor', header: '2FA', hideOnMobile: true, render: (row) => <Badge tone={row.twoFactor ? 'success' : 'warning'} size="sm">{row.twoFactor ? 'On' : 'Off'}</Badge> },
    { key: 'lastLogin', header: 'Last login', sortable: true, render: (row) => (row.lastLogin ? timeAgo(row.lastLogin) : 'Never') },
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
            <DropdownItem as={Link} to={`/admins/${row.id}`} icon={Eye}>
              View & edit permissions
            </DropdownItem>
            <DropdownDivider />
            {row.status === 'Active' ? (
              <DropdownItem icon={Ban} tone="danger" disabled={row.roleId === 'super-admin'} onClick={() => setStatusChange({ row, status: 'Suspended' })}>
                Suspend
              </DropdownItem>
            ) : (
              <DropdownItem icon={CheckCircle2} onClick={() => setStatusChange({ row, status: 'Active' })}>
                Activate
              </DropdownItem>
            )}
            <DropdownItem icon={Trash2} tone="danger" disabled={row.roleId === 'super-admin'} onClick={() => setDeleting(row)}>
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
        title="Administrators"
        description="Who can administer the platform, and exactly what each of them can do."
        badge={admins.data && <Badge tone="brand">{admins.data.length} admins</Badge>}
        actions={
          can('system.admins') && (
            <Button size="sm" onClick={() => navigate('/admins/create')}>
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              Create admin
            </Button>
          )
        }
      />

      <FilterBar
        table={table}
        searchPlaceholder="Search name, email or role…"
        filters={[
          { key: 'role', label: 'Roles', options: roles.map((r) => r.name) },
          { key: 'status', label: 'Statuses', options: ['Active', 'Suspended', 'Invited'] },
        ]}
        onExport={() =>
          exportCsv('admins.csv', table.filteredRows, [
            { header: 'Name', value: (r) => r.name },
            { header: 'Email', value: (r) => r.email },
            { header: 'Role', value: (r) => r.role },
            { header: 'Permissions', value: (r) => r.permissions.length },
            { header: 'Status', value: (r) => r.status },
          ])
        }
      />

      <DataTable
        columns={columns}
        table={table}
        loading={admins.loading}
        error={admins.error}
        onRetry={admins.reload}
        onRowClick={(row) => navigate(`/admins/${row.id}`)}
        empty={<EmptyState icon={ShieldCheck} title="No administrators found" description="Create the first sub-admin to share the workload." action={<Button size="sm" onClick={() => navigate('/admins/create')}>Create admin</Button>} />}
      />

      <ConfirmDialog
        open={Boolean(statusChange)}
        onClose={() => setStatusChange(null)}
        onConfirm={async () => {
          setBusy(true)
          try {
            const updated = await adminService.setStatus(statusChange.row.id, statusChange.status, admin?.name)
            admins.setData(admins.data.map((a) => (a.id === updated.id ? updated : a)))
            toast.success(`${statusChange.row.name} ${statusChange.status === 'Active' ? 'activated' : 'suspended'}.`)
            setStatusChange(null)
          } finally {
            setBusy(false)
          }
        }}
        loading={busy}
        tone={statusChange?.status === 'Active' ? 'primary' : 'danger'}
        title={`${statusChange?.status === 'Active' ? 'Activate' : 'Suspend'} ${statusChange?.row.name}?`}
        description={statusChange?.status === 'Active' ? 'They regain access to the admin console.' : 'They are signed out of the console and cannot sign in again.'}
        warning={statusChange?.status !== 'Active' ? 'Active sessions are revoked immediately.' : undefined}
        confirmLabel={statusChange?.status === 'Active' ? 'Activate' : 'Suspend'}
      />

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          setBusy(true)
          try {
            admins.setData(await adminService.remove(deleting.id, admin?.name))
            toast.success('Administrator deleted.')
            setDeleting(null)
          } finally {
            setBusy(false)
          }
        }}
        loading={busy}
        title={`Delete ${deleting?.name}?`}
        description="Their console access is removed permanently. The audit trail of their past actions is kept."
        warning="This cannot be undone."
        confirmLabel="Delete admin"
        confirmPhrase={deleting?.email}
      />
    </>
  )
}
