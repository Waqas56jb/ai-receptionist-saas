import { useState } from 'react'
import { Mail, Plus, Trash2, UsersRound } from 'lucide-react'
import PageHeader from '../../../components/layout/PageHeader'
import { Card, CardBody, CardHeader } from '../../../components/ui/Card'
import DataTable from '../../../components/ui/DataTable'
import Badge, { StatusBadge } from '../../../components/ui/Badge'
import Avatar from '../../../components/ui/Avatar'
import Button from '../../../components/ui/Button'
import Modal, { ConfirmDialog } from '../../../components/ui/Modal'
import { Input, Select } from '../../../components/ui/Field'
import { EmptyState } from '../../../components/ui/States'
import useAsync from '../../../hooks/useAsync'
import { useToast } from '../../../context/ToastContext'
import businessService from '../../../services/businessService'
import { timeAgo } from '../../../lib/format'

export default function Team() {
  const toast = useToast()
  const team = useAsync(() => businessService.getTeam(), [])
  const reference = useAsync(() => businessService.getReferenceData(), [])

  const [inviting, setInviting] = useState(false)
  const [draft, setDraft] = useState({ name: '', email: '', role: 'Agent / Staff' })
  const [removing, setRemoving] = useState(null)
  const [busy, setBusy] = useState(false)

  const roles = (reference.data?.teamRoles || []).map((r) => r.value)

  const invite = async () => {
    if (!draft.name.trim() || !draft.email.trim()) return
    setBusy(true)
    try {
      team.setData(await businessService.inviteMember(draft))
      setInviting(false)
      setDraft({ name: '', email: '', role: 'Agent / Staff' })
      toast.success('Invitation sent.')
    } finally {
      setBusy(false)
    }
  }

  const columns = [
    {
      key: 'name',
      header: 'Member',
      primary: true,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.name} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-semibold text-ink-900">{row.name}</p>
            <p className="truncate text-[0.75rem] text-slate-500">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      render: (row) => (
        <Select
          options={roles}
          value={row.role}
          disabled={row.role === 'Owner'}
          onChange={async (e) => {
            team.setData(await businessService.updateMember(row.id, { role: e.target.value }))
            toast.success('Role updated.')
          }}
          aria-label={`Role for ${row.name}`}
          className="w-40"
        />
      ),
    },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} size="sm" /> },
    { key: 'lastActive', header: 'Last active', render: (row) => (row.lastActive ? timeAgo(row.lastActive) : 'Never') },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (row) =>
        row.role === 'Owner' ? (
          <span className="text-[0.72rem] text-slate-400">Owner</span>
        ) : (
          <button
            type="button"
            onClick={() => setRemoving(row)}
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
            aria-label={`Remove ${row.name}`}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Team"
        description="Invite colleagues and decide what each of them can see and change."
        badge={team.data && <Badge tone="brand">{team.data.length} members</Badge>}
        actions={
          <Button as="button" size="sm" onClick={() => setInviting(true)}>
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Invite member
          </Button>
        }
      />

      <DataTable
        columns={columns}
        rows={team.data || []}
        loading={team.loading}
        error={team.error}
        onRetry={team.reload}
        empty={
          <EmptyState
            icon={UsersRound}
            title="No team members yet"
            description="Invite the people who will handle conversations with you."
            action={
              <Button as="button" size="sm" onClick={() => setInviting(true)}>
                Invite member
              </Button>
            }
          />
        }
      />

      <Card className="mt-4">
        <CardHeader title="What each role can do" />
        <CardBody>
          <ul className="space-y-3">
            {(reference.data?.teamRoles || []).map((role) => (
              <li key={role.value} className="flex flex-wrap items-start gap-3 rounded-xl border border-slate-200 p-3.5">
                <Badge tone="neutral">{role.value}</Badge>
                <p className="min-w-0 flex-1 text-[0.83rem] leading-relaxed text-slate-600">{role.description}</p>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>

      <Modal
        open={inviting}
        onClose={() => setInviting(false)}
        title="Invite a team member"
        description="They will receive an email invitation to join this business."
        footer={
          <>
            <Button as="button" variant="ghost" size="sm" onClick={() => setInviting(false)}>
              Cancel
            </Button>
            <Button as="button" size="sm" loading={busy} onClick={invite}>
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              Send invitation
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Full name" value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} required />
          <Input label="Email" type="email" value={draft.email} onChange={(e) => setDraft((d) => ({ ...d, email: e.target.value }))} required />
          <Select label="Role" options={roles} value={draft.role} onChange={(e) => setDraft((d) => ({ ...d, role: e.target.value }))} />
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(removing)}
        onClose={() => setRemoving(null)}
        onConfirm={async () => {
          team.setData(await businessService.removeMember(removing.id))
          setRemoving(null)
          toast.success('Team member removed.')
        }}
        title="Remove this team member?"
        description={`${removing?.name} will lose access to this business immediately.`}
        confirmLabel="Remove"
      />
    </>
  )
}
