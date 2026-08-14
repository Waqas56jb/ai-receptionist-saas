import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bot, Eye, FlaskConical, History, RotateCcw, Save, SlidersHorizontal } from 'lucide-react'
import PageHeader from '../../../components/layout/PageHeader'
import { Card, CardBody, CardFooter, CardHeader } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import Modal from '../../../components/ui/Modal'
import { Select, Textarea } from '../../../components/ui/Field'
import { ErrorState } from '../../../components/ui/States'
import useAsync from '../../../hooks/useAsync'
import { useToast } from '../../../context/ToastContext'
import aiService from '../../../services/aiService'
import businessService from '../../../services/businessService'
import { formatDateTime } from '../../../lib/format'

const sections = [
  {
    key: 'system',
    label: 'System instructions',
    help: 'How should your AI behave? This is the foundation of every reply.',
    placeholder: 'You are the AI receptionist for [Business Name]…',
    rows: 7,
  },
  {
    key: 'businessRules',
    label: 'Business rules',
    help: 'What should the AI always do?',
    placeholder: 'Always confirm the dates before quoting a price.',
    rows: 4,
  },
  {
    key: 'restrictions',
    label: 'Restrictions',
    help: 'What should the AI never do?',
    placeholder: 'Never confirm a booking without a contact number.',
    rows: 4,
  },
  {
    key: 'escalation',
    label: 'Escalation rules',
    help: 'When should the AI transfer the customer to a human?',
    placeholder: 'Transfer when the customer asks for a manager or reports a problem.',
    rows: 4,
  },
  {
    key: 'booking',
    label: 'Booking instructions',
    help: 'How should the AI handle booking requests?',
    placeholder: 'Collect dates, party size, name and phone number before confirming.',
    rows: 4,
  },
  {
    key: 'leadQualification',
    label: 'Lead qualification',
    help: 'Which information should the AI collect from leads?',
    placeholder: 'Name, phone, email, dates and budget.',
    rows: 4,
  },
]

