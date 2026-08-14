import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Ban, CheckCircle2, Eye, KeyRound, MoreHorizontal, ShieldOff, Trash2, Users as UsersIcon } from 'lucide-react'
import { exportCsv, formatDate, timeAgo } from '../../lib/utils'
import PageHeader from '../../components/layout/PageHeader'
import Button from '../../components/ui/Button'
import Badge, { StatusBadge } from '../../components/ui/Badge'
import DataTable from '../../components/ui/DataTable'
import FilterBar from '../../components/ui/FilterBar'
import { ConfirmDialog } from '../../components/ui/Modal'
import { Select, Textarea } from '../../components/ui/Field'
import { EmptyState } from '../../components/ui/States'
import { Avatar, Dropdown, DropdownDivider, DropdownItem } from '../../components/ui/Misc'
import { useAsync, useTable } from '../../hooks'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import userService from '../../services/userService'
import businessService from '../../services/businessService'
import { userRoles, userStatuses } from '../../data/mock/users'

export default function Users() {
  const toast = useToast()
  const navigate = useNavigate()
  const { admin, can } = useAuth()
  const users = useAsync(() => userService.list(), [])
  const businesses = useAsync(() => businessService.list(), [])

  const table = useTable(users.data || [], {
    pageSize: 10,
    initialSort: { key: 'name', direction: 'asc' },
    searchFields: ['name', 'email', 'phone', 'business'],
  })

  const [statusChange, setStatusChange] = useState(null) // { row, status }
  const [bulkAction, setBulkAction] = useState(null)
  const [reason, setReason] = useState('')
  const [note, setNote] = useState('')
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)

  const applyStatus = async () => {
    const needsReason = statusChange.status !== 'Active'
    if (needsReason && !reason.trim()) return
    setBusy(true)
    try {
      const updated = await userService.setStatus(statusChange.row.id, statusChange.status, { reason, note }, admin?.name)
      users.setData(users.data.map((u) => (u.id === updated.id ? updated : u)))
      toast[statusChange.status === 'Active' ? 'success' : 'warning'](
        `${statusChange.row.name} ${statusChange.status === 'Active' ? 'activated' : statusChange.status.toLowerCase()}.`,
      )
      setStatusChange(null)
      setReason('')
      setNote('')
    } finally {
      setBusy(false)
    }
  }

  const columns = [
    {
      key: 'name',
      header: 'Name',
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
      key: 'business',
      header: 'Business',
      sortable: true,
      render: (row) => (
        <Link to={`/businesses/${row.businessId}`} onClick={(e) => e.stopPropagation()} className="truncate text-brand-600 hover:underline">
          {row.business}
        </Link>
      ),
    },
    { key: 'role', header: 'Role', sortable: true, render: (row) => <Badge tone="neutral" size="sm">{row.role}</Badge> },
    { key: 'status', header: 'Status', sortable: true, render: (row) => <StatusBadge status={row.status} /> },
    { key: 'plan', header: 'Plan', sortable: true, hideOnMobile: true },
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
            <DropdownItem as={Link} to={`/users/${row.id}`} icon={Eye}>
              View profile
            </DropdownItem>
            <DropdownItem
              icon={KeyRound}
              disabled={!can('users.edit')}
              onClick={async () => {
                await userService.resetPassword(row.id, admin?.name)
                toast.success(`Password reset email sent to ${row.email}.`)
              }}
            >
              Reset password
            </DropdownItem>
            <DropdownDivider />
            {row.status === 'Active' ? (
              <>
                <DropdownItem icon={Ban} tone="danger" disabled={!can('users.suspend')} onClick={() => setStatusChange({ row, status: 'Suspended' })}>
                  Suspend
                </DropdownItem>
                <DropdownItem icon={ShieldOff} tone="danger" disabled={!can('users.suspend')} onClick={() => setStatusChange({ row, status: 'Blocked' })}>
                  Block
                </DropdownItem>
              </>
            ) : (
              <DropdownItem icon={CheckCircle2} disabled={!can('users.suspend')} onClick={() => setStatusChange({ row, status: 'Active' })}>
                Activate
              </DropdownItem>
            )}
            <DropdownItem icon={Trash2} tone="danger" disabled={!can('users.delete')} onClick={() => setDeleting(row)}>
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
        title="Users"
        description="Every person with access to a business account on the platform."
        badge={users.data && <Badge tone="brand">{users.data.length} users</Badge>}
      />

      <FilterBar
        table={table}
        searchPlaceholder="Search name, email, phone or business…"
        filters={[
          { key: 'business', label: 'Businesses', options: (businesses.data || []).map((b) => b.name) },
          { key: 'role', label: 'Roles', options: userRoles },
          { key: 'status', label: 'Statuses', options: userStatuses },
          { key: 'plan', label: 'Plans', options: ['Starter', 'Professional', 'Enterprise'] },
        ]}
        onExport={() =>
          exportCsv('users.csv', table.filteredRows, [
            { header: 'Name', value: (r) => r.name },
            { header: 'Email', value: (r) => r.email },
            { header: 'Business', value: (r) => r.business },
            { header: 'Role', value: (r) => r.role },
            { header: 'Status', value: (r) => r.status },
            { header: 'Last login', value: (r) => (r.lastLogin ? formatDate(r.lastLogin) : 'Never') },
          ])
        }
      />

      <DataTable
        columns={columns}
        table={table}
        loading={users.loading}
        error={users.error}
        onRetry={users.reload}
        onRowClick={(row) => navigate(`/users/${row.id}`)}
        selectable
        bulkActions={
          <>
            <Button variant="outline" size="xs" disabled={!can('users.suspend')} onClick={() => setBulkAction('activate')}>
              Activate
            </Button>
            <Button variant="outline" size="xs" disabled={!can('users.suspend')} onClick={() => setBulkAction('block')}>
              Block
            </Button>
            <Button
              variant="outline"
              size="xs"
              onClick={() =>
                exportCsv('users-selection.csv', table.filteredRows.filter((r) => table.selected.includes(r.id)), [
                  { header: 'Name', value: (r) => r.name },
                  { header: 'Email', value: (r) => r.email },
                  { header: 'Business', value: (r) => r.business },
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
            icon={UsersIcon}
            title={table.sourceTotal ? 'No users match those filters' : 'No users found'}
            description={table.sourceTotal ? 'Try clearing a filter or widening your search.' : 'Users appear as businesses invite their teams.'}
            action={table.sourceTotal ? <Button variant="secondary" size="sm" onClick={table.clearFilters}>Clear filters</Button> : undefined}
          />
        }
      />

      <ConfirmDialog
        open={Boolean(statusChange)}
        onClose={() => setStatusChange(null)}
        onConfirm={applyStatus}
        loading={busy}
        tone={statusChange?.status === 'Active' ? 'primary' : 'danger'}
        title={
          statusChange?.status === 'Active'
            ? `Activate ${statusChange?.row.name}?`
            : `${statusChange?.status} ${statusChange?.row.name}?`
        }
        description={
          statusChange?.status === 'Active'
            ? 'The user regains access to their business account immediately.'
            : 'The user is signed out and cannot sign in again until the status is changed.'
        }
        warning={statusChange?.status !== 'Active' ? 'This will immediately restrict access.' : undefined}
        confirmLabel={statusChange?.status === 'Active' ? 'Activate user' : `${statusChange?.status} user`}
      >
        {statusChange?.status !== 'Active' && (
          <>
            <Select
              label="Reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              options={['', 'Left the company', 'Suspicious activity', 'Abuse investigation', 'Customer request', 'Other'].map((o) => ({ value: o, label: o || 'Choose a reason…' }))}
            />
            <Textarea label="Internal note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
          </>
        )}
      </ConfirmDialog>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          setBusy(true)
          try {
            users.setData(await userService.remove(deleting.id, admin?.name))
            toast.success('User deleted.')
            setDeleting(null)
          } finally {
            setBusy(false)
          }
        }}
        loading={busy}
        title={`Delete ${deleting?.name}?`}
        description="The user account is removed. Their conversation history stays with the business."
        warning="This cannot be undone."
        confirmLabel="Delete user"
        confirmPhrase={deleting?.email}
      />

      <ConfirmDialog
        open={Boolean(bulkAction)}
        onClose={() => setBulkAction(null)}
        onConfirm={async () => {
          setBusy(true)
          try {
            users.setData(await userService.bulk(table.selected, bulkAction, admin?.name))
            toast.success(`${table.selected.length} users ${bulkAction === 'block' ? 'blocked' : 'activated'}.`)
            table.setSelected([])
            setBulkAction(null)
          } finally {
            setBusy(false)
          }
        }}
        loading={busy}
        tone={bulkAction === 'block' ? 'danger' : 'primary'}
        title={`${bulkAction === 'block' ? 'Block' : 'Activate'} ${table.selected.length} users?`}
        description={bulkAction === 'block' ? 'Every selected user is signed out and blocked.' : 'Every selected user regains access.'}
        warning={bulkAction === 'block' ? 'This will immediately restrict access for all selected accounts.' : undefined}
        confirmLabel={bulkAction === 'block' ? 'Block all' : 'Activate all'}
      />
    </>
  )
}
