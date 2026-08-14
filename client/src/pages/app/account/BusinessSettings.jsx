import { useState } from 'react'
import { Building2, Clock, Database, ImageIcon, Mail, Save, ShieldCheck } from 'lucide-react'
import PageHeader from '../../../components/layout/PageHeader'
import { Card, CardBody, CardFooter, CardHeader } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Tabs from '../../../components/ui/Tabs'
import Badge from '../../../components/ui/Badge'
import { Input, Select, Textarea } from '../../../components/ui/Field'
import { ErrorState } from '../../../components/ui/States'
import BusinessHoursEditor from '../../../components/business/BusinessHoursEditor'
import CrudList from '../../../components/business/CrudList'
import useAsync from '../../../hooks/useAsync'
import { useToast } from '../../../context/ToastContext'
import { useAuth } from '../../../context/AuthContext'
import businessService from '../../../services/businessService'

const tabs = [
  { id: 'general', label: 'General', icon: Building2 },
  { id: 'contact', label: 'Contact', icon: Mail },
  { id: 'hours', label: 'Business hours', icon: Clock },
  { id: 'services', label: 'Services', icon: Database },
  { id: 'products', label: 'Products', icon: Database },
  { id: 'policies', label: 'Policies', icon: ShieldCheck },
  { id: 'rules', label: 'Booking rules', icon: ShieldCheck },
]

