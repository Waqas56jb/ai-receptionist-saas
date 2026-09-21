import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bot, Eye, MoreHorizontal, Pause, Play } from 'lucide-react'
import { channelLabels, exportCsv, formatNumber, timeAgo } from '../../lib/utils'
import PageHeader from '../../components/layout/PageHeader'
import Button from '../../components/ui/Button'
import Badge, { StatusBadge } from '../../components/ui/Badge'
import DataTable from '../../components/ui/DataTable'
import FilterBar from '../../components/ui/FilterBar'
import { ConfirmDialog } from '../../components/ui/Modal'
import { EmptyState } from '../../components/ui/States'
import { Dropdown, DropdownItem } from '../../components/ui/Misc'
import { useAsync, useTable } from '../../hooks'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import { aiService } from '../../services/aiService'

export default function AIAgents() {
  const toast = useToast()
  const navigate = useNavigate()
  const { admin, can } = useAuth()
  const agents = useAsync(() => aiService.listAgents(), [])
  const [statusChange, setStatusChange] = useState(null)
  const [busy, setBusy] = useState(false)

  const table = useTable(agents.data || [], {
    pageSize: 10,
    initialSort: { key: 'business', direction: 'asc' },
    searchFields: ['business', 'name'],
  })

  const columns = [
    {
      key: 'business',
      header: 'Business',
      sortable: true,
      primary: true,
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate font-semibold text-ink-900">{row.business}</p>
          <p className="truncate text-[0.74rem] text-slate-500">{row.name}</p>
        </div>
      ),
    },
    { key: 'status', header: 'Status', sortable: true, render: (row) => <StatusBadge status={row.status} /> },
    { key: 'knowledgeMode', header: 'Knowledge', sortable: true, render: (row) => <Badge tone="neutral" size="sm">{row.knowledgeMode}</Badge> },
    { key: 'promptMode', header: 'Prompt mode', sortable: true, hideOnMobile: true, render: (row) => <Badge tone="neutral" size="sm">{row.promptMode}</Badge> },
    {
      key: 'channels',
      header: 'Channels',
      render: (row) => (row.channels?.length ? <span className="text-slate-500">{channelLabels(row.channels)}</span> : <span className="text-slate-400">None</span>),
    },
    { key: 'aiMinutes', header: 'AI usage', sortable: true, render: (row) => `${formatNumber(row.aiMinutes)} min` },
    { key: 'lastActive', header: 'Last active', sortable: true, render: (row) => timeAgo(row.lastActive) },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (row) => (
        <div onClick={(e) => e.stopPropagation()}>
          <Dropdown
            trigger={({ toggle }) => (
              <button type="button" onClick={toggle} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-ink-900" aria-label={`Actions for ${row.business}`}>
                <MoreHorizontal className="h-4 w-4" />
              </button>
            )}
          >
            <DropdownItem as={Link} to={`/ai-agents/${row.id}`} icon={Eye}>
              Inspect configuration
            </DropdownItem>
            {row.status === 'Online' ? (
              <DropdownItem icon={Pause} tone="danger" disabled={!can('ai.manageSettings')} onClick={() => setStatusChange({ row, status: 'Paused' })}>
                Disable agent
              </DropdownItem>
            ) : (
              <DropdownItem icon={Play} disabled={!can('ai.manageSettings')} onClick={() => setStatusChange({ row, status: 'Online' })}>
                Enable agent
              </DropdownItem>
            )}
          </Dropdown>
        </div>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="AI Agents"
        description="Every business's AI receptionist, how it is configured and how much it is being used."
        badge={agents.data && <Badge tone="brand">{agents.data.filter((a) => a.status === 'Online').length} online</Badge>}
      />

      <FilterBar
        table={table}
        searchPlaceholder="Search business or agent…"
        filters={[
          { key: 'status', label: 'Statuses', options: ['Online', 'Paused', 'Needs setup'] },
          { key: 'knowledgeMode', label: 'Knowledge', options: ['Shared', 'Channel-specific'] },
          { key: 'promptMode', label: 'Prompt', options: ['Shared', 'Channel-specific'] },
        ]}
        onExport={() =>
          exportCsv('ai-agents.csv', table.filteredRows, [
            { header: 'Business', value: (r) => r.business },
            { header: 'Status', value: (r) => r.status },
            { header: 'Knowledge', value: (r) => r.knowledgeMode },
            { header: 'AI minutes', value: (r) => r.aiMinutes },
          ])
        }
      />

      <DataTable
        columns={columns}
        table={table}
        loading={agents.loading}
        error={agents.error}
        onRetry={agents.reload}
        onRowClick={(row) => navigate(`/ai-agents/${row.id}`)}
        empty={<EmptyState icon={Bot} title="No AI agents found" description="Agents appear as businesses set up their receptionist." />}
      />

      <ConfirmDialog
        open={Boolean(statusChange)}
        onClose={() => setStatusChange(null)}
        onConfirm={async () => {
          setBusy(true)
          try {
            const updated = await aiService.setAgentStatus(statusChange.row.id, statusChange.status, admin?.name)
            agents.setData(agents.data.map((a) => (a.id === updated.id ? updated : a)))
            toast.success(`AI agent ${statusChange.status === 'Online' ? 'enabled' : 'disabled'}.`)
            setStatusChange(null)
          } finally {
            setBusy(false)
          }
        }}
        loading={busy}
        tone={statusChange?.status === 'Online' ? 'primary' : 'danger'}
        title={`${statusChange?.status === 'Online' ? 'Enable' : 'Disable'} the AI for ${statusChange?.row.business}?`}
        description={
          statusChange?.status === 'Online'
            ? 'The receptionist starts answering calls and messages again.'
            : 'Calls and messages will stop being answered automatically for this business.'
        }
        warning={statusChange?.status !== 'Online' ? 'The customer is not notified — tell them before disabling.' : undefined}
        confirmLabel={statusChange?.status === 'Online' ? 'Enable agent' : 'Disable agent'}
      />
    </>
  )
}
