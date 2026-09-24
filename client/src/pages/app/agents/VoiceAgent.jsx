import { useState } from 'react'
import { Copy, Mic, PhoneCall, Save, ShieldAlert, Volume2 } from 'lucide-react'
import PageHeader from '../../../components/layout/PageHeader'
import { Card, CardBody, CardFooter, CardHeader } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import Toggle from '../../../components/ui/Toggle'
import { Input, Select, Textarea } from '../../../components/ui/Field'
import SecureCredentialInput, { SecretsNotice } from '../../../components/ui/SecureCredentialInput'
import { ErrorState } from '../../../components/ui/States'
import AIStatusCard from '../../../components/ai/AIStatusCard'
import SourceSelector from '../../../components/ai/SourceSelector'
import useAsync from '../../../hooks/useAsync'
import { useToast } from '../../../context/ToastContext'
import aiService from '../../../services/aiService'
import channelService from '../../../services/channelService'
import businessService from '../../../services/businessService'
import { api } from '../../../services/api'

export default function VoiceAgent() {
  const toast = useToast()
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)

  const settings = useAsync(() => aiService.getChannelSettings('voice'), [])
  const options = useAsync(() => aiService.getOptions(), [])
  const config = useAsync(() => aiService.getConfig(), [])
  const channels = useAsync(() => channelService.list(), [])
  const credentials = useAsync(() => channelService.getCredentials('twilio'), [])
  const webhooks = useAsync(() => channelService.getWebhookUrls(), [])
  const twilio = useAsync(() => api('/voice/status'), [])
  const reference = useAsync(() => businessService.getReferenceData(), [])
  const [testTo, setTestTo] = useState('')

  const channel = (channels.data || []).find((c) => c.id === 'voice')
  const set = (key) => (value) => settings.setData((prev) => ({ ...prev, [key]: value }))
  const setField = (key) => (e) => set(key)(e.target.value)

  const save = async () => {
    setSaving(true)
    try {
      settings.setData(await aiService.updateChannelSettings('voice', settings.data))
      toast.success('Voice configuration saved.')
    } finally {
      setSaving(false)
    }
  }

  const testCall = async () => {
    setTesting(true)
    try {
      const res = await aiService.testCall(testTo || settings.data?.businessNumber)
      toast.success(res.message)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setTesting(false)
    }
  }

  const applyTwilio = async () => {
    setSaving(true)
    try {
      const result = await channelService.provisionTwilio()
      toast.success(result.message)
      settings.reload?.()
      twilio.reload?.()
      webhooks.reload?.()
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSaving(false)
    }
  }

  const copyWebhook = async () => {
    try {
      await navigator.clipboard.writeText(webhooks.data?.voice || '')
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
        title="Voice Agent"
        description="Configure the number customers call and how your AI answers it."
        badge={
          channel && (
            <Badge tone={channel.connected ? 'success' : 'neutral'} dot>
              {channel.connected ? 'Connected' : 'Not connected'}
            </Badge>
          )
        }
        actions={
          <>
            <Button as="button" variant="secondary" size="sm" loading={testing} onClick={testCall}>
              <PhoneCall className="h-3.5 w-3.5" aria-hidden="true" />
              Test Call
            </Button>
            <Button as="button" size="sm" loading={saving} onClick={save}>
              <Save className="h-3.5 w-3.5" aria-hidden="true" />
              Save Configuration
            </Button>
          </>
        }
      />

      {settings.loading || !s ? (
        <div className="h-96 animate-pulse rounded-2xl bg-slate-100" />
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            <Card>
              <CardHeader icon={Mic} title="Voice status" description="Turn the voice agent on or off without disconnecting the number." />
              <CardBody className="space-y-4">
                <Toggle
                  checked={s.enabled}
                  onChange={set('enabled')}
                  label="Voice agent enabled"
                  description="When off, calls ring through to your team instead."
                />
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Phone numbers" description="The number customers dial, and the number the platform answers on." />
              <CardBody>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input label="Business phone number" value={s.businessNumber} onChange={setField('businessNumber')} help="Your number — used for test calls and human transfer." />
                  <Input label="Platform (Twilio) number" value={s.twilioNumber} onChange={setField('twilioNumber')} help="Bought Twilio number for inbound. Empty until Trust Hub approves." />
                  <Input label="Caller ID" value={s.callerId} onChange={setField('callerId')} className="sm:col-span-2" />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader
                title="Twilio configuration"
                description="Credentials are sent to your backend and stored there — never in this app."
              />
              <CardBody className="space-y-4">
                <SecretsNotice />

                <div className="space-y-3">
                  {(credentials.data || []).map((credential) => (
                    <SecureCredentialInput
                      key={credential.key}
                      credential={credential}
                      onSave={async (value) => {
                        credentials.setData(await channelService.saveCredential('twilio', credential.key, value))
                        toast.success(`${credential.label} saved securely.`)
                      }}
                      onRemove={async () => {
                        credentials.setData(await channelService.removeCredential('twilio', credential.key))
                        toast.success(`${credential.label} removed.`)
                      }}
                    />
                  ))}
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4">
                  <p className="flex items-start gap-2.5 text-[0.8rem] leading-relaxed text-amber-900">
                    <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
                    <span>
                      Twilio's Account SID and Auth Token grant full access to your account. Use an
                      API Key and Secret for production and keep the Auth Token for testing only.
                    </span>
                  </p>
                </div>

                <div>
                  <p className="mb-1.5 text-[0.8rem] font-semibold text-ink-900">Voice webhook URL</p>
                  <div className="flex gap-2">
                    <input
                      readOnly
                      value={webhooks.data?.voice || ''}
                      className="h-10 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 font-mono text-[0.75rem] text-slate-600"
                      aria-label="Voice webhook URL"
                    />
                    <Button as="button" variant="outline" size="sm" onClick={copyWebhook}>
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      Copy
                    </Button>
                  </div>
                  <p className="mt-1.5 text-[0.72rem] text-slate-500">
                    This URL is applied automatically when you click Apply Twilio webhooks. Status callback is set at the same time.
                  </p>
                  <Button as="button" variant="secondary" size="sm" className="mt-3" loading={saving} onClick={applyTwilio}>
                    Apply Twilio webhooks
                  </Button>
                  {twilio.data?.ready ? (
                    <p className="mt-3 text-[0.78rem] text-emerald-700">Twilio is connected{twilio.data.phone ? ` · ${twilio.data.phone}` : ''}.</p>
                  ) : (
                    <p className="mt-3 text-[0.78rem] text-amber-800">
                      Add Account SID, Auth Token and the Twilio number, then apply webhooks. You can also set them on the Railway server as TWILIO_* env vars.
                    </p>
                  )}
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader icon={Volume2} title="Voice settings" description="How the AI sounds on the call." />
              <CardBody className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Select label="Voice" options={options.data?.voices || []} value={s.voice} onChange={setField('voice')} />
                  <Select
                    label="Language"
                    options={(reference.data?.languages || []).map((l) => ({ value: l.code, label: l.label }))}
                    value={s.language}
                    onChange={setField('language')}
                  />
                  <Select label="Voice style" options={options.data?.voiceStyles || []} value={s.voiceStyle} onChange={setField('voiceStyle')} />
                  <div>
                    <label htmlFor="speed" className="mb-1.5 block text-[0.8rem] font-semibold text-ink-900">
                      Speaking speed · {Number(s.speakingSpeed || 1).toFixed(1)}×
                    </label>
                    <input
                      id="speed"
                      type="range"
                      min="0.6"
                      max="1.4"
                      step="0.1"
                      value={Number(s.speakingSpeed || 1)}
                      onChange={(e) => set('speakingSpeed')(Number(e.target.value))}
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-brand-600"
                    />
                  </div>
                </div>

                <Textarea label="Greeting" rows={2} value={s.greeting} onChange={setField('greeting')} />
                <Textarea label="Goodbye message" rows={2} value={s.goodbye} onChange={setField('goodbye')} />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Toggle checked={s.interruptions} onChange={set('interruptions')} label="Allow interruptions" description="Callers can talk over the AI." />
                  <Input
                    label="Silence timeout (seconds)"
                    type="number"
                    value={s.silenceTimeout}
                    onChange={(e) => set('silenceTimeout')(Number(e.target.value))}
                  />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Call behaviour" />
              <CardBody className="space-y-4">
                <Toggle checked={s.autoAnswer} onChange={set('autoAnswer')} label="Answer calls automatically" description="The AI picks up on the first ring." />
                <Toggle checked={s.humanTransfer} onChange={set('humanTransfer')} label="Allow human transfer" description="Hand the call to your team when the caller asks." />
                <Toggle checked={s.voicemailFallback} onChange={set('voicemailFallback')} label="Voicemail fallback" description="Take a message if nobody is available." />
                <Toggle checked={s.recording} onChange={set('recording')} label="Call recording" description="Store audio recordings of AI calls." />
                <Toggle checked={s.transcription} onChange={set('transcription')} label="Transcription" description="Generate a written transcript for every call." />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Select
                    label="During business hours"
                    options={['Answer everything and book directly', 'Answer questions, capture leads, no direct booking', 'Take a message only']}
                    value={config.data?.businessHoursBehaviour || ''}
                    onChange={async (e) => config.setData(await aiService.updateConfig({ businessHoursBehaviour: e.target.value }))}
                  />
                  <Select
                    label="Outside business hours"
                    options={['Answer everything and book directly', 'Answer questions, capture leads, no direct booking', 'Take a message only']}
                    value={config.data?.afterHoursBehaviour || ''}
                    onChange={async (e) => config.setData(await aiService.updateConfig({ afterHoursBehaviour: e.target.value }))}
                  />
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="AI instructions" description="Voice-specific guidance on top of your main prompt." />
              <CardBody className="space-y-4">
                <SourceSelector
                  kind="knowledge"
                  name="voice-knowledge"
                  value={config.data?.knowledgeMode || 'shared'}
                  channelKnowledge={options.data?.channelKnowledge || {}}
                  onChange={async (v) => config.setData(await aiService.updateConfig({ knowledgeMode: v }))}
                />
                <Textarea label="Voice-specific instructions" rows={4} value={s.voiceInstructions} onChange={setField('voiceInstructions')} />
                <Textarea
                  label="Emergency instructions"
                  rows={3}
                  value={s.emergencyInstructions}
                  onChange={setField('emergencyInstructions')}
                  help="What the AI must do if a caller reports an emergency."
                />
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
              <CardHeader icon={PhoneCall} title="Test your voice agent" />
              <CardBody>
                <p className="text-[0.83rem] leading-relaxed text-slate-600">
                  Place an outbound call from the Twilio number. Answer it to hear the AI receptionist.
                </p>
                <Input
                  className="mt-3"
                  label="Call this number"
                  value={testTo}
                  onChange={(e) => setTestTo(e.target.value)}
                  placeholder={s.businessNumber || twilio.data?.ownerNumber || '+923107443144'}
                  help="Include the country code."
                />
                <Button as="button" variant="secondary" size="sm" className="mt-4 w-full" loading={testing} onClick={testCall}>
                  <PhoneCall className="h-3.5 w-3.5" aria-hidden="true" />
                  Test Call
                </Button>
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Setup checklist" />
              <CardBody>
                <ul className="space-y-2.5 text-[0.82rem]">
                  {[
                    ['Twilio credentials saved', Boolean(twilio.data?.ready) || (credentials.data || []).some((c) => c.saved)],
                    ['Platform number configured', Boolean(s.twilioNumber || twilio.data?.phone)],
                    ['Greeting written', Boolean(s.greeting)],
                    ['Voice agent enabled', s.enabled],
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
