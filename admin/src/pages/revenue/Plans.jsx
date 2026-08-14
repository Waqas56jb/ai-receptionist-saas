import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Copy, Layers, Pencil, Plus, Trash2 } from 'lucide-react'
import { cn, formatCurrency, formatNumber } from '../../lib/utils'
import PageHeader from '../../components/layout/PageHeader'
import { Card, CardBody, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge, { StatusBadge } from '../../components/ui/Badge'
import Modal, { ConfirmDialog } from '../../components/ui/Modal'
import { Input, Select, Textarea } from '../../components/ui/Field'
import { EmptyState, ErrorState } from '../../components/ui/States'
import { Toggle } from '../../components/ui/Misc'
import { useAsync } from '../../hooks'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import { planService } from '../../services/revenueService'

const emptyPlan = {
  name: '', description: '', monthlyPrice: 0, annualPrice: 0, trialDays: 14, status: 'Active',
  limits: { calls: 500, aiMinutes: 300, messages: 1000, documents: 20, storageGb: 2, users: 3 },
  features: { voice: true, whatsapp: true, instagram: false, analytics: false, crm: true },
}

const featureLabels = { voice: 'Voice', whatsapp: 'WhatsApp', instagram: 'Instagram', analytics: 'Analytics', crm: 'CRM' }
const limitLabels = { calls: 'Calls', aiMinutes: 'AI minutes', messages: 'Messages', documents: 'Documents', storageGb: 'Storage (GB)', users: 'Users' }

export default function Plans() {
  const toast = useToast()
  const { admin, can } = useAuth()
  const plans = useAsync(() => planService.list(), [])

  const [editing, setEditing] = useState(null) // 'new' | plan id
  const [draft, setDraft] = useState(emptyPlan)
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)

  const openCreate = () => {
    setDraft(emptyPlan)
    setEditing('new')
  }

  const openEdit = (plan) => {
    setDraft(plan)
    setEditing(plan.id)
  }

  const save = async () => {
    if (!draft.name.trim()) return
    setBusy(true)
    try {
      if (editing === 'new') plans.setData(await planService.create(draft, admin?.name))
      else {
        await planService.update(editing, draft, admin?.name)
        plans.setData(await planService.list())
      }
      toast.success(editing === 'new' ? 'Plan created.' : 'Plan updated.')
      setEditing(null)
    } finally {
      setBusy(false)
    }
  }

  if (plans.error) {
    return (
      <Card>
        <ErrorState onRetry={plans.reload} />
      </Card>
    )
  }

  return (
    <>
      <PageHeader
        title="Plans"
        description="Pricing, allowances and which features each plan unlocks."
        badge={plans.data && <Badge tone="brand">{plans.data.filter((p) => p.status === 'Active').length} active</Badge>}
        actions={can('billing.plans') && <Button size="sm" onClick={openCreate}><Plus className="h-3.5 w-3.5" aria-hidden="true" />Create plan</Button>}
      />

      {plans.loading && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {[0, 1, 2].map((i) => <div key={i} className="h-96 animate-pulse rounded-2xl bg-slate-100" />)}
        </div>
      )}

      {plans.data?.length === 0 && (
        <Card>
          <EmptyState icon={Layers} title="No plans yet" description="Create your first pricing plan." action={<Button size="sm" onClick={openCreate}>Create plan</Button>} />
        </Card>
      )}

      {plans.data && plans.data.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {plans.data.map((plan) => (
            <Card key={plan.id} className={cn('flex flex-col', plan.status === 'Disabled' && 'opacity-70')}>
              <CardHeader
                title={plan.name}
                description={plan.description}
                action={<StatusBadge status={plan.status} />}
              />
              <CardBody className="flex-1 space-y-4">
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="font-display text-2xl font-bold text-ink-900">{formatCurrency(plan.monthlyPrice)}</span>
                  <span className="text-[0.8rem] text-slate-500">/ month</span>
                  <span className="ml-auto text-[0.78rem] text-slate-500">{formatCurrency(plan.annualPrice)} / year</span>
                </div>

                <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                  {Object.entries(plan.limits).map(([key, value]) => (
                    <div key={key} className="min-w-0">
                      <p className="text-[0.62rem] font-bold uppercase tracking-wider text-slate-400">{limitLabels[key]}</p>
                      <p className="text-[0.82rem] font-semibold text-ink-900">{formatNumber(value)}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(plan.features).map(([key, on]) => (
                    <Badge key={key} tone={on ? 'success' : 'neutral'} size="sm">
                      {featureLabels[key]}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3 text-[0.8rem]">
                  <span className="text-slate-500">Subscribers</span>
                  <span className="font-semibold text-ink-900">{plan.subscribers}</span>
                </div>
                <div className="flex items-center justify-between gap-3 text-[0.8rem]">
                  <span className="text-slate-500">Revenue generated</span>
                  <span className="font-semibold text-ink-900">{formatCurrency(plan.mrr)} / month</span>
                </div>
                <div className="flex items-center justify-between gap-3 text-[0.8rem]">
                  <span className="text-slate-500">Trial</span>
                  <span className="font-semibold text-ink-900">{plan.trialDays ? `${plan.trialDays} days` : 'None'}</span>
                </div>
              </CardBody>

              <div className="flex flex-wrap items-center gap-2 border-t border-slate-200/80 bg-slate-50/60 px-5 py-3">
                <Button variant="outline" size="xs" disabled={!can('billing.plans')} onClick={() => openEdit(plan)}>
                  <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  disabled={!can('billing.plans')}
                  onClick={async () => {
                    plans.setData(await planService.duplicate(plan.id, admin?.name))
                    toast.success('Plan duplicated.')
                  }}
                >
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  Duplicate
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  disabled={!can('billing.plans')}
                  onClick={async () => {
                    await planService.update(plan.id, { status: plan.status === 'Active' ? 'Disabled' : 'Active' }, admin?.name)
                    plans.setData(await planService.list())
                    toast.success(plan.status === 'Active' ? 'Plan disabled.' : 'Plan activated.')
                  }}
                >
                  {plan.status === 'Active' ? 'Disable' : 'Activate'}
                </Button>
                <Button variant="dangerGhost" size="xs" className="ml-auto" disabled={!can('billing.plans') || plan.subscribers > 0} onClick={() => setDeleting(plan)}>
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={editing === 'new' ? 'Create plan' : 'Edit plan'}
        size="lg"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>Cancel</Button>
            <Button size="sm" loading={busy} onClick={save}>Save plan</Button>
          </>
        }
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Plan name" value={draft.name} onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))} required />
            <Select label="Status" options={['Active', 'Disabled']} value={draft.status} onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))} />
          </div>
          <Textarea label="Description" rows={2} value={draft.description} onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))} />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input label="Monthly price (€)" type="number" value={draft.monthlyPrice} onChange={(e) => setDraft((d) => ({ ...d, monthlyPrice: Number(e.target.value) }))} />
            <Input label="Annual price (€)" type="number" value={draft.annualPrice} onChange={(e) => setDraft((d) => ({ ...d, annualPrice: Number(e.target.value) }))} />
            <Input label="Trial (days)" type="number" value={draft.trialDays} onChange={(e) => setDraft((d) => ({ ...d, trialDays: Number(e.target.value) }))} />
          </div>

          <div>
            <p className="mb-2 text-[0.8rem] font-semibold text-ink-900">Usage limits</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {Object.entries(draft.limits).map(([key, value]) => (
                <Input
                  key={key}
                  label={limitLabels[key]}
                  type="number"
                  value={value}
                  onChange={(e) => setDraft((d) => ({ ...d, limits: { ...d.limits, [key]: Number(e.target.value) } }))}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-[0.8rem] font-semibold text-ink-900">Features</p>
            <div className="space-y-3 rounded-xl border border-slate-200 p-4">
              {Object.entries(draft.features).map(([key, on]) => (
                <Toggle
                  key={key}
                  size="sm"
                  checked={on}
                  onChange={(v) => setDraft((d) => ({ ...d, features: { ...d.features, [key]: v } }))}
                  label={featureLabels[key]}
                />
              ))}
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          setBusy(true)
          try {
            plans.setData(await planService.remove(deleting.id, admin?.name))
            toast.success('Plan deleted.')
            setDeleting(null)
          } finally {
            setBusy(false)
          }
        }}
        loading={busy}
        title={`Delete ${deleting?.name}?`}
        description="The plan is removed from the pricing table. Existing subscribers are unaffected until they change plan."
        warning="This cannot be undone."
        confirmLabel="Delete plan"
        confirmPhrase={deleting?.name}
      />
    </>
  )
}
