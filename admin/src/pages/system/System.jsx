import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle, Bell, Bot, Building2, CreditCard, Lock, MessageSquare, Plug, RefreshCw,
  Save, Settings as SettingsIcon, ShieldCheck, ToggleLeft, Wrench,
} from 'lucide-react'
import { cn, formatDateTime } from '../../lib/utils'
import PageHeader from '../../components/layout/PageHeader'
import { Card, CardBody, CardFooter, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge, { StatusBadge } from '../../components/ui/Badge'
import { ConfirmDialog } from '../../components/ui/Modal'
import { Input, Select, Textarea } from '../../components/ui/Field'
import { ErrorState } from '../../components/ui/States'
import { MaskedCredential, Tabs, Toggle } from '../../components/ui/Misc'
import { useAsync } from '../../hooks'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import { settingsService } from '../../services/platformService'

/* --------------------------------------------------------------- Settings --- */

const settingTabs = [
  { id: 'general', label: 'General', icon: Building2 },
  { id: 'ai', label: 'AI', icon: Bot },
  { id: 'communication', label: 'Communication', icon: MessageSquare },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Lock },
]

export function PlatformSettings() {
  const toast = useToast()
  const { admin, can } = useAuth()
  const settings = useAsync(() => settingsService.get(), [])
  const [tab, setTab] = useState('general')
  const [busy, setBusy] = useState(false)

  if (settings.error) {
    return (
      <Card>
        <ErrorState onRetry={settings.reload} />
      </Card>
    )
  }
  if (settings.loading || !settings.data) return <div className="h-96 animate-pulse rounded-2xl bg-slate-100" />

  const s = settings.data
  const setField = (section, key) => (e) =>
    settings.setData({ ...s, [section]: { ...s[section], [key]: e.target.value } })
  const setToggle = (section, key) => (value) =>
    settings.setData({ ...s, [section]: { ...s[section], [key]: value } })

  const save = async (section) => {
    setBusy(true)
    try {
      settings.setData(await settingsService.update(section, s[section], admin?.name))
      toast.success('Settings saved.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <PageHeader title="Platform settings" description="Defaults that apply across every business on the platform." />

      <Tabs tabs={settingTabs} value={tab} onChange={setTab} className="mb-5" size="sm" />

      {tab === 'general' && (
        <Card>
          <CardHeader icon={Building2} title="General" />
          <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Platform name" value={s.general.platformName} onChange={setField('general', 'platformName')} />
            <Input label="Support email" type="email" value={s.general.supportEmail} onChange={setField('general', 'supportEmail')} />
            <Input label="Contact email" type="email" value={s.general.contactEmail} onChange={setField('general', 'contactEmail')} />
            <Select label="Default timezone" options={['Europe/Paris', 'Europe/London', 'America/New_York', 'Asia/Dubai', 'Asia/Karachi']} value={s.general.timezone} onChange={setField('general', 'timezone')} />
            <Select label="Default currency" options={['EUR', 'GBP', 'USD', 'AED']} value={s.general.currency} onChange={setField('general', 'currency')} />
          </CardBody>
          <CardFooter>
            <Button size="sm" loading={busy} disabled={!can('system.settings')} onClick={() => save('general')}>
              <Save className="h-3.5 w-3.5" aria-hidden="true" />
              Save
            </Button>
          </CardFooter>
        </Card>
      )}

      {tab === 'ai' && (
        <Card>
          <CardHeader icon={Bot} title="AI defaults" description="Applied to new businesses; each can override them in their own portal." />
          <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select label="Default language" options={['English', 'French', 'German', 'Spanish', 'Arabic']} value={s.ai.defaultLanguage} onChange={setField('ai', 'defaultLanguage')} />
            <Select label="Default personality" options={['Professional', 'Friendly', 'Formal', 'Hospitality', 'Healthcare']} value={s.ai.defaultPersonality} onChange={setField('ai', 'defaultPersonality')} />
            <Input label="Max AI minutes per call" type="number" value={s.ai.maxAiMinutesPerCall} onChange={setField('ai', 'maxAiMinutesPerCall')} />
            <Input label="Max knowledge documents" type="number" value={s.ai.maxKnowledgeDocs} onChange={setField('ai', 'maxKnowledgeDocs')} />
            <Input className="sm:col-span-2" label="AI provider" value={s.ai.provider} onChange={setField('ai', 'provider')} help="Provider credentials live in Integrations and are never shown in full." />
          </CardBody>
          <CardFooter>
            <Button size="sm" loading={busy} disabled={!can('system.settings')} onClick={() => save('ai')}>
              <Save className="h-3.5 w-3.5" aria-hidden="true" />
              Save
            </Button>
          </CardFooter>
        </Card>
      )}

      {tab === 'communication' && (
        <Card>
          <CardHeader icon={MessageSquare} title="Communication" />
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Input label="Voice provider" value={s.communication.voiceProvider} onChange={setField('communication', 'voiceProvider')} />
              <Input label="WhatsApp provider" value={s.communication.whatsappProvider} onChange={setField('communication', 'whatsappProvider')} />
              <Input label="Instagram provider" value={s.communication.instagramProvider} onChange={setField('communication', 'instagramProvider')} />
            </div>
            <Toggle checked={s.communication.recordCalls} onChange={setToggle('communication', 'recordCalls')} label="Record calls by default" description="Businesses can still turn recording off for their own account." />
            <Toggle checked={s.communication.storeTranscripts} onChange={setToggle('communication', 'storeTranscripts')} label="Store transcripts" description="Transcripts power the conversation history and analytics." />
          </CardBody>
          <CardFooter>
            <Button size="sm" loading={busy} disabled={!can('system.settings')} onClick={() => save('communication')}>
              <Save className="h-3.5 w-3.5" aria-hidden="true" />
              Save
            </Button>
          </CardFooter>
        </Card>
      )}

      {tab === 'billing' && (
        <Card>
          <CardHeader icon={CreditCard} title="Billing" />
          <CardBody className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select label="Currency" options={['EUR', 'GBP', 'USD', 'AED']} value={s.billing.currency} onChange={setField('billing', 'currency')} />
            <Input label="Tax rate (%)" type="number" value={s.billing.taxRate} onChange={setField('billing', 'taxRate')} />
            <Input label="Tax label" value={s.billing.taxLabel} onChange={setField('billing', 'taxLabel')} />
            <Input label="Invoice prefix" value={s.billing.invoicePrefix} onChange={setField('billing', 'invoicePrefix')} />
            <Input label="Dunning retries" type="number" value={s.billing.dunningRetries} onChange={setField('billing', 'dunningRetries')} help="How many times a failed card is retried before suspension." />
          </CardBody>
          <CardFooter>
            <Button size="sm" loading={busy} disabled={!can('system.settings')} onClick={() => save('billing')}>
              <Save className="h-3.5 w-3.5" aria-hidden="true" />
              Save
            </Button>
          </CardFooter>
        </Card>
      )}

      {tab === 'notifications' && (
        <Card>
          <CardHeader icon={Bell} title="System alerts" description="What the platform emails your admin team about." />
          <CardBody className="space-y-4">
            {[
              ['failedPayments', 'Failed payments', 'When a customer card is declined.'],
              ['newBusiness', 'New business registered', 'Every time a business signs up.'],
              ['usageAlerts', 'Usage alerts', 'When a business passes 80% of its allowance.'],
              ['aiErrors', 'AI and channel errors', 'Webhook failures, expired tokens and AI outages.'],
              ['weeklyDigest', 'Weekly digest', 'A Monday summary of platform activity.'],
            ].map(([key, label, description]) => (
              <Toggle key={key} checked={s.notifications[key]} onChange={setToggle('notifications', key)} label={label} description={description} />
            ))}
          </CardBody>
          <CardFooter>
            <Button size="sm" loading={busy} disabled={!can('system.settings')} onClick={() => save('notifications')}>
              <Save className="h-3.5 w-3.5" aria-hidden="true" />
              Save
            </Button>
          </CardFooter>
        </Card>
      )}

      {tab === 'security' && (
        <Card>
          <CardHeader icon={Lock} title="Security policy" description="Rules applied to admin and business accounts." />
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Input label="Minimum password length" type="number" value={s.security.minPasswordLength} onChange={setField('security', 'minPasswordLength')} />
              <Input label="Session duration (hours)" type="number" value={s.security.sessionHours} onChange={setField('security', 'sessionHours')} />
              <Input label="Lockout after failed attempts" type="number" value={s.security.lockoutAttempts} onChange={setField('security', 'lockoutAttempts')} />
            </div>
            <Toggle
              checked={s.security.requireTwoFactor}
              onChange={setToggle('security', 'requireTwoFactor')}
              label="Require two-factor authentication for admins"
              description="Administrators without 2FA are prompted to enable it at the next sign-in."
            />
          </CardBody>
          <CardFooter>
            <Button size="sm" loading={busy} disabled={!can('system.settings')} onClick={() => save('security')}>
              <Save className="h-3.5 w-3.5" aria-hidden="true" />
              Save
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  )
}

/* ----------------------------------------------------------- Integrations --- */

export function Integrations() {
  const toast = useToast()
  const { can } = useAuth()
  const integrations = useAsync(() => settingsService.getIntegrations(), [])
  const [testing, setTesting] = useState(null)

  return (
    <>
      <PageHeader
        title="Integrations"
        description="Platform-level connections to the services the product depends on."
        breadcrumbs={[{ label: 'System' }, { label: 'Integrations' }]}
      />

      <div className="mb-4 flex items-start gap-3 rounded-2xl border border-primary-400/30 bg-primary-500/10 p-4">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" aria-hidden="true" />
        <p className="text-[0.84rem] leading-relaxed text-primary-300">
          Credentials are held by the backend. This console only ever shows a masked preview, and
          nothing is written into the frontend bundle or browser storage.
        </p>
      </div>

      {integrations.loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => <div key={i} className="h-52 animate-pulse rounded-2xl bg-slate-100" />)}
        </div>
      )}

      {integrations.data && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {integrations.data.map((integration) => (
            <Card key={integration.id} className="flex flex-col">
              <CardBody className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-500">
                    <Plug className="h-[1.1rem] w-[1.1rem]" aria-hidden="true" />
                  </span>
                  <StatusBadge status={integration.status} />
                </div>
                <h3 className="mt-4 font-display text-[1rem] font-semibold text-ink-900">{integration.name}</h3>
                <p className="mt-1 text-[0.82rem] leading-relaxed text-slate-500">{integration.description}</p>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[0.78rem] text-slate-500">Credential</span>
                    <MaskedCredential value={integration.credential} />
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[0.78rem] text-slate-500">Last checked</span>
                    <span className="text-[0.78rem] font-medium text-ink-900">{formatDateTime(integration.lastChecked)}</span>
                  </div>
                </div>

                {integration.warning && (
                  <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-[0.76rem] leading-relaxed text-amber-900">
                    {integration.warning}
                  </p>
                )}
              </CardBody>

              <div className="flex items-center gap-2 border-t border-slate-200/80 bg-slate-50/60 px-5 py-3">
                <Button
                  variant="outline"
                  size="xs"
                  loading={testing === integration.id}
                  disabled={!can('system.settings')}
                  onClick={async () => {
                    setTesting(integration.id)
                    try {
                      integrations.setData(await settingsService.testIntegration(integration.id))
                      toast.success(`${integration.name} responded successfully.`)
                    } finally {
                      setTesting(null)
                    }
                  }}
                >
                  <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
                  Test
                </Button>
                <Button
                  variant="outline"
                  size="xs"
                  disabled={!can('system.settings')}
                  onClick={() => toast.info('Credential rotation is handled by the backend once it is connected.')}
                >
                  Configure
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}

/* --------------------------------------------------------- Feature flags --- */

export function FeatureFlags() {
  const toast = useToast()
  const { admin, can } = useAuth()
  const flags = useAsync(() => settingsService.getFeatureFlags(), [])

  const togglePlan = async (flag, plan) => {
    const plans = flag.plans.includes(plan) ? flag.plans.filter((p) => p !== plan) : [...flag.plans, plan]
    flags.setData(await settingsService.setFeaturePlans(flag.id, plans))
  }

  return (
    <>
      <PageHeader
        title="Feature flags"
        description="Turn platform features on or off, globally or per plan."
        breadcrumbs={[{ label: 'System' }, { label: 'Feature flags' }]}
      />

      {flags.loading && <div className="h-96 animate-pulse rounded-2xl bg-slate-100" />}

      {flags.data && (
        <div className="space-y-3">
          {flags.data.map((flag) => (
            <Card key={flag.id}>
              <CardBody>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-[0.96rem] font-semibold text-ink-900">{flag.name}</h3>
                      <Badge tone={flag.enabled ? 'success' : 'neutral'} size="sm" dot>
                        {flag.enabled ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </div>
                    <p className="mt-1 text-[0.83rem] leading-relaxed text-slate-500">{flag.description}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="text-[0.74rem] font-semibold text-slate-500">Available on:</span>
                      {['Starter', 'Professional', 'Enterprise'].map((plan) => {
                        const on = flag.plans.includes(plan)
                        return (
                          <button
                            key={plan}
                            type="button"
                            disabled={!can('system.features')}
                            onClick={() => togglePlan(flag, plan)}
                            aria-pressed={on}
                            className={cn(
                              'rounded-lg border px-2.5 py-1 text-[0.74rem] font-semibold transition-colors disabled:opacity-50',
                              on ? 'border-primary-400/40 bg-primary-500/15 text-primary-400' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300',
                            )}
                          >
                            {plan}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <Toggle
                    checked={flag.enabled}
                    disabled={!can('system.features')}
                    onChange={async (v) => {
                      flags.setData(await settingsService.setFeatureFlag(flag.id, v, admin?.name))
                      toast.success(`${flag.name} ${v ? 'enabled' : 'disabled'} platform-wide.`)
                    }}
                  />
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </>
  )
}

/* ------------------------------------------------------------ Maintenance --- */

export function Maintenance() {
  const toast = useToast()
  const { admin, can } = useAuth()
  const maintenance = useAsync(() => settingsService.getMaintenance(), [])
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)

  if (maintenance.loading || !maintenance.data) return <div className="h-96 animate-pulse rounded-2xl bg-slate-100" />

  const m = maintenance.data
  const set = (key) => (e) => maintenance.setData({ ...m, [key]: e.target.value })

  return (
    <>
      <PageHeader
        title="Maintenance mode"
        description="Take the platform offline for planned work."
        breadcrumbs={[{ label: 'System' }, { label: 'Maintenance' }]}
        badge={<Badge tone={m.enabled ? 'danger' : 'success'} dot>{m.enabled ? 'Maintenance active' : 'Platform live'}</Badge>}
      />

      {m.enabled && (
        <div className="mb-4 flex items-start gap-3 rounded-2xl border border-rose-300 bg-rose-50 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" aria-hidden="true" />
          <div>
            <p className="text-[0.9rem] font-bold text-rose-900">Maintenance mode is on</p>
            <p className="mt-1 text-[0.84rem] leading-relaxed text-rose-900/90">
              Businesses cannot sign in and the AI is not answering. Turn it off as soon as the work is finished.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card>
          <CardHeader icon={Wrench} title="Scheduled maintenance" />
          <CardBody className="space-y-4">
            <Textarea label="Message shown to businesses" rows={3} value={m.message} onChange={set('message')} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input label="Start" type="datetime-local" value={m.start} onChange={set('start')} />
              <Input label="End" type="datetime-local" value={m.end} onChange={set('end')} />
            </div>
            <Select label="Affected users" options={['All businesses', 'Starter', 'Professional', 'Enterprise']} value={m.audience} onChange={set('audience')} />
          </CardBody>
          <CardFooter>
            <Button
              size="sm"
              variant="secondary"
              loading={busy}
              disabled={!can('system.maintenance')}
              onClick={async () => {
                setBusy(true)
                try {
                  maintenance.setData(await settingsService.setMaintenance(m, admin?.name))
                  toast.success('Maintenance window saved.')
                } finally {
                  setBusy(false)
                }
              }}
            >
              <Save className="h-3.5 w-3.5" aria-hidden="true" />
              Save window
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader icon={ToggleLeft} title="Maintenance switch" />
          <CardBody>
            <p className="text-[0.84rem] leading-relaxed text-slate-600">
              Turning this on immediately blocks sign-in for every business and stops the AI from
              answering calls and messages.
            </p>
            <Button
              variant={m.enabled ? 'secondary' : 'danger'}
              size="sm"
              className="mt-4 w-full"
              disabled={!can('system.maintenance')}
              onClick={() => setConfirming(true)}
            >
              {m.enabled ? 'Turn maintenance off' : 'Turn maintenance on'}
            </Button>
          </CardBody>
        </Card>
      </div>

      <ConfirmDialog
        open={confirming}
        onClose={() => setConfirming(false)}
        onConfirm={async () => {
          setBusy(true)
          try {
            maintenance.setData(await settingsService.setMaintenance({ enabled: !m.enabled }, admin?.name))
            toast[!m.enabled ? 'warning' : 'success'](!m.enabled ? 'Maintenance mode is now ON.' : 'Maintenance mode is off — the platform is live.')
            setConfirming(false)
          } finally {
            setBusy(false)
          }
        }}
        loading={busy}
        tone={m.enabled ? 'primary' : 'danger'}
        title={m.enabled ? 'Turn maintenance mode off?' : 'Turn maintenance mode on?'}
        description={m.enabled ? 'Businesses will be able to sign in again and the AI resumes answering.' : 'Every business is locked out and the AI stops answering calls and messages.'}
        warning={!m.enabled ? 'This affects every customer on the platform immediately.' : undefined}
        confirmLabel={m.enabled ? 'Turn off' : 'Turn on maintenance'}
        confirmPhrase={!m.enabled ? 'MAINTENANCE' : undefined}
      />
    </>
  )
}
