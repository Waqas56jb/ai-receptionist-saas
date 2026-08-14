import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Banknote, Undo2 } from 'lucide-react'
import { exportCsv, formatCurrency, formatDateTime } from '../../lib/utils'
import PageHeader from '../../components/layout/PageHeader'
import Button from '../../components/ui/Button'
import Badge, { StatusBadge } from '../../components/ui/Badge'
import DataTable from '../../components/ui/DataTable'
import FilterBar from '../../components/ui/FilterBar'
import { ConfirmDialog } from '../../components/ui/Modal'
import { EmptyState } from '../../components/ui/States'
import { useAsync, useTable } from '../../hooks'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import { billingService } from '../../services/revenueService'
import { paymentStatuses } from '../../data/mock/revenue'

export default function Payments() {
  const toast = useToast()
  const { admin, can } = useAuth()
  const payments = useAsync(() => billingService.listPayments(), [])
  const [refunding, setRefunding] = useState(null)
  const [busy, setBusy] = useState(false)

  const table = useTable(payments.data || [], {
    pageSize: 10,
    initialSort: { key: 'at', direction: 'desc' },
    searchFields: ['business', 'customer', 'reference'],
  })

  const succeeded = (payments.data || []).filter((p) => p.status === 'Successful').reduce((sum, p) => sum + p.amount, 0)

  const columns = [
    { key: 'reference', header: 'Transaction', sortable: true, primary: true, render: (row) => <span className="font-mono text-[0.78rem] font-semibold text-ink-900">{row.reference}</span> },
    {
      key: 'business',
      header: 'Business',
      sortable: true,
      render: (row) => (
        <Link to={`/businesses/${row.businessId}`} className="truncate text-brand-600 hover:underline">
          {row.business}
        </Link>
      ),
    },
    { key: 'customer', header: 'Customer', sortable: true, hideOnMobile: true },
    { key: 'amount', header: 'Amount', sortable: true, render: (row) => <span className="font-semibold text-ink-900">{formatCurrency(row.amount, row.currency)}</span> },
    { key: 'method', header: 'Method', hideOnMobile: true },
    { key: 'plan', header: 'Plan', sortable: true, render: (row) => <Badge tone="neutral" size="sm">{row.plan}</Badge> },
    { key: 'status', header: 'Status', sortable: true, render: (row) => <StatusBadge status={row.status} /> },
    { key: 'at', header: 'Date', sortable: true, render: (row) => formatDateTime(row.at) },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (row) => (
        <Button
          variant="dangerGhost"
          size="xs"
          disabled={row.status !== 'Successful' || !can('billing.refunds')}
          onClick={() => setRefunding(row)}
        >
          <Undo2 className="h-3.5 w-3.5" aria-hidden="true" />
          Refund
        </Button>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Payments"
        description="Every transaction processed for the platform."
        badge={payments.data && <Badge tone="success">{formatCurrency(succeeded)} collected</Badge>}
      />

      <FilterBar
        table={table}
        searchPlaceholder="Search business, customer or transaction…"
        filters={[
          { key: 'status', label: 'Statuses', options: paymentStatuses },
          { key: 'plan', label: 'Plans', options: ['Starter', 'Professional', 'Enterprise'] },
        ]}
        onExport={() =>
          exportCsv('payments.csv', table.filteredRows, [
            { header: 'Transaction', value: (r) => r.reference },
            { header: 'Business', value: (r) => r.business },
            { header: 'Customer', value: (r) => r.customer },
            { header: 'Amount', value: (r) => r.amount },
            { header: 'Status', value: (r) => r.status },
            { header: 'Date', value: (r) => formatDateTime(r.at) },
          ])
        }
      />

      <DataTable
        columns={columns}
        table={table}
        loading={payments.loading}
        error={payments.error}
        onRetry={payments.reload}
        empty={
          <EmptyState
            icon={Banknote}
            title={table.sourceTotal ? 'No payments match those filters' : 'No payments yet'}
            description={table.sourceTotal ? 'Try clearing a filter.' : 'Transactions appear once billing is live.'}
            action={table.sourceTotal ? <Button variant="secondary" size="sm" onClick={table.clearFilters}>Clear filters</Button> : undefined}
          />
        }
      />

      <ConfirmDialog
        open={Boolean(refunding)}
        onClose={() => setRefunding(null)}
        onConfirm={async () => {
          setBusy(true)
          try {
            payments.setData(await billingService.refund(refunding.id, admin?.name))
            toast.success('Refund issued.')
            setRefunding(null)
          } finally {
            setBusy(false)
          }
        }}
        loading={busy}
        title={`Refund ${formatCurrency(refunding?.amount || 0)}?`}
        description={`The full amount will be returned to ${refunding?.customer} at ${refunding?.business}.`}
        warning="Refunds cannot be reversed once processed."
        confirmLabel="Issue refund"
      />
    </>
  )
}
