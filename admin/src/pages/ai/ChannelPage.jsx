import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MoreHorizontal, Power, Unplug } from 'lucide-react'
import { exportCsv, formatNumber, timeAgo } from '../../lib/utils'
import PageHeader from '../../components/layout/PageHeader'
import Button from '../../components/ui/Button'
import Badge, { StatusBadge } from '../../components/ui/Badge'
import DataTable from '../../components/ui/DataTable'
import FilterBar from '../../components/ui/FilterBar'
import { ConfirmDialog } from '../../components/ui/Modal'
import { EmptyState } from '../../components/ui/States'
import { Dropdown, DropdownDivider, DropdownItem, MaskedCredential } from '../../components/ui/Misc'
import { useAsync, useTable } from '../../hooks'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import { channelService } from '../../services/aiService'

/**
 * Shared management screen for Voice, WhatsApp and Instagram — the three lists
 * differ only in the identifier column and the volume metric.
 */
export default function ChannelPage({ kind, title, description, icon: Icon, identifierHeader, volumeHeader, volumeKey, permission, extraColumns = [] }) {
  const toast = useToast()
  const { admin, can } = useAuth()

  const loader =
    kind === 'voice' ? channelService.listVoice : kind === 'whatsapp' ? channelService.listWhatsApp : channelService.listInstagram
  const rows = useAsync(() => loader(), [kind])

  const [action, setAction] = useState(null) // { row, type }
  const [busy, setBusy] = useState(false)

  const table = useTable(rows.data || [], {
    pageSize: 10,
    initialSort: { key: 'business', direction: 'asc' },
    searchFields: ['business', 'number', 'account'],
  })

  const columns = [
    {
      key: 'business',
      header: 'Business',
      sortable: true,
      primary: true,
      render: (row) => (
        <Link to={`/businesses/${row.businessId}`} onClick={(e) => e.stopPropagation()} className="font-semibold text-ink-900 hover:text-brand-600">
          {row.business}
        </Link>
      ),
    },
    { key: 'identifier', header: identifierHeader, render: (row) => <span className="text-slate-600">{row.number || row.account || '—'}</span> },
    ...extraColumns,
    { key: 'credential', header: 'Credential', hideOnMobile: true, render: (row) => <MaskedCredential value={row.credential} /> },
    { key: 'status', header: 'Status', sortable: true, render: (row) => <StatusBadge status={row.status} /> },
    { key: volumeKey, header: volumeHeader, sortable: true, render: (row) => formatNumber(row[volumeKey]) },
    { key: 'lastActivity', header: 'Last activity', sortable: true, render: (row) => timeAgo(row.lastActivity) },
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
            <DropdownItem as={Link} to={`/businesses/${row.businessId}`}>
              Inspect business
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem icon={Power} disabled={!can(permission)} onClick={() => setAction({ row, type: row.enabled ? 'disable' : 'enable' })}>
              {row.enabled ? 'Disable channel' : 'Enable channel'}
            </DropdownItem>
            <DropdownItem icon={Unplug} tone="danger" disabled={!can('channels.manage')} onClick={() => setAction({ row, type: 'disconnect' })}>
              Disconnect
            </DropdownItem>
          </Dropdown>
        </div>
      ),
    },
  ]

  const connected = (rows.data || []).filter((r) => r.status === 'Connected').length

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        badge={rows.data && <Badge tone="brand">{connected} connected</Badge>}
      />

      <div className="mb-4 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
        <p className="text-[0.83rem] leading-relaxed text-slate-600">
          Credentials are stored by the backend and only ever shown here as a masked preview.
          This console can enable, disable or disconnect a channel — it never reveals a token.
        </p>
      </div>

      <FilterBar
        table={table}
        searchPlaceholder={`Search business or ${identifierHeader.toLowerCase()}…`}
        filters={[{ key: 'status', label: 'Statuses', options: ['Connected', 'Disabled', 'Failed', 'Warning', 'Disconnected'] }]}
        onExport={() =>
          exportCsv(`${kind}-channels.csv`, table.filteredRows, [
            { header: 'Business', value: (r) => r.business },
            { header: identifierHeader, value: (r) => r.number || r.account },
            { header: 'Status', value: (r) => r.status },
            { header: volumeHeader, value: (r) => r[volumeKey] },
          ])
        }
      />

      <DataTable
        columns={columns}
        table={table}
        loading={rows.loading}
        error={rows.error}
        onRetry={rows.reload}
        empty={<EmptyState icon={Icon} title={`No ${title.toLowerCase()} connections`} description="Connections appear as businesses set up this channel." />}
      />

      <ConfirmDialog
        open={Boolean(action)}
        onClose={() => setAction(null)}
        onConfirm={async () => {
          setBusy(true)
          try {
            if (action.type === 'disconnect') rows.setData(await channelService.disconnect(kind, action.row.id, admin?.name))
            else rows.setData(await channelService.setEnabled(kind, action.row.id, action.type === 'enable', admin?.name))
            toast.success(
              action.type === 'disconnect'
                ? 'Channel disconnected.'
                : `Channel ${action.type === 'enable' ? 'enabled' : 'disabled'}.`,
            )
            setAction(null)
          } finally {
            setBusy(false)
          }
        }}
        loading={busy}
        tone={action?.type === 'enable' ? 'primary' : 'danger'}
        title={
          action?.type === 'disconnect'
            ? `Disconnect ${title} for ${action?.row.business}?`
            : `${action?.type === 'enable' ? 'Enable' : 'Disable'} ${title} for ${action?.row.business}?`
        }
        description={
          action?.type === 'disconnect'
            ? 'The integration is removed. The business must reconnect it from their own portal.'
            : action?.type === 'enable'
              ? 'The channel starts receiving and answering customer messages again.'
              : 'Incoming customer messages on this channel stop being answered.'
        }
        warning={action?.type !== 'enable' ? 'This affects a live customer-facing channel.' : undefined}
        confirmLabel={action?.type === 'disconnect' ? 'Disconnect' : action?.type === 'enable' ? 'Enable' : 'Disable'}
      />
    </>
  )
}
