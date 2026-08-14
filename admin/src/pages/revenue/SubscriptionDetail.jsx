import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Ban, CalendarPlus, CheckCircle2, CreditCard, Percent, Receipt, RefreshCw } from 'lucide-react'
import { formatCurrency, formatDate } from '../../lib/utils'
import PageHeader from '../../components/layout/PageHeader'
import { Card, CardBody, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge, { StatusBadge } from '../../components/ui/Badge'
import Modal, { ConfirmDialog } from '../../components/ui/Modal'
import { Input, Select } from '../../components/ui/Field'
import { EmptyState, ErrorState } from '../../components/ui/States'
import { SkeletonDetail } from '../../components/ui/Skeleton'
import { ProgressBar } from '../../components/ui/Misc'
import { useAsync } from '../../hooks'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import { subscriptionService, planService, billingService } from '../../services/revenueService'

function Row({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="text-[0.82rem] text-slate-500">{label}</span>
      <span className="min-w-0 text-right text-[0.84rem] font-medium text-ink-900">{children}</span>
    </div>
  )
}

export default function SubscriptionDetail() {
  const { id } = useParams()
  const toast = useToast()
  const { admin, can } = useAuth()

  const subscription = useAsync(() => subscriptionService.get(id), [id])
  const plans = useAsync(() => planService.list(), [])
  const payments = useAsync(() => billingService.listPayments(), [])
  const invoices = useAsync(() => billingService.listInvoices(), [])

  const [changingPlan, setChangingPlan] = useState(false)
  const [nextPlan, setNextPlan] = useState('')
  const [extending, setExtending] = useState(false)
  const [extendDays, setExtendDays] = useState(30)
  const [discount, setDiscount] = useState(false)
  const [discountPct, setDiscountPct] = useState(10)
  const [statusChange, setStatusChange] = useState(null)
  const [busy, setBusy] = useState(false)

  if (subscription.error) {
    return (
      <Card>
        <ErrorState onRetry={subscription.reload} />
      </Card>
    )
  }
  if (subscription.loading) return <SkeletonDetail />
  if (!subscription.data) {
    return (
      <Card>
        <EmptyState icon={CreditCard} title="Subscription not found" description="It may have been cancelled and removed." action={<Button as={Link} to="/subscriptions" size="sm">Back to subscriptions</Button>} />
      </Card>
    )
  }

  const s = subscription.data
  const plan = (plans.data || []).find((p) => p.name === s.plan)
  const subPayments = (payments.data || []).filter((p) => p.businessId === s.businessId)
  const subInvoices = (invoices.data || []).filter((i) => i.businessId === s.businessId)

  const apply = async (patch, message) => {
    setBusy(true)
    try {
      subscription.setData(await subscriptionService.update(id, patch, admin?.name))
      toast.success(message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <PageHeader
        title={s.business}
        breadcrumbs={[{ label: 'Subscriptions', to: '/subscriptions' }, { label: s.business }]}
        description={`${s.plan} · ${s.cycle} · owned by ${s.owner}`}
        badge={<StatusBadge status={s.status} />}
        actions={
          <>
            <Button variant="outline" size="sm" disabled={!can('subscriptions.changePlan')} onClick={() => { setNextPlan(s.plan); setChangingPlan(true) }}>
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              Change plan
            </Button>
            <Button variant="outline" size="sm" disabled={!can('subscriptions.extend')} onClick={() => setExtending(true)}>
              <CalendarPlus className="h-3.5 w-3.5" aria-hidden="true" />
              Extend
            </Button>
            <Button variant="outline" size="sm" disabled={!can('billing.settings')} onClick={() => setDiscount(true)}>
              <Percent className="h-3.5 w-3.5" aria-hidden="true" />
              Add discount
            </Button>
            {s.status === 'Cancelled' || s.status === 'Suspended' ? (
              <Button size="sm" disabled={!can('subscriptions.create')} onClick={() => setStatusChange('Active')}>
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                Reactivate
              </Button>
            ) : (
              <Button variant="dangerGhost" size="sm" disabled={!can('subscriptions.cancel')} onClick={() => setStatusChange('Cancelled')}>
                <Ban className="h-3.5 w-3.5" aria-hidden="true" />
                Cancel
              </Button>
            )}
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <Card>
            <CardHeader icon={CreditCard} title="Subscription" action={<Button as={Link} to={`/businesses/${s.businessId}`} variant="outline" size="xs">Open business</Button>} />
            <CardBody className="divide-y divide-slate-100 py-0">
              <Row label="Business">{s.business}</Row>
              <Row label="Owner">{s.owner}</Row>
              <Row label="Plan"><Badge tone="brand" size="sm">{s.plan}</Badge></Row>
              <Row label="Status"><StatusBadge status={s.status} /></Row>
              <Row label="Billing cycle">{s.cycle}</Row>
              <Row label="Amount">{formatCurrency(s.amount)}</Row>
              <Row label="Started">{formatDate(s.startDate)}</Row>
              <Row label="Renews">{formatDate(s.renewalDate)}</Row>
              <Row label="Payment status"><StatusBadge status={s.paymentStatus} dot={false} /></Row>
            </CardBody>
          </Card>

          <Card>
            <CardHeader icon={Receipt} title="Payment history" />
            <CardBody className="p-0">
              {subPayments.length === 0 && <EmptyState compact icon={Receipt} title="No payments" description="Nothing has been charged on this subscription." />}
              <ul className="divide-y divide-slate-100">
                {subPayments.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <div className="min-w-0">
                      <p className="text-[0.84rem] font-semibold text-ink-900">{formatCurrency(p.amount)}</p>
                      <p className="truncate text-[0.74rem] text-slate-500">{p.reference} · {p.method} · {formatDate(p.at)}</p>
                    </div>
                    <StatusBadge status={p.status} />
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader icon={Receipt} title="Invoice history" />
            <CardBody className="p-0">
              {subInvoices.length === 0 && <EmptyState compact icon={Receipt} title="No invoices" description="Nothing has been invoiced yet." />}
              <ul className="divide-y divide-slate-100">
                {subInvoices.map((i) => (
                  <li key={i.id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <div className="min-w-0">
                      <p className="text-[0.84rem] font-semibold text-ink-900">{i.number}</p>
                      <p className="text-[0.74rem] text-slate-500">Issued {formatDate(i.issued)} · due {formatDate(i.due)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[0.82rem] font-semibold text-ink-900">{formatCurrency(i.amount)}</span>
                      <StatusBadge status={i.status} />
                    </div>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Usage against plan" />
            <CardBody className="space-y-5">
              <ProgressBar label="Overall usage" value={s.usagePct} max={100} hint={`${100 - s.usagePct}% of the allowance remaining`} />
              {plan && (
                <>
                  <ProgressBar label="Calls allowance" value={Math.round((plan.limits.calls * s.usagePct) / 100)} max={plan.limits.calls} />
                  <ProgressBar label="Messages allowance" value={Math.round((plan.limits.messages * s.usagePct) / 100)} max={plan.limits.messages} />
                  <ProgressBar label="AI minutes" value={Math.round((plan.limits.aiMinutes * s.usagePct) / 100)} max={plan.limits.aiMinutes} />
                </>
              )}
            </CardBody>
          </Card>

          {plan && (
            <Card>
              <CardHeader title={`${plan.name} limits`} />
              <CardBody className="divide-y divide-slate-100 py-0">
                <Row label="Calls">{plan.limits.calls}</Row>
                <Row label="AI minutes">{plan.limits.aiMinutes}</Row>
                <Row label="Messages">{plan.limits.messages}</Row>
                <Row label="Documents">{plan.limits.documents}</Row>
                <Row label="Storage">{plan.limits.storageGb} GB</Row>
                <Row label="Users">{plan.limits.users}</Row>
              </CardBody>
            </Card>
          )}
        </div>
      </div>

      {/* Change plan */}
      <Modal
        open={changingPlan}
        onClose={() => setChangingPlan(false)}
        title="Change plan"
        description="The new price applies from the next billing cycle."
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setChangingPlan(false)}>Cancel</Button>
            <Button
              size="sm"
              loading={busy}
              onClick={async () => {
                const chosen = (plans.data || []).find((p) => p.name === nextPlan)
                await apply({ plan: nextPlan, amount: chosen ? (s.cycle === 'Annual' ? chosen.annualPrice : chosen.monthlyPrice) : s.amount }, `Plan changed to ${nextPlan}.`)
                setChangingPlan(false)
              }}
            >
              Change plan
            </Button>
          </>
        }
      >
        <Select label="New plan" value={nextPlan} onChange={(e) => setNextPlan(e.target.value)} options={(plans.data || []).map((p) => p.name)} />
      </Modal>

      {/* Extend */}
      <Modal
        open={extending}
        onClose={() => setExtending(false)}
        title="Extend subscription"
        description="Pushes the renewal date out without charging the customer."
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setExtending(false)}>Cancel</Button>
            <Button
              size="sm"
              loading={busy}
              onClick={async () => {
                setBusy(true)
                try {
                  subscription.setData(await subscriptionService.extend(id, Number(extendDays), admin?.name))
                  toast.success(`Subscription extended by ${extendDays} days.`)
                  setExtending(false)
                } finally {
                  setBusy(false)
                }
              }}
            >
              Extend
            </Button>
          </>
        }
      >
        <Select label="Extend by" value={String(extendDays)} onChange={(e) => setExtendDays(e.target.value)} options={['7', '14', '30', '60', '90'].map((d) => ({ value: d, label: `${d} days` }))} />
      </Modal>

      {/* Discount */}
      <Modal
        open={discount}
        onClose={() => setDiscount(false)}
        title="Add discount"
        description="Applies a percentage discount to future invoices."
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setDiscount(false)}>Cancel</Button>
            <Button
              size="sm"
              loading={busy}
              onClick={async () => {
                await apply({ amount: Math.round(s.amount * (1 - discountPct / 100)) }, `${discountPct}% discount applied.`)
                setDiscount(false)
              }}
            >
              Apply discount
            </Button>
          </>
        }
      >
        <Input label="Discount (%)" type="number" min="1" max="100" value={discountPct} onChange={(e) => setDiscountPct(Number(e.target.value))} />
      </Modal>

      <ConfirmDialog
        open={Boolean(statusChange)}
        onClose={() => setStatusChange(null)}
        onConfirm={async () => {
          await apply({ status: statusChange }, statusChange === 'Active' ? 'Subscription reactivated.' : 'Subscription cancelled.')
          setStatusChange(null)
        }}
        loading={busy}
        tone={statusChange === 'Active' ? 'primary' : 'danger'}
        title={statusChange === 'Active' ? 'Reactivate subscription?' : 'Cancel subscription?'}
        description={statusChange === 'Active' ? 'Billing resumes on the next renewal date.' : 'The business keeps access until the end of the current period.'}
        warning={statusChange === 'Cancelled' ? 'The customer will be notified by email.' : undefined}
        confirmLabel={statusChange === 'Active' ? 'Reactivate' : 'Cancel subscription'}
      />
    </>
  )
}
