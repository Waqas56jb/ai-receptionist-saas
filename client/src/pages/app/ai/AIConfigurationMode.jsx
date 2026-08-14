import { Link } from 'react-router-dom'
import { FlaskConical, Info, Save } from 'lucide-react'
import PageHeader from '../../../components/layout/PageHeader'
import { Card, CardBody, CardHeader } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import { ErrorState } from '../../../components/ui/States'
import ConfigModeDiagram from '../../../components/ai/ConfigModeDiagram'
import SourceSelector from '../../../components/ai/SourceSelector'
import AIStatusCard from '../../../components/ai/AIStatusCard'
import useAsync from '../../../hooks/useAsync'
import { useToast } from '../../../context/ToastContext'
import aiService from '../../../services/aiService'
import channelService from '../../../services/channelService'

export default function AIConfigurationMode() {
  const toast = useToast()
  const config = useAsync(() => aiService.getConfig(), [])
  const channels = useAsync(() => channelService.list(), [])
  const options = useAsync(() => aiService.getOptions(), [])

  const update = async (patch, message) => {
    config.setData(await aiService.updateConfig(patch))
    toast.success(message)
  }

  if (config.error) {
    return (
      <Card>
        <ErrorState onRetry={config.reload} />
      </Card>
    )
  }

  const mode = config.data?.knowledgeMode || 'shared'

  return (
    <>
      <PageHeader
        title="AI Configuration Mode"
        description="Decide whether every channel shares one AI setup, or whether Voice, WhatsApp and Instagram are configured independently."
        breadcrumbs={[{ label: 'AI Receptionist', to: '/app/ai-agent' }, { label: 'Configuration Mode' }]}
        actions={
          <Button as={Link} to="/app/ai-test" variant="secondary" size="sm">
            <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
            Test the result
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <Card>
            <CardHeader
              title="Knowledge configuration"
              description="Where each channel gets its answers from."
            />
            <CardBody>
              {config.loading ? (
                <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
              ) : (
                <SourceSelector
                  kind="knowledge"
                  name="knowledge-mode"
                  value={config.data.knowledgeMode}
                  channelKnowledge={options.data?.channelKnowledge || {}}
                  onChange={(v) => update({ knowledgeMode: v }, 'Knowledge configuration updated.')}
                />
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Prompt configuration"
              description="Whether all channels follow the same system instructions."
            />
            <CardBody>
              {config.loading ? (
                <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
              ) : (
                <SourceSelector
                  kind="prompt"
                  name="prompt-mode"
                  value={config.data.promptMode}
                  channelKnowledge={options.data?.channelKnowledge || {}}
                  onChange={(v) => update({ promptMode: v }, 'Prompt configuration updated.')}
                />
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="How it works" description="A visual of the current setup." />
            <CardBody>
              <ConfigModeDiagram mode={mode} />
            </CardBody>
          </Card>

          <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
            <p className="text-[0.83rem] leading-relaxed text-slate-600">
              You can switch between shared and channel-specific configuration at any time. Switching
              to channel-specific keeps your shared knowledge as the starting point for each channel,
              so nothing is lost.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <AIStatusCard config={config.data} channels={channels.data || []} languages={['English', 'French', 'German']} compact />

          <Card>
            <CardHeader title="Which should I choose?" />
            <CardBody className="space-y-4 text-[0.83rem] leading-relaxed text-slate-600">
              <div>
                <p className="font-semibold text-ink-900">Shared configuration</p>
                <p className="mt-1">
                  Best for most businesses. One knowledge base, one set of instructions, consistent
                  answers everywhere — and only one place to keep up to date.
                </p>
              </div>
              <div>
                <p className="font-semibold text-ink-900">Channel-specific</p>
                <p className="mt-1">
                  Useful when a channel needs a different voice or scope — for example short, casual
                  replies on Instagram but formal, detailed answers on the phone.
                </p>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <Button
                as="button"
                size="sm"
                className="w-full"
                onClick={() => toast.success('Configuration saved.')}
              >
                <Save className="h-3.5 w-3.5" aria-hidden="true" />
                Save changes
              </Button>
              <p className="mt-2.5 text-center text-[0.72rem] text-slate-400">
                Changes above are applied immediately in this demo.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  )
}
