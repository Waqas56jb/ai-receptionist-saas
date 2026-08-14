import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, CreditCard, Download, Info, Receipt } from 'lucide-react'
import cn from '../../../lib/cn'
import PageHeader from '../../../components/layout/PageHeader'
import { Card, CardBody, CardHeader } from '../../../components/ui/Card'
import Badge, { StatusBadge } from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import DataTable from '../../../components/ui/DataTable'
import ProgressBar from '../../../components/ui/ProgressBar'
import { ErrorState } from '../../../components/ui/States'
import useAsync from '../../../hooks/useAsync'
import { useToast } from '../../../context/ToastContext'
import billingService from '../../../services/billingService'
import analyticsService from '../../../services/analyticsService'
import { formatCurrency, formatDate } from '../../../lib/format'

export default function Subscription() {
  const toast = useToast()
  const subscription = useAsync(() => billingService.getSubscription(), [])
  const plans = useAsync(() => billingService.getPlans(), [])
  const invoices = useAsync(() => billingService.getInvoices(), [])
  const usage = useAsync(() => analyticsService.getUsage(), [])
  const [changing, setChanging] = useState(null)

  const change = async (planId, name) => {
    setChanging(planId)
    try {
      subscription.setData(await billingService.changePlan(planId))
      toast.success(`Plan changed to ${name}. Billing changes take effect next cycle.`)
    } finally {
      setChanging(null)
    }
  }

  if (subscription.error) {
    return (
      <Card>
        <ErrorState onRetry={subscription.reload} />
      </Card>
    )
  }

  const sub = subscription.data

  const invoiceColumns = [
    { key: 'number', header: 'Invoice', primary: true, render: (row) => <span className="font-semibold text-ink-900">{row.number}</span> },
    { key: 'period', header: 'Period' },
    { key: 'date', header: 'Date', render: (row) => formatDate(row.date) },
    { key: 'amount', header: 'Amount', render: (row) => formatCurrency(row.amount, 'EUR') },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} size="sm" /> },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: () => (
        <button
          type="button"
          onClick={() => toast.info('Invoice downloads arrive with the billing backend.')}
          className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-ink-900"
          aria-label="Download invoice"
        >
          <Download className="h-3.5 w-3.5" />
        </button>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="Subscription"
        description="Your plan, billing cycle and invoice history."
        badge={sub && <Badge tone="success" dot>{sub.status}</Badge>}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <Card>
            <CardHeader icon={CreditCard} title="Current plan" />
            <CardBody>
              {subscription.loading ? (
                <div className="h-28 animate-pulse rounded-xl bg-slate-100" />
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <div>
                    <p className="text-[0.7rem] font-bold uppercase tracking-wider text-slate-400">Plan</p>
                    <p className="mt-1 font-display text-lg font-bold text-ink-900">{sub.plan}</p>
                  </div>
                  <div>
                    <p className="text-[0.7rem] font-bold uppercase tracking-wider text-slate-400">Billing</p>
                    <p className="mt-1 text-[0.9rem] font-semibold text-ink-900">{sub.billingCycle}</p>
                  </div>
                  <div>
                    <p className="text-[0.7rem] font-bold uppercase tracking-wider text-slate-400">Renews</p>
                    <p className="mt-1 text-[0.9rem] font-semibold text-ink-900">{formatDate(sub.renewsOn)}</p>
                  </div>
                  <div>
                    <p className="text-[0.7rem] font-bold uppercase tracking-wider text-slate-400">Seats</p>
                    <p className="mt-1 text-[0.9rem] font-semibold text-ink-900">{sub.seats}</p>
                  </div>
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-2">
                <Button
                  as="button"
                  variant="secondary"
                  size="sm"
                  onClick={async () => {
                    subscription.setData(await billingService.setBillingCycle(sub.billingCycle === 'Monthly' ? 'Yearly' : 'Monthly'))
                    toast.success('Billing cycle updated.')
                  }}
                >
                  Switch to {sub?.billingCycle === 'Monthly' ? 'yearly' : 'monthly'}
                </Button>
                <Button as={Link} to="/app/usage" variant="outline" size="sm">
                  View usage
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Available plans" description="Change plan at any time — the new price applies from the next cycle." />
            <CardBody>
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {(plans.data || []).map((plan) => {
                  const current = sub?.plan === plan.name
                  return (
                    <div
                      key={plan.id}
                      className={cn(
                        'flex flex-col rounded-xl border p-5',
                        current ? 'border-brand-400 bg-brand-50/50 ring-1 ring-brand-400/40' : 'border-slate-200 bg-white',
                      )}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-display text-[1rem] font-bold text-ink-900">{plan.name}</h3>
                        {current && <Badge tone="brand" size="sm">Current</Badge>}
                      </div>
                      <p className="mt-1.5 text-[0.8rem] leading-relaxed text-slate-500">{plan.description}</p>
                      <p className="mt-4 font-display text-lg font-bold text-ink-900">{plan.price}</p>

                      <ul className="mt-4 flex-1 space-y-2">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-[0.8rem] text-slate-600">
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" aria-hidden="true" />
                            {f}
                          </li>
                        ))}
                      </ul>

                      <Button
                        as="button"
                        variant={current ? 'outline' : 'primary'}
                        size="sm"
                        className="mt-5 w-full"
                        disabled={current}
                        loading={changing === plan.id}
                        onClick={() => change(plan.id, plan.name)}
                      >
                        {current ? 'Current plan' : plan.id === 'enterprise' ? 'Talk to sales' : `Switch to ${plan.name}`}
                      </Button>
                    </div>
                  )
                })}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader icon={Receipt} title="Billing history" />
            <CardBody className="p-0 sm:p-0">
              <DataTable
                columns={invoiceColumns}
                rows={invoices.data || []}
                loading={invoices.loading}
                className="rounded-none border-0"
              />
            </CardBody>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Usage this period" />
            <CardBody className="space-y-5">
              {(usage.data?.metrics || []).slice(0, 4).map((metric) => (
                <ProgressBar key={metric.key} label={metric.label} value={metric.used} max={metric.limit} />
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Payment method" />
            <CardBody>
              {sub && (
                <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5">
                  <span className="grid h-9 w-12 place-items-center rounded-lg bg-ink-900 text-[0.65rem] font-bold text-white">
                    {sub.paymentMethod.brand}
                  </span>
                  <div>
                    <p className="text-[0.85rem] font-semibold text-ink-900">•••• {sub.paymentMethod.last4}</p>
                    <p className="text-[0.75rem] text-slate-500">Expires {sub.paymentMethod.expiry}</p>
                  </div>
                </div>
              )}
              <Button
                as="button"
                variant="outline"
                size="sm"
                className="mt-3 w-full"
                onClick={() => toast.info('Card management arrives with the Stripe integration.')}
              >
                Update payment method
              </Button>
            </CardBody>
          </Card>

          <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
            <p className="text-[0.82rem] leading-relaxed text-slate-600">
              Billing is not connected yet. Plan changes here are demonstration only — Stripe arrives
              in the backend milestone, along with final pricing.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