export default function PromptConfiguration() {
  const toast = useToast()
  const prompts = useAsync(() => aiService.getPrompts(), [])
  const config = useAsync(() => aiService.getConfig(), [])
  const options = useAsync(() => aiService.getOptions(), [])
  const reference = useAsync(() => businessService.getReferenceData(), [])

  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState(false)

  const setPrompt = (key) => (e) =>
    prompts.setData((prev) => ({ ...prev, prompts: { ...prev.prompts, [key]: e.target.value } }))

  const save = async () => {
    setSaving(true)
    try {
      prompts.setData(await aiService.savePrompts(prompts.data.prompts, 'Prompt updated from the portal'))
      toast.success('Prompt saved as a new version.')
    } finally {
      setSaving(false)
    }
  }

  const restore = async (id) => {
    prompts.setData(await aiService.restoreVersion(id))
    toast.success('Version restored.')
  }

  if (prompts.error) {
    return (
      <Card>
        <ErrorState onRetry={prompts.reload} />
      </Card>
    )
  }

  const p = prompts.data?.prompts
  const versions = prompts.data?.versions || []

  return (
    <>
      <PageHeader
        title="Prompt Configuration"
        description="Shape exactly how your AI receptionist speaks, what it must do and where it must stop."
        breadcrumbs={[{ label: 'AI Training', to: '/app/ai-training' }, { label: 'Prompt Configuration' }]}
        badge={
          config.data && (
            <Badge tone={config.data.promptMode === 'shared' ? 'brand' : 'info'}>
              {config.data.promptMode === 'shared' ? 'Shared prompt' : 'Channel-specific prompts'}
            </Badge>
          )
        }
        actions={
          <>
            <Button as="button" variant="secondary" size="sm" onClick={() => setPreview(true)}>
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
              Preview
            </Button>
            <Button as={Link} to="/app/ai-test" variant="secondary" size="sm">
              <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
              Test AI
            </Button>
            <Button as="button" size="sm" loading={saving} onClick={save}>
              <Save className="h-3.5 w-3.5" aria-hidden="true" />
              Save
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <Card>
            <CardHeader icon={SlidersHorizontal} title="Voice and style" description="How the AI sounds before a single word is written." />
            <CardBody>
              {config.loading ? (
                <div className="h-24 animate-pulse rounded-xl bg-slate-100" />
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <Select
                    label="Personality"
                    options={options.data?.personalities || []}
                    value={config.data.personality}
                    onChange={async (e) => config.setData(await aiService.updateConfig({ personality: e.target.value }))}
                  />
                  <Select
                    label="Tone"
                    options={options.data?.tones || []}
                    value={config.data.tone}
                    onChange={async (e) => config.setData(await aiService.updateConfig({ tone: e.target.value }))}
                  />
                  <Select
                    label="Response length"
                    options={options.data?.responseLengths || []}
                    value={config.data.responseLength}
                    onChange={async (e) => config.setData(await aiService.updateConfig({ responseLength: e.target.value }))}
                  />
                  <Select
                    label="Default language"
                    options={(reference.data?.languages || []).map((l) => ({ value: l.code, label: l.label }))}
                    value={config.data.defaultLanguage}
                    onChange={async (e) => config.setData(await aiService.updateConfig({ defaultLanguage: e.target.value }))}
                  />
                </div>
              )}
            </CardBody>
          </Card>

          {prompts.loading ? (
            <Card>
              <CardBody>
                <div className="h-72 animate-pulse rounded-xl bg-slate-100" />
              </CardBody>
            </Card>
          ) : (
            sections.map((section) => (
              <Card key={section.key}>
                <CardHeader title={section.label} description={section.help} />
                <CardBody>
                  <Textarea
                    label={null}
                    rows={section.rows}
                    value={p[section.key]}
                    onChange={setPrompt(section.key)}
                    placeholder={section.placeholder}
                    aria-label={section.label}
                  />
                </CardBody>
              </Card>
            ))
          )}

          <Card>
            <CardFooter className="justify-between">
              <p className="text-[0.78rem] text-slate-500">Saving creates a new version you can roll back to.</p>
              <Button as="button" size="sm" loading={saving} onClick={save}>
                <Save className="h-3.5 w-3.5" aria-hidden="true" />
                Save prompt
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader icon={History} title="Version history" description="Every save is kept so you can compare and restore." />
            <CardBody className="space-y-2.5">
              {versions.map((v) => (
                <div
                  key={v.id}
                  className={`rounded-xl border p-3.5 ${v.current ? 'border-brand-300 bg-brand-50/60' : 'border-slate-200 bg-white'}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[0.83rem] font-semibold text-ink-900">{v.label}</span>
                    {v.current ? (
                      <Badge tone="brand" size="sm">Current</Badge>
                    ) : (
                      <button
                        type="button"
                        onClick={() => restore(v.id)}
                        className="inline-flex items-center gap-1 text-[0.72rem] font-semibold text-brand-600 hover:underline"
                      >
                        <RotateCcw className="h-3 w-3" aria-hidden="true" />
                        Restore
                      </button>
                    )}
                  </div>
                  <p className="mt-1 text-[0.75rem] text-slate-500">{v.note}</p>
                  <p className="mt-1 text-[0.7rem] text-slate-400">
                    {v.author} · {formatDateTime(v.createdAt)}
                  </p>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader icon={Bot} title="Writing tips" />
            <CardBody className="space-y-2.5 text-[0.82rem] leading-relaxed text-slate-600">
              <p>Be specific. “Confirm the arrival date before quoting” beats “be helpful”.</p>
              <p>Put hard limits in Restrictions — the AI treats them as absolute.</p>
              <p>Escalation rules should name the exact situations, not feelings.</p>
              <p>Test after every change in the playground before your customers do.</p>
            </CardBody>
          </Card>
        </div>
      </div>

      <Modal open={preview} onClose={() => setPreview(false)} title="Prompt preview" size="lg" description="This is the instruction set sent with every conversation.">
        <pre className="whitespace-pre-wrap rounded-xl bg-ink-900 p-4 font-mono text-[0.75rem] leading-relaxed text-slate-200">
{p && `# SYSTEM
${p.system}

# STYLE
Personality: ${config.data?.personality} · Tone: ${config.data?.tone} · Length: ${config.data?.responseLength}

# ALWAYS
${p.businessRules}

# NEVER
${p.restrictions}

# ESCALATION
${p.escalation}

# BOOKINGS
${p.booking}

# LEAD QUALIFICATION
${p.leadQualification}`}
        </pre>
      </Modal>
    </>
  )
}
