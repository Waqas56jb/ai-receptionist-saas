import { useState } from 'react'
import { MessageSquare, Save } from 'lucide-react'
import PageHeader from '../../../components/layout/PageHeader'
import { Card, CardBody, CardFooter, CardHeader } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import Toggle from '../../../components/ui/Toggle'
import { Select, Textarea } from '../../../components/ui/Field'
import { ErrorState } from '../../../components/ui/States'
import AIStatusCard from '../../../components/ai/AIStatusCard'
import SourceSelector from '../../../components/ai/SourceSelector'
import WhatsAppQrConnect from '../../../components/ai/WhatsAppQrConnect'
import useAsync from '../../../hooks/useAsync'
import { useToast } from '../../../context/ToastContext'
import aiService from '../../../services/aiService'
import channelService from '../../../services/channelService'
import businessService from '../../../services/businessService'

const automationLabels = {
  autoReply: { label: 'Auto reply', description: 'Answer incoming messages without waiting for your team.' },
  leadCapture: { label: 'Lead capture', description: 'Collect name, contact details and intent, then create a lead.' },
  bookingEnquiries: { label: 'Booking enquiries', description: 'Take booking requests and confirm availability.' },
  faqHandling: { label: 'FAQ handling', description: 'Answer common questions straight from your knowledge base.' },
  humanEscalation: { label: 'Human escalation', description: 'Hand over to your team when the AI is unsure or asked.' },
}

export default function WhatsAppAgent() {
  const toast = useToast()
  const [saving, setSaving] = useState(false)
  const settings = useAsync(() => aiService.getChannelSettings('whatsapp'), [])
  const options = useAsync(() => aiService.getOptions(), [])
  const config = useAsync(() => aiService.getConfig(), [])
  const channels = useAsync(() => channelService.list(), [])
  const reference = useAsync(() => businessService.getReferenceData(), [])

  const channel = (channels.data || []).find((item) => item.id === 'whatsapp')
  const set = (key) => (value) => settings.setData((prev) => ({ ...prev, [key]: value }))
  const setField = (key) => (e) => set(key)(e.target.value)
  const setAutomation = (key) => (value) =>
    settings.setData((prev) => ({ ...prev, automation: { ...prev.automation, [key]: value } }))

  const save = async () => {
    setSaving(true)
    try {
      settings.setData(await aiService.updateChannelSettings('whatsapp', settings.data))
      toast.success('WhatsApp agent saved.')
    } finally {
      setSaving(false)
    }
  }

  if (settings.error) {
    return (
      <Card>
        <ErrorState onRetry={settings.reload} />
      </Card>
    )
  }

  const s = settings.data

  return (
    <>
      <PageHeader
        title="WhatsApp Agent"
        description="Scan a QR code to go live. Each account keeps its own chats, knowledge and history."
        badge={
          channel && (
            <Badge tone={channel.connected ? 'success' : 'neutral'} dot>
              {channel.connected ? 'Connected' : 'QR ready'}
            </Badge>
          )
        }
        actions={
          <Button as="button" size="sm" loading={saving} onClick={save} disabled={!s}>
            <Save className="h-3.5 w-3.5" aria-hidden="true" />
            Save Configuration
          </Button>
        }
      />

      {settings.loading || !s ? (
        <div className="h-96 animate-pulse rounded-2xl bg-surface-2" />
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            <WhatsAppQrConnect />

            <Card>
              <CardHeader title="Agent settings" description="How the AI behaves on WhatsApp after the number is linked." />
              <CardBody className="space-y-4">
                <Toggle
                  checked={s.enabled}
                  onChange={set('enabled')}
                  label="WhatsApp agent enabled"
                  description="When off, messages stay in the inbox for your team."
                />
                <Textarea label="Greeting" rows={2} value={s.greeting} onChange={setField('greeting')} />
                <Textarea
                  label="System instructions"
                  rows={4}
                  value={s.instructions}
                  onChange={setField('instructions')}
                  help="Layered on top of your knowledge base. Voice notes are answered with an OpenAI voice message."
                />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Select
                    label="Language"
                    options={(reference.data?.languages || []).map((l) => ({ value: l.code, label: l.label }))}
                    value={s.language}
                    onChange={setField('language')}
                  />
                  <Select label="Tone" options={options.data?.tones || []} value={s.tone} onChange={setField('tone')} />
                  <Select label="Response length" options={options.data?.responseLengths || []} value={s.responseLength} onChange={setField('responseLength')} />
                </div>
                <Toggle checked={s.humanHandoff} onChange={set('humanHandoff')} label="Human handoff" description="Pass the conversation to your team when asked." />
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Knowledge and prompt source" />
              <CardBody className="space-y-6">
                <SourceSelector
                  kind="knowledge"
                  name="whatsapp-knowledge"
                  value={s.knowledgeSource}
                  channelKnowledge={options.data?.channelKnowledge || {}}
                  onChange={set('knowledgeSource')}
                />
                <SourceSelector
                  kind="prompt"
                  name="whatsapp-prompt"
                  value={s.promptSource}
                  channelKnowledge={options.data?.channelKnowledge || {}}
                  onChange={set('promptSource')}
                />
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Automation" />
              <CardBody className="space-y-4">
                {Object.entries(automationLabels).map(([key, meta]) => (
                  <Toggle
                    key={key}
                    checked={Boolean(s.automation?.[key])}
                    onChange={setAutomation(key)}
                    label={meta.label}
                    description={meta.description}
                  />
                ))}
              </CardBody>
              <CardFooter>
                <Button as="button" size="sm" loading={saving} onClick={save}>
                  <Save className="h-3.5 w-3.5" aria-hidden="true" />
                  Save Configuration
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-4">
            <AIStatusCard config={config.data} channels={channels.data || []} languages={['English', 'French', 'German']} compact />
            <Card>
              <CardHeader title="Voice notes" />
              <CardBody className="text-[0.83rem] leading-relaxed text-muted">
                Customers can send a WhatsApp voice note. The server transcribes it with OpenAI Whisper, answers from
                this account&apos;s knowledge, and sends the reply back as an OpenAI voice message. Text messages stay
                as text.
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </>
  )
}