export default function BusinessSettings() {
  const toast = useToast()
  const { updateBusiness } = useAuth()
  const [tab, setTab] = useState('general')
  const [saving, setSaving] = useState(false)

  const business = useAsync(() => businessService.getBusiness(), [])
  const reference = useAsync(() => businessService.getReferenceData(), [])
  const hours = useAsync(() => businessService.getHours(), [])
  const services = useAsync(() => businessService.list('services'), [])
  const products = useAsync(() => businessService.list('products'), [])
  const policies = useAsync(() => businessService.list('policies'), [])
  const rules = useAsync(() => businessService.list('bookingRules'), [])

  const setField = (key) => (e) => business.setData((prev) => ({ ...prev, [key]: e.target.value }))

  const save = async () => {
    setSaving(true)
    try {
      const next = await businessService.updateBusiness(business.data)
      business.setData(next)
      updateBusiness({ name: next.name })
      toast.success('Business settings saved.')
    } finally {
      setSaving(false)
    }
  }

  const saveHours = async () => {
    setSaving(true)
    try {
      hours.setData(await businessService.updateHours(hours.data))
      toast.success('Business hours saved.')
    } finally {
      setSaving(false)
    }
  }

  if (business.error) {
    return (
      <Card>
        <ErrorState onRetry={business.reload} />
      </Card>
    )
  }

  return (
    <>
      <PageHeader
        title="Business Settings"
        description="Your business profile — the foundation of everything your AI receptionist says."
      />

      <Tabs tabs={tabs} value={tab} onChange={setTab} className="mb-5" />

      {business.loading && <div className="h-72 animate-pulse rounded-2xl bg-slate-100" />}

      {business.data && tab === 'general' && (
        <Card>
          <CardHeader icon={Building2} title="General" />
          <CardBody className="space-y-4">
            <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-xl border border-slate-200 bg-white text-slate-400">
                <ImageIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[0.85rem] font-semibold text-ink-900">Business logo</p>
                <p className="mt-0.5 text-[0.78rem] text-slate-500">PNG or SVG, at least 256×256. Shown on your booking confirmations.</p>
              </div>
              <Button as="button" variant="outline" size="sm" onClick={() => toast.info('Logo upload arrives with the storage backend.')}>
                Upload
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Business name" value={business.data.name} onChange={setField('name')} />
              <Select label="Business type" options={reference.data?.businessTypes || []} value={business.data.type} onChange={setField('type')} />
              <Textarea className="sm:col-span-2" label="Description" rows={4} value={business.data.description} onChange={setField('description')} />
              <Input label="Website" value={business.data.website || ''} onChange={setField('website')} />
              <Select label="Timezone" options={reference.data?.timezones || []} value={business.data.timezone} onChange={setField('timezone')} />
            </div>
          </CardBody>
          <CardFooter>
            <Button as="button" size="sm" loading={saving} onClick={save}>
              <Save className="h-3.5 w-3.5" aria-hidden="true" />
              Save changes
            </Button>
          </CardFooter>
        </Card>
      )}

      {business.data && tab === 'contact' && (
        <Card>
          <CardHeader icon={Mail} title="Contact details" description="Used by the AI when a customer asks how to reach you." />
          <CardBody>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Email" type="email" value={business.data.email} onChange={setField('email')} />
              <Input label="Phone" value={business.data.phone} onChange={setField('phone')} />
              <Input className="sm:col-span-2" label="Address" value={business.data.address} onChange={setField('address')} />
              <Select label="Country" options={reference.data?.countries || []} value={business.data.country} onChange={setField('country')} />
            </div>
          </CardBody>
          <CardFooter>
            <Button as="button" size="sm" loading={saving} onClick={save}>
              <Save className="h-3.5 w-3.5" aria-hidden="true" />
              Save changes
            </Button>
          </CardFooter>
        </Card>
      )}

      {tab === 'hours' && (
        <Card>
          <CardHeader
            icon={Clock}
            title="Business hours"
            description="The AI answers 24/7 — these hours decide when it can confirm bookings directly."
            action={<Badge tone="brand" size="sm">{business.data?.timezone}</Badge>}
          />
          <CardBody>
            {hours.loading ? (
              <div className="h-64 animate-pulse rounded-xl bg-slate-100" />
            ) : (
              <BusinessHoursEditor hours={hours.data} onChange={hours.setData} />
            )}
          </CardBody>
          <CardFooter>
            <Button as="button" size="sm" loading={saving} onClick={saveHours}>
              <Save className="h-3.5 w-3.5" aria-hidden="true" />
              Save hours
            </Button>
          </CardFooter>
        </Card>
      )}

      {tab === 'services' && (
        <Card>
          <CardHeader title="Services" description="What you sell, and what it costs." />
          <CardBody>
            <CrudList
              items={services.data || []}
              addLabel="Add service"
              emptyIcon={Database}
              fields={[
                { key: 'name', label: 'Name' },
                { key: 'price', label: 'Price', type: 'number' },
                { key: 'unit', label: 'Unit' },
                { key: 'description', label: 'Description', type: 'textarea' },
              ]}
              renderMeta={(item) => (item.price ? <Badge tone="brand" size="sm">{item.price} {item.unit}</Badge> : null)}
              onCreate={async (item) => services.setData(await businessService.create('services', item))}
              onUpdate={async (id, patch) => services.setData(await businessService.update('services', id, patch))}
              onDelete={async (id) => services.setData(await businessService.remove('services', id))}
              onToggle={async (id, active) => services.setData(await businessService.update('services', id, { active }))}
            />
          </CardBody>
        </Card>
      )}

      {tab === 'products' && (
        <Card>
          <CardHeader title="Products" description="Extras and add-ons the AI can offer." />
          <CardBody>
            <CrudList
              items={products.data || []}
              addLabel="Add product"
              emptyIcon={Database}
              fields={[
                { key: 'name', label: 'Name' },
                { key: 'price', label: 'Price', type: 'number' },
                { key: 'unit', label: 'Unit' },
                { key: 'description', label: 'Description', type: 'textarea' },
              ]}
              renderMeta={(item) => (item.price ? <Badge tone="brand" size="sm">{item.price} {item.unit}</Badge> : null)}
              onCreate={async (item) => products.setData(await businessService.create('products', item))}
              onUpdate={async (id, patch) => products.setData(await businessService.update('products', id, patch))}
              onDelete={async (id) => products.setData(await businessService.remove('products', id))}
              onToggle={async (id, active) => products.setData(await businessService.update('products', id, { active }))}
            />
          </CardBody>
        </Card>
      )}

      {tab === 'policies' && (
        <Card>
          <CardHeader title="Policies" description="Cancellation, payment, pets — the rules customers ask about." />
          <CardBody>
            <CrudList
              items={policies.data || []}
              titleKey="title"
              bodyKey="body"
              addLabel="Add policy"
              emptyIcon={ShieldCheck}
              fields={[
                { key: 'title', label: 'Title' },
                { key: 'body', label: 'Details', type: 'textarea', rows: 4 },
              ]}
              onCreate={async (item) => policies.setData(await businessService.create('policies', item))}
              onUpdate={async (id, patch) => policies.setData(await businessService.update('policies', id, patch))}
              onDelete={async (id) => policies.setData(await businessService.remove('policies', id))}
            />
          </CardBody>
        </Card>
      )}

      {tab === 'rules' && (
        <Card>
          <CardHeader title="Booking rules" description="Constraints the AI must respect before confirming anything." />
          <CardBody>
            <CrudList
              items={rules.data || []}
              titleKey="title"
              bodyKey="body"
              addLabel="Add rule"
              emptyIcon={ShieldCheck}
              fields={[
                { key: 'title', label: 'Title' },
                { key: 'body', label: 'Rule', type: 'textarea', rows: 3 },
              ]}
              onCreate={async (item) => rules.setData(await businessService.create('bookingRules', item))}
              onUpdate={async (id, patch) => rules.setData(await businessService.update('bookingRules', id, patch))}
              onDelete={async (id) => rules.setData(await businessService.remove('bookingRules', id))}
              onToggle={async (id, active) => rules.setData(await businessService.update('bookingRules', id, { active }))}
            />
          </CardBody>
        </Card>
      )}
    </>
  )
}
