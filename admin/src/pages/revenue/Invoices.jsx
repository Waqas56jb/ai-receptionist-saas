import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Download, Eye, Receipt, Send } from 'lucide-react'
import { exportCsv, formatCurrency, formatDate } from '../../lib/utils'
import PageHeader from '../../components/layout/PageHeader'
import Button from '../../components/ui/Button'
import Badge, { StatusBadge } from '../../components/ui/Badge'
import DataTable from '../../components/ui/DataTable'
import FilterBar from '../../components/ui/FilterBar'
import Modal from '../../components/ui/Modal'
import { EmptyState } from '../../components/ui/States'
import { useAsync, useTable } from '../../hooks'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import { billingService } from '../../services/revenueService'
import { invoiceStatuses } from '../../data/mock/revenue'

export default function Invoices() {
  const toast = useToast()
  const { admin, can } = useAuth()
  const invoices = useAsync(() => billingService.listInvoices(), [])
  const [viewing, setViewing] = useState(null)

  const table = useTable(invoices.data || [], {
    pageSize: 10,
    initialSort: { key: 'issued', direction: 'desc' },
    searchFields: ['number', 'business', 'customer'],
  })

  const outstanding = (invoices.data || []).filter((i) => i.status === 'Open' || i.status === 'Overdue').reduce((sum, i) => sum + i.amount, 0)

  const columns = [
    { key: 'number', header: 'Invoice', sortable: true, primary: true, render: (row) => <span className="font-semibold text-ink-900">{row.number}</span> },
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
    { key: 'amount', header: 'Amount', sortable: true, render: (row) => <span className="font-semibold text-ink-900">{formatCurrency(row.amount)}</span> },
    { key: 'status', header: 'Status', sortable: true, render: (row) => <StatusBadge status={row.status} /> },
    { key: 'issued', header: 'Issued', sortable: true, render: (row) => formatDate(row.issued) },
    { key: 'due', header: 'Due', sortable: true, hideOnMobile: true, render: (row) => formatDate(row.due) },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <button type="button" onClick={() => setViewing(row)} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-ink-900" aria-label={`View ${row.number}`}>
            <Eye className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => toast.info('Invoice PDFs arrive with the billing backend.')}
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-ink-900"
            aria-label={`Download ${row.number}`}
          >
            <Download className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            disabled={!can('billing.invoices')}
            onClick={async () => {
              await billingService.sendInvoice(row.id, admin?.name)
              toast.success(`${row.number} sent to ${row.customer}.`)
            }}
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-ink-900 disabled:opacity-40"
            aria-label={`Send ${row.number}`}
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Invoices"
        description="Issued invoices and what is still outstanding."
        badge={invoices.data && <Badge tone={outstanding ? 'warning' : 'success'}>{formatCurrency(outstanding)} outstanding</Badge>}
      />

      <FilterBar
        table={table}
        searchPlaceholder="Search invoice number, business or customer…"
        filters={[{ key: 'status', label: 'Statuses', options: invoiceStatuses }]}
        onExport={() =>
          exportCsv('invoices.csv', table.filteredRows, [
            { header: 'Invoice', value: (r) => r.number },
            { header: 'Business', value: (r) => r.business },
            { header: 'Amount', value: (r) => r.amount },
            { header: 'Status', value: (r) => r.status },
            { header: 'Issued', value: (r) => formatDate(r.issued) },
            { header: 'Due', value: (r) => formatDate(r.due) },
          ])
        }
      />

      <DataTable
        columns={columns}
        table={table}
        loading={invoices.loading}
        error={invoices.error}
        onRetry={invoices.reload}
        empty={
          <EmptyState
            icon={Receipt}
            title={table.sourceTotal ? 'No invoices match those filters' : 'No invoices yet'}
            description={table.sourceTotal ? 'Try clearing a filter.' : 'Invoices are generated once billing is live.'}
            action={table.sourceTotal ? <Button variant="secondary" size="sm" onClick={table.clearFilters}>Clear filters</Button> : undefined}
          />
        }
      />

      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} title={viewing?.number} description={viewing?.business} size="md">
        {viewing && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <div>
                <p className="text-[0.7rem] font-bold uppercase tracking-wider text-slate-400">Amount due</p>
                <p className="mt-1 font-display text-2xl font-bold text-ink-900">{formatCurrency(viewing.amount)}</p>
              </div>
              <StatusBadge status={viewing.status} />
            </div>
            <dl className="divide-y divide-slate-100">
              {[
                ['Invoice number', viewing.number],
                ['Business', viewing.business],
                ['Customer', viewing.customer],
                ['Issued', formatDate(viewing.issued)],
                ['Due', formatDate(viewing.due)],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 py-2.5">
                  <dt className="text-[0.82rem] text-slate-500">{label}</dt>
                  <dd className="text-[0.84rem] font-medium text-ink-900">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-[0.78rem] leading-relaxed text-slate-500">
              A rendered PDF and line-item breakdown arrive with the billing backend.
            </p>
          </div>
        )}
      </Modal>
    </>
  )
}
