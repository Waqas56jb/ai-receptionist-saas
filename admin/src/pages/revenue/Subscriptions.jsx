import { useNavigate } from 'react-router-dom'
import { CreditCard } from 'lucide-react'
import { exportCsv, formatCurrency, formatDate } from '../../lib/utils'
import PageHeader from '../../components/layout/PageHeader'
import Button from '../../components/ui/Button'
import Badge, { StatusBadge } from '../../components/ui/Badge'
import DataTable from '../../components/ui/DataTable'
import FilterBar from '../../components/ui/FilterBar'
import { EmptyState } from '../../components/ui/States'
import { ProgressBar } from '../../components/ui/Misc'
import { useAsync, useTable } from '../../hooks'
import { subscriptionService } from '../../services/revenueService'
import { subscriptionStatuses } from '../../data/mock/revenue'

export default function Subscriptions() {
  const navigate = useNavigate()
  const subscriptions = useAsync(() => subscriptionService.list(), [])

  const table = useTable(subscriptions.data || [], {
    pageSize: 10,
    initialSort: { key: 'business', direction: 'asc' },
    searchFields: ['business', 'owner', 'plan'],
  })

  const mrr = (subscriptions.data || []).filter((s) => s.status === 'Active' && s.cycle === 'Monthly').reduce((sum, s) => sum + s.amount, 0)

  const columns = [
    { key: 'business', header: 'Business', sortable: true, primary: true, render: (row) => <span className="font-semibold text-ink-900">{row.business}</span> },
    { key: 'owner', header: 'Owner', sortable: true, hideOnMobile: true },
    { key: 'plan', header: 'Plan', sortable: true, render: (row) => <Badge tone={row.plan === 'Enterprise' ? 'brand' : 'neutral'} size="sm">{row.plan}</Badge> },
    { key: 'status', header: 'Status', sortable: true, render: (row) => <StatusBadge status={row.status} /> },
    { key: 'cycle', header: 'Cycle', sortable: true, hideOnMobile: true },
    { key: 'amount', header: 'Amount', sortable: true, render: (row) => formatCurrency(row.amount) },
    { key: 'startDate', header: 'Started', sortable: true, hideOnMobile: true, render: (row) => formatDate(row.startDate) },
    { key: 'renewalDate', header: 'Renews', sortable: true, render: (row) => formatDate(row.renewalDate) },
    { key: 'usagePct', header: 'Usage', sortable: true, render: (row) => <ProgressBar value={row.usagePct} max={100} showValue={false} className="w-24" /> },
    { key: 'paymentStatus', header: 'Payment', sortable: true, render: (row) => <StatusBadge status={row.paymentStatus} dot={false} /> },
  ]

  return (
    <>
      <PageHeader
        title="Subscriptions"
        description="Every subscription on the platform, its plan and its payment health."
        badge={subscriptions.data && <Badge tone="brand">{formatCurrency(mrr)} monthly</Badge>}
      />

      <FilterBar
        table={table}
        searchPlaceholder="Search business, owner or plan…"
        filters={[
          { key: 'plan', label: 'Plans', options: ['Starter', 'Professional', 'Enterprise'] },
          { key: 'status', label: 'Statuses', options: subscriptionStatuses },
          { key: 'cycle', label: 'Cycles', options: ['Monthly', 'Annual'] },
        ]}
        onExport={() =>
          exportCsv('subscriptions.csv', table.filteredRows, [
            { header: 'Business', value: (r) => r.business },
            { header: 'Owner', value: (r) => r.owner },
            { header: 'Plan', value: (r) => r.plan },
            { header: 'Status', value: (r) => r.status },
            { header: 'Cycle', value: (r) => r.cycle },
            { header: 'Amount', value: (r) => r.amount },
            { header: 'Renews', value: (r) => formatDate(r.renewalDate) },
          ])
        }
      />

      <DataTable
        columns={columns}
        table={table}
        loading={subscriptions.loading}
        error={subscriptions.error}
        onRetry={subscriptions.reload}
        onRowClick={(row) => navigate(`/subscriptions/${row.id}`)}
        selectable
        bulkActions={
          <Button
            variant="outline"
            size="xs"
            onClick={() =>
              exportCsv('subscriptions-selection.csv', table.filteredRows.filter((r) => table.selected.includes(r.id)), [
                { header: 'Business', value: (r) => r.business },
                { header: 'Plan', value: (r) => r.plan },
                { header: 'Status', value: (r) => r.status },
                { header: 'Amount', value: (r) => r.amount },
              ])
            }
          >
            Export
          </Button>
        }
        empty={
          <EmptyState
            icon={CreditCard}
            title={table.sourceTotal ? 'No subscriptions match those filters' : 'No subscriptions found'}
            description={table.sourceTotal ? 'Try clearing a filter.' : 'Subscriptions appear as businesses choose a plan.'}
            action={table.sourceTotal ? <Button variant="secondary" size="sm" onClick={table.clearFilters}>Clear filters</Button> : undefined}
          />
        }
      />
    </>
  )
}
