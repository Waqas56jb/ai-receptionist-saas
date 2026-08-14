import { useState } from 'react'
import { Copy, Link2, Save, Send, Unplug } from 'lucide-react'
import PageHeader from '../layout/PageHeader'
import { Card, CardBody, CardFooter, CardHeader } from '../ui/Card'
import Button from '../ui/Button'
import Badge from '../ui/Badge'
import Toggle from '../ui/Toggle'
import { Input, Select, Textarea } from '../ui/Field'
import SecureCredentialInput, { SecretsNotice } from '../ui/SecureCredentialInput'
import { ErrorState } from '../ui/States'
import AIStatusCard from './AIStatusCard'
import SourceSelector from './SourceSelector'
import useAsync from '../../hooks/useAsync'
import { useToast } from '../../context/ToastContext'
import aiService from '../../services/aiService'
import channelService from '../../services/channelService'
import businessService from '../../services/businessService'

/**
 * Shared configuration screen for the WhatsApp and Instagram agents — the two
 * channels differ only in provider fields, identifiers and automation toggles.
 */
export default function MessagingAgentPage({
  channelId,
  title,
  description,
  icon: Icon,
  identifierField,
  automationLabels,
  connectHelp,
}) {
  const toast = useToast()
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [connecting, setConnecting] = useState(false)

  const settings = useAsync(() => aiService.getChannelSettings(channelId), [channelId])
  const options = useAsync(() => aiService.getOptions(), [])
  const config = useAsync(() => aiService.getConfig(), [])
  const channels = useAsync(() => channelService.list(), [])
  const credentials = useAsync(() => channelService.getCredentials(channelId), [channelId])
  const webhooks = useAsync(() => channelService.getWebhookUrls(), [])
  const reference = useAsync(() => businessService.getReferenceData(), [])

  const channel = (channels.data || []).find((c) => c.id === channelId)
  const set = (key) => (value) => settings.setData((prev) => ({ ...prev, [key]: value }))
  const setField = (key) => (e) => set(key)(e.target.value)
  const setAutomation = (key) => (value) =>
    settings.setData((prev) => ({ ...prev, automation: { ...prev.automation, [key]: value } }))

  const save = async () => {
    setSaving(true)
    try {
      settings.setData(await aiService.updateChannelSettings(channelId, settings.data))
      toast.success(`${title} configuration saved.`)
    } finally {
      setSaving(false)
    }
  }

  const connect = async () => {
    setConnecting(true)
    try {
      channels.setData(await channelService.connect(channelId, settings.data?.[identifierField.key]))
      toast.success(`${title} connected.`)
    } finally {
      setConnecting(false)
    }
  }

  const disconnect = async () => {
    channels.setData(await channelService.disconnect(channelId))
    toast.info(`${title} disconnected.`)
  }

  const test = async () => {
    setTesting(true)
    try {
      const res = await aiService.testMessage(title)
      toast.success(res.message)
    } finally {
      setTesting(false)
    }
  }

  const copyWebhook = async () => {
    try {
      await navigator.clipboard.writeText(webhooks.data?.[channelId] || '')
      toast.success('Webhook URL copied.')
    } catch {
      toast.error('Could not copy — select the text manually.')
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
        title={title}
        description={description}
        badge={
          channel && (
            <Badge tone={channel.connected ? 'success' : 'neutral'} dot>
              {channel.connected ? 'Connected' : 'Not connected'}
            </Badge>
          )
        }
        actions={
          <>
            <Button as="button" variant="secondary" size="sm" loading={testing} onClick={test} disabled={!channel?.connected}>
              <Send className="h-3.5 w-3.5" aria-hidden="true" />
              Send Test Message
            </Button>
            <Button as="button" size="sm" loading={saving} onClick={save}>
              <Save className="h-3.5 w-3.5" aria-hidden="true" />
              Save Configuration
            </Button>
          </>
        }
      />

      {settings.loading ? (
        <div className="h-96 animate-pulse rounded-2xl bg-slate-100" />
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            <Card>
              <CardHeader
                icon={Icon}
                title="Connection"
                description={connectHelp}
                action={
                  channel?.connected ? (
                    <Button as="button" variant="outline" size="sm" onClick={disconnect}>
                      <Unplug className="h-3.5 w-3.5" aria-hidden="true" />
                      Disconnect
                    </Button>
                  ) : (
                    <Button as="button" size="sm" loading={connecting} onClick={connect}>
                      <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
                      Connect {title.replace(' Agent', '')}
                    </Button>
                  )
                }
              />
              <CardBody className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label={identifierField.label} value={s[identifierField.key] || ''} onChange={setField(identifierField.key)} placeholder={identifierField.placeholder} />
                  {'displayName' in s && <Input label="Display name" value={s.displayName || ''} onChange={setField('displayName')} />}
                </div>

                <SecretsNotice />

                <div className="space-y-3">
                  {(credentials.data || []).map((credential) => (
                    <SecureCredentialInput
                      key={credential.key}
                      credential={credential}
                      onSave={async (value) => {
                        credentials.setData(await channelService.saveCredential(channelId, credential.key, value))
                        toast.success(`${credential.label} saved securely.`)
                      }}
                      onRemove={async () => {
                        credentials.setData(await channelService.removeCredential(channelId, credential.key))
                        toast.success(`${credential.label} removed.`)
                      }}
                    />
                  ))}
                </div>

                <div>
                  <p className="mb-1.5 text-[0.8rem] font-semibold text-ink-900">Webhook URL</p>
                  <div className="flex gap-2">
                    <input
                      readOnly
                      value={webhooks.data?.[channelId] || ''}
                      className="h-10 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 font-mono text-[0.75rem] text-slate-600"
                      aria-label="Webhook URL"
                    />
                    <Button as="button" variant="outline" size="sm" onClick={copyWebhook}>
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      Copy
                    </Button>
                  </div>
                  <p className="mt-1.5 text-[0.72rem] text-slate-500">
                    Add this URL and your verify token in the Meta app's webhook settings.
                  </p>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Agent settings" description="How the AI behaves on this channel." />
              <CardBody className="space-y-4">
                <Toggle
                  checked={s.enabled}
                  onChange={set('enabled')}
                  label={`${title.replace(' Agent', '')} agent enabled`}
                  description="When off, messages are left for your team to answer."
                />

                <Textarea label="Greeting" rows={2} value={s.greeting} onChange={setField('greeting')} />
                <Textarea
                  label="System instructions"
                  rows={4}
                  value={s.instructions}
                  onChange={setField('instructions')}
                  help="Channel-specific guidance layered on top of your main prompt."
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

                <Toggle checked={s.humanHandoff} onChange={set('humanHandoff')} label="Human handoff" description="Pass the conversation to your team when the customer asks." />
                <Toggle
                  checked={s.respectBusinessHours}
                  onChange={set('respectBusinessHours')}
                  label="Respect business hours"
                  description="Use your after-hours behaviour when you are closed."
                />

                {'afterHoursMessage' in s && (
                  <Textarea label="After-hours message" rows={2} value={s.afterHoursMessage} onChange={setField('afterHoursMessage')} />
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Knowledge and prompt source" />
              <CardBody className="space-y-6">
                <SourceSelector
                  kind="knowledge"
                  name={`${channelId}-knowledge`}
                  value={s.knowledgeSource}
                  channelKnowledge={options.data?.channelKnowledge || {}}
                  onChange={set('knowledgeSource')}
                />
                <SourceSelector
                  kind="prompt"
                  name={`${channelId}-prompt`}
                  value={s.promptSource}
                  channelKnowledge={options.data?.channelKnowledge || {}}
                  onChange={set('promptSource')}
                />
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Automation" description="What the AI is allowed to handle on its own." />
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
              <CardHeader icon={Send} title="Test this channel" />
              <CardBody>
                <p className="text-[0.83rem] leading-relaxed text-slate-600">
                  Send a test message to your connected account and check the reply the AI produces.
                </p>
                <Button
                  as="button"
                  variant="secondary"
                  size="sm"
                  className="mt-4 w-full"
                  loading={testing}
                  onClick={test}
                  disabled={!channel?.connected}
                >
                  <Send className="h-3.5 w-3.5" aria-hidden="true" />
                  Send Test Message
                </Button>
                {!channel?.connected && (
                  <p className="mt-2 text-center text-[0.72rem] text-slate-400">Connect the channel first.</p>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Setup checklist" />
              <CardBody>
                <ul className="space-y-2.5 text-[0.82rem]">
                  {[
                    ['Credentials saved', (credentials.data || []).some((c) => c.saved)],
                    ['Channel connected', Boolean(channel?.connected)],
                    ['Greeting written', Boolean(s.greeting)],
                    ['Agent enabled', s.enabled],
                  ].map(([label, done]) => (
                    <li key={label} className="flex items-center justify-between gap-3">
                      <span className="text-slate-600">{label}</span>
                      <Badge tone={done ? 'success' : 'warning'} size="sm">
                        {done ? 'Done' : 'To do'}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </>
  )
}
