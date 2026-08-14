import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Clock,
  Database,
  Instagram,
  MessageSquare,
  Mic,
  Radio,
  Sparkles,
  Plus,
  X,
} from 'lucide-react'
import cn from '../../lib/cn'
import Logo from '../../components/ui/Logo'
import Button from '../../components/ui/Button'
import { Input, RadioCard, Select, Textarea } from '../../components/ui/Field'
import Badge from '../../components/ui/Badge'
import BusinessHoursEditor from '../../components/business/BusinessHoursEditor'
import CrudList from '../../components/business/CrudList'
import ConfigModeDiagram from '../../components/ai/ConfigModeDiagram'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import businessService from '../../services/businessService'
import aiService from '../../services/aiService'
import channelService from '../../services/channelService'

const steps = [
  { id: 1, label: 'Business', icon: Building2 },
  { id: 2, label: 'Hours', icon: Clock },
  { id: 3, label: 'Knowledge', icon: Database },
  { id: 4, label: 'Channels', icon: Radio },
  { id: 5, label: 'AI setup', icon: Sparkles },
]

const channelIcons = { voice: Mic, whatsapp: MessageSquare, instagram: Instagram, web: Radio }

export default function Onboarding() {
  const navigate = useNavigate()
  const toast = useToast()
  const reduceMotion = useReducedMotion()
  const { completeOnboarding, updateBusiness } = useAuth()

  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [reference, setReference] = useState({ businessTypes: [], countries: [], timezones: [] })
  const [business, setBusiness] = useState(null)
  const [hours, setHours] = useState([])
  const [services, setServices] = useState([])
  const [policies, setPolicies] = useState([])
  const [amenities, setAmenities] = useState([])
  const [amenityDraft, setAmenityDraft] = useState('')
  const [instructions, setInstructions] = useState('')
  const [channels, setChannels] = useState([])
  const [connecting, setConnecting] = useState(null)
  const [mode, setMode] = useState('shared')

  useEffect(() => {
    Promise.all([
      businessService.getReferenceData(),
      businessService.getBusiness(),
      businessService.getHours(),
      businessService.list('services'),
      businessService.list('policies'),
      channelService.list(),
    ]).then(([ref, biz, hrs, svc, pol, chs]) => {
      setReference(ref)
      setBusiness(biz)
      setHours(hrs)
      setServices(svc)
      setPolicies(pol)
      setAmenities(ref.amenities || [])
      setChannels(chs)
    })
  }, [])

  const setField = (key) => (e) => setBusiness((prev) => ({ ...prev, [key]: e.target.value }))

  const progress = useMemo(() => Math.round(((step - 1) / (steps.length - 1)) * 100), [step])

  const next = async () => {
    if (step === 1) {
      await businessService.updateBusiness(business)
      updateBusiness({ name: business.name })
    }
    if (step === 2) await businessService.updateHours(hours)
    if (step === 5) return finish()
    setStep((s) => Math.min(steps.length, s + 1))
    return undefined
  }

  const finish = async () => {
    setSaving(true)
    try {
      await aiService.updateConfig({ knowledgeMode: mode, promptMode: mode })
      completeOnboarding()
      toast.success('Setup complete — your AI receptionist is ready.')
      navigate('/app/dashboard', { replace: true })
    } finally {
      setSaving(false)
    }
  }

  const connect = async (id) => {
    setConnecting(id)
    try {
      setChannels(await channelService.connect(id))
      toast.success('Channel connected.')
    } finally {
      setConnecting(null)
    }
  }

  const skip = () => {
    completeOnboarding()
    navigate('/app/dashboard', { replace: true })
  }

  if (!business) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-500">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-brand-600" />
          <span className="text-sm">Loading your setup…</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/70">
      <header className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Logo size="sm" />
          <button type="button" onClick={skip} className="text-[0.8rem] font-semibold text-slate-500 transition-colors hover:text-ink-900">
            Skip for now
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-12">
        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between gap-1">
            {steps.map((s) => {
              const done = step > s.id
              const active = step === s.id
              return (
                <div key={s.id} className="flex flex-1 flex-col items-center gap-2">
                  <span
                    className={cn(
                      'grid h-9 w-9 shrink-0 place-items-center rounded-xl border text-[0.8rem] font-bold transition-colors',
                      done && 'border-brand-600 bg-brand-600 text-white',
                      active && !done && 'border-brand-600 bg-white text-brand-700',
                      !done && !active && 'border-slate-200 bg-white text-slate-400',
                    )}
                  >
                    {done ? <Check className="h-4 w-4" aria-hidden="true" /> : <s.icon className="h-4 w-4" aria-hidden="true" />}
                  </span>
                  <span className={cn('hidden text-[0.72rem] font-semibold sm:block', active ? 'text-ink-900' : 'text-slate-400')}>
                    {s.label}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-brand-600 transition-[width] duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-7"
          >
            {step === 1 && (
              <section>
                <h1 className="font-display text-xl font-bold text-ink-900">Tell us about your business</h1>
                <p className="mt-1.5 text-[0.88rem] text-slate-500">
                  Your AI receptionist uses this to introduce itself and answer basic questions.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label="Business name" value={business.name} onChange={setField('name')} required />
                  <Select label="Business type" options={reference.businessTypes} value={business.type} onChange={setField('type')} />
                  <Textarea
                    className="sm:col-span-2"
                    label="Business description"
                    rows={3}
                    value={business.description}
                    onChange={setField('description')}
                    help="A short paragraph describing what you offer and who your customers are."
                  />
                  <Input label="Website" value={business.website || ''} onChange={setField('website')} placeholder="https://" />
                  <Input label="Email" type="email" value={business.email} onChange={setField('email')} />
                  <Input label="Phone" value={business.phone} onChange={setField('phone')} />
                  <Input label="Address" value={business.address} onChange={setField('address')} />
                  <Select label="Country" options={reference.countries} value={business.country} onChange={setField('country')} />
                  <Select label="Timezone" options={reference.timezones} value={business.timezone} onChange={setField('timezone')} />
                </div>
              </section>
            )}

            {step === 2 && (
              <section>
                <h1 className="font-display text-xl font-bold text-ink-900">When are you open?</h1>
                <p className="mt-1.5 text-[0.88rem] text-slate-500">
                  The AI answers around the clock — these hours decide when it can confirm bookings
                  and when it should say your team is offline.
                </p>
                <BusinessHoursEditor hours={hours} onChange={setHours} className="mt-6" />
              </section>
            )}

            {step === 3 && (
              <section>
                <h1 className="font-display text-xl font-bold text-ink-900">Add your business knowledge</h1>
                <p className="mt-1.5 text-[0.88rem] text-slate-500">
                  Anything you add here becomes an answer the AI can give. You can add much more later.
                </p>

                <div className="mt-6 space-y-8">
                  <div>
                    <h2 className="text-[0.85rem] font-bold uppercase tracking-wider text-slate-500">Services & prices</h2>
                    <CrudList
                      className="mt-3"
                      items={services}
                      addLabel="Add service"
                      emptyIcon={Database}
                      emptyTitle="No services yet"
                      emptyDescription="Add what you sell so the AI can quote it accurately."
                      fields={[
                        { key: 'name', label: 'Name', placeholder: 'Deluxe King Room' },
                        { key: 'price', label: 'Price', type: 'number', placeholder: '180' },
                        { key: 'unit', label: 'Unit', placeholder: 'per night' },
                        { key: 'description', label: 'Description', type: 'textarea' },
                      ]}
                      renderMeta={(item) => item.price ? <Badge tone="brand" size="sm">{item.price} {item.unit}</Badge> : null}
                      onCreate={async (item) => setServices(await businessService.create('services', item))}
                      onUpdate={async (id, patch) => setServices(await businessService.update('services', id, patch))}
                      onDelete={async (id) => setServices(await businessService.remove('services', id))}
                    />
                  </div>

                  <div>
                    <h2 className="text-[0.85rem] font-bold uppercase tracking-wider text-slate-500">Policies & FAQs</h2>
                    <CrudList
                      className="mt-3"
                      items={policies}
                      titleKey="title"
                      bodyKey="body"
                      addLabel="Add policy"
                      emptyIcon={Database}
                      emptyTitle="No policies yet"
                      emptyDescription="Cancellation, check-in, payment — the questions customers ask most."
                      fields={[
                        { key: 'title', label: 'Title', placeholder: 'Cancellation' },
                        { key: 'body', label: 'Details', type: 'textarea', rows: 4 },
                      ]}
                      onCreate={async (item) => setPolicies(await businessService.create('policies', item))}
                      onUpdate={async (id, patch) => setPolicies(await businessService.update('policies', id, patch))}
                      onDelete={async (id) => setPolicies(await businessService.remove('policies', id))}
                    />
                  </div>

                  <div>
                    <h2 className="text-[0.85rem] font-bold uppercase tracking-wider text-slate-500">Amenities</h2>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {amenities.map((a) => (
                        <span key={a} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[0.8rem] text-slate-700">
                          {a}
                          <button
                            type="button"
                            onClick={() => setAmenities((prev) => prev.filter((x) => x !== a))}
                            className="text-slate-400 transition-colors hover:text-rose-600"
                            aria-label={`Remove ${a}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Input
                        className="flex-1"
                        value={amenityDraft}
                        onChange={(e) => setAmenityDraft(e.target.value)}
                        placeholder="Free Wi-Fi"
                        aria-label="New amenity"
                      />
                      <Button
                        as="button"
                        variant="secondary"
                        size="md"
                        onClick={() => {
                          if (!amenityDraft.trim()) return
                          setAmenities((prev) => [...prev, amenityDraft.trim()])
                          setAmenityDraft('')
                        }}
                      >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                        Add
                      </Button>
                    </div>
                  </div>

                  <Textarea
                    label="Important instructions for the AI"
                    rows={4}
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Always confirm dates before quoting a price. Never promise availability without checking."
                    help="Anything the AI must always or never do."
                  />
                </div>
              </section>
            )}

            {step === 4 && (
              <section>
                <h1 className="font-display text-xl font-bold text-ink-900">Connect your channels</h1>
                <p className="mt-1.5 text-[0.88rem] text-slate-500">
                  Connect at least one channel now — you can add the others whenever you are ready.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {channels
                    .filter((c) => c.id !== 'web')
                    .map((channel) => {
                      const Icon = channelIcons[channel.id]
                      return (
                        <div key={channel.id} className="rounded-xl border border-slate-200 bg-white p-5">
                          <span className={cn('grid h-10 w-10 place-items-center rounded-xl', channel.connected ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400')}>
                            <Icon className="h-[1.15rem] w-[1.15rem]" aria-hidden="true" />
                          </span>
                          <p className="mt-4 text-[0.9rem] font-semibold text-ink-900">{channel.name}</p>
                          <p className="mt-1 text-[0.8rem] leading-relaxed text-slate-500">{channel.description}</p>
                          <div className="mt-4">
                            {channel.connected ? (
                              <Badge tone="success" dot>
                                Connected
                              </Badge>
                            ) : (
                              <Button
                                as="button"
                                size="sm"
                                variant="secondary"
                                loading={connecting === channel.id}
                                onClick={() => connect(channel.id)}
                              >
                                Connect
                              </Button>
                            )}
                          </div>
                        </div>
                      )
                    })}
                </div>

                <p className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 text-[0.8rem] leading-relaxed text-slate-500">
                  This demo connects channels instantly. In the live product you will paste provider
                  credentials, which are sent straight to the backend and never stored in the browser.
                </p>
              </section>
            )}

            {step === 5 && (
              <section>
                <h1 className="font-display text-xl font-bold text-ink-900">How should your AI be configured?</h1>
                <p className="mt-1.5 text-[0.88rem] text-slate-500">
                  You can change this at any time from the AI configuration page.
                </p>

                <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <RadioCard
                    name="ai-mode"
                    value="shared"
                    checked={mode === 'shared'}
                    onChange={() => setMode('shared')}
                    icon={Sparkles}
                    title="Use one AI configuration for all channels"
                    description="The same knowledge and instructions power Voice, WhatsApp and Instagram. Simplest to manage."
                  />
                  <RadioCard
                    name="ai-mode"
                    value="separate"
                    checked={mode === 'separate'}
                    onChange={() => setMode('separate')}
                    icon={Radio}
                    title="Configure each channel separately"
                    description="Give each channel its own knowledge and prompts — useful when phone and social need different answers."
                  />
                </div>

                <ConfigModeDiagram mode={mode} className="mt-6" />
              </section>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-6 flex items-center justify-between gap-3">
          <Button
            as="button"
            variant="ghost"
            size="md"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            className={cn(step === 1 && 'invisible')}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </Button>

          <div className="flex items-center gap-3">
            <span className="text-[0.78rem] text-slate-400">
              Step {step} of {steps.length}
            </span>
            <Button as="button" size="md" onClick={next} loading={saving}>
              {step === steps.length ? 'Finish setup' : 'Continue'}
              {step !== steps.length && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
