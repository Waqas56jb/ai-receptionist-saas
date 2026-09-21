import { Link } from 'react-router-dom'
import { Bot, Brain, FlaskConical, Languages, MessageCircle, Moon, Sun, UserRound } from 'lucide-react'
import PageHeader from '../../../components/layout/PageHeader'
import { Card, CardBody, CardHeader } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Toggle from '../../../components/ui/Toggle'
import Badge from '../../../components/ui/Badge'
import { Select } from '../../../components/ui/Field'
import { SkeletonCard } from '../../../components/ui/Skeleton'
import { ErrorState } from '../../../components/ui/States'
import AIStatusCard from '../../../components/ai/AIStatusCard'
import ChannelConfigCard from '../../../components/ai/ChannelConfigCard'
import useAsync from '../../../hooks/useAsync'
import { useToast } from '../../../context/ToastContext'
import aiService from '../../../services/aiService'
import channelService from '../../../services/channelService'
import businessService from '../../../services/businessService'
import { formatDateTime } from '../../../lib/format'

const behaviours = [
  'Answer everything and book directly',
  'Answer questions, capture leads, no direct booking',
  'Take a message only',
]

const styles = ['Short', 'Balanced', 'Detailed']

export default function AIOverview() {
  const toast = useToast()
  const config = useAsync(() => aiService.getConfig(), [])
  const channels = useAsync(() => channelService.list(), [])
  const reference = useAsync(() => businessService.getReferenceData(), [])

  const update = async (patch) => {
    const next = await aiService.updateConfig(patch)
    config.setData(next)
    toast.success('AI settings updated.')
  }

  const toggleLanguage = (code) => {
    const current = config.data.supportedLanguages
    const next = current.includes(code) ? current.filter((c) => c !== code) : [...current, code]
    if (!next.length) return
    update({ supportedLanguages: next })
  }

  if (config.error) {
    return (
      <Card>
        <ErrorState onRetry={config.reload} />
      </Card>
    )
  }

  const languageLabels = (reference.data?.languages || [])
    .filter((l) => config.data?.supportedLanguages?.includes(l.code))
    .map((l) => l.label)

  return (
    <>
      <PageHeader
        title="AI Receptionist"
        description="The core behaviour of your AI across every channel."
        badge={
          config.data && (
            <Badge tone={config.data.enabled ? 'success' : 'neutral'} dot>
              {config.data.enabled ? 'Online' : 'Paused'}
            </Badge>
          )
        }
        actions={
          <>
            <Button as={Link} to="/app/ai-test" variant="secondary" size="sm">
              <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
              Test AI
            </Button>
            <Button as={Link} to="/app/ai-training" size="sm">
              <Brain className="h-3.5 w-3.5" aria-hidden="true" />
              Train AI
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <Card>
            <CardHeader
              icon={Bot}
              title="Main controls"
              description="Turn the AI on or off and decide how it behaves inside and outside your opening hours."
            />
            <CardBody className="space-y-5">
              {config.loading ? (
                <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
              ) : (
                <>
                  <Toggle
                    checked={config.data.enabled}
                    onChange={(v) => update({ enabled: v, status: v ? 'online' : 'paused' })}
                    label="AI receptionist enabled"
                    description="When paused, WhatsApp and website widget messages are not answered automatically."
                  />

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Select
                      label="During business hours"
                      options={behaviours}
                      value={config.data.businessHoursBehaviour}
                      onChange={(e) => update({ businessHoursBehaviour: e.target.value })}
                    />
                    <Select
                      label="Outside business hours"
                      options={behaviours}
                      value={config.data.afterHoursBehaviour}
                      onChange={(e) => update({ afterHoursBehaviour: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Select
                      label="Default language"
                      options={(reference.data?.languages || []).map((l) => ({ value: l.code, label: l.label }))}
                      value={config.data.defaultLanguage}
                      onChange={(e) => update({ defaultLanguage: e.target.value })}
                    />
                    <Select
                      label="Response style"
                      options={styles}
                      value={config.data.responseStyle}
                      onChange={(e) => update({ responseStyle: e.target.value })}
                    />
                  </div>

                  <div>
                    <p className="mb-2 flex items-center gap-2 text-[0.8rem] font-semibold text-ink-900">
                      <Languages className="h-3.5 w-3.5 text-primary-400" aria-hidden="true" />
                      Supported languages
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {(reference.data?.languages || []).map((lang) => {
                        const active = config.data.supportedLanguages.includes(lang.code)
                        return (
                          <button
                            key={lang.code}
                            type="button"
                            onClick={() => toggleLanguage(lang.code)}
                            aria-pressed={active}
                            className={
                              active
                                ? 'rounded-lg border border-primary-400/40 bg-primary-500/15 px-3 py-1.5 text-[0.78rem] font-semibold text-primary-400'
                                : 'rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[0.78rem] font-medium text-slate-600 transition-colors hover:border-slate-300 hover:text-ink-900'
                            }
                          >
                            {lang.label}
                          </button>
                        )
                      })}
                    </div>
                    <p className="mt-2 text-[0.75rem] text-slate-500">
                      The AI detects the customer's language automatically and replies in it.
                    </p>
                  </div>

                  <Toggle
                    checked={config.data.humanHandoff}
                    onChange={(v) => update({ humanHandoff: v })}
                    label="Human handoff"
                    description={`Transfer to ${config.data.handoffNumber} when a customer asks for a person or the AI is unsure.`}
                  />
                </>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              icon={MessageCircle}
              title="Channels"
              description="Each channel can be connected, configured and enabled independently."
            />
            <CardBody>
              {channels.loading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {(channels.data || []).map((channel) => (
                      <ChannelConfigCard
                        key={channel.id}
                        channel={channel}
                        onToggle={async (id, enabled) => {
                          channels.setData(await channelService.update(id, { enabled }))
                          toast.success(`${channel.name} ${enabled ? 'enabled' : 'disabled'}.`)
                        }}
                      />
                    ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        <div className="space-y-4">
          <AIStatusCard config={config.data} channels={channels.data || []} languages={languageLabels} />

          <Card>
            <CardHeader title="Training status" />
            <CardBody className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[0.82rem] text-slate-500">Last trained</span>
                <span className="text-[0.82rem] font-semibold text-ink-900">
                  {config.data ? formatDateTime(config.data.lastTrainedAt) : '—'}
                </span>
              </div>
              <Button
                as="button"
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={async () => {
                  config.setData(await aiService.retrain())
                  toast.success('Retraining finished — the AI is using your latest knowledge.')
                }}
              >
                <Brain className="h-3.5 w-3.5" aria-hidden="true" />
                Retrain now
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Hours behaviour" />
            <CardBody className="space-y-3 text-[0.82rem]">
              <p className="flex items-start gap-2.5 text-slate-600">
                <Sun className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-ink-900">Open: </span>
                  {config.data?.businessHoursBehaviour || '—'}
                </span>
              </p>
              <p className="flex items-start gap-2.5 text-slate-600">
                <Moon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-ink-900">Closed: </span>
                  {config.data?.afterHoursBehaviour || '—'}
                </span>
              </p>
              <p className="flex items-start gap-2.5 text-slate-600">
                <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" aria-hidden="true" />
                <span>
                  <span className="font-semibold text-ink-900">Handoff: </span>
                  {config.data?.humanHandoff ? 'Enabled' : 'Disabled'}
                </span>
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  )
}
