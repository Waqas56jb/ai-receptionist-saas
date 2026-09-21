import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Database, Globe, MessageSquare, Save, SlidersHorizontal } from 'lucide-react'
import PageHeader from '../../../components/layout/PageHeader'
import { Card, CardBody, CardHeader } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import Tabs from '../../../components/ui/Tabs'
import { RadioCard } from '../../../components/ui/Field'
import AITestChat from '../../../components/ai/AITestChat'
import useAsync from '../../../hooks/useAsync'
import { useToast } from '../../../context/ToastContext'
import aiService from '../../../services/aiService'
import channelService from '../../../services/channelService'
import knowledgeService from '../../../services/knowledgeService'

const channelTabs = [
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
  { id: 'web', label: 'Website', icon: Globe },
]

export default function AITest() {
  const toast = useToast()
  const [channel, setChannel] = useState('whatsapp')
  const [mode, setMode] = useState('shared')

  const config = useAsync(() => aiService.getConfig(), [])
  const channels = useAsync(() => channelService.list(), [])
  const knowledge = useAsync(() => knowledgeService.listItems(), [])

  const activeChannel = (channels.data || []).find((c) => c.id === channel)
  const knowledgeCount = (knowledge.data || []).filter((k) => k.status === 'Active').length

  return (
    <>
      <PageHeader
        title="AI Playground"
        description="Try your AI receptionist exactly as a customer would, before it goes live on a channel."
        badge={<Badge tone="brand">Sandbox — nothing is sent to customers</Badge>}
        actions={
          <Button as="button" size="sm" onClick={() => toast.success('Configuration saved.')}>
            <Save className="h-3.5 w-3.5" aria-hidden="true" />
            Save Changes
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
        {/* Configuration summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader title="Test as" description="Pick the channel the AI should imitate." />
            <CardBody className="space-y-4">
              <Tabs tabs={channelTabs} value={channel} onChange={setChannel} size="sm" />

              <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[0.8rem] text-slate-500">Channel status</span>
                  <Badge tone={activeChannel?.connected ? 'success' : 'neutral'} size="sm" dot>
                    {activeChannel?.connected ? 'Connected' : 'Not connected'}
                  </Badge>
                </div>
                <div className="mt-2.5 flex items-center justify-between gap-3">
                  <span className="text-[0.8rem] text-slate-500">Identifier</span>
                  <span className="truncate text-[0.8rem] font-semibold text-ink-900">
                    {activeChannel?.identifier || '—'}
                  </span>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Configuration used for this test" />
            <CardBody className="space-y-3">
              <RadioCard
                name="test-mode"
                value="shared"
                checked={mode === 'shared'}
                onChange={() => setMode('shared')}
                icon={Database}
                title="Shared AI"
                description="Test with the main knowledge base and shared system instructions."
              />
              <RadioCard
                name="test-mode"
                value="channel"
                checked={mode === 'channel'}
                onChange={() => setMode('channel')}
                icon={SlidersHorizontal}
                title="Channel-specific AI"
                description="Test with this channel's own knowledge and prompt."
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="What the AI knows" />
            <CardBody>
              <dl className="space-y-2.5 text-[0.83rem]">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-slate-500">Active knowledge items</dt>
                  <dd className="font-semibold text-ink-900">{knowledge.loading ? '—' : knowledgeCount}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-slate-500">Personality</dt>
                  <dd className="font-semibold text-ink-900">{config.data?.personality || '—'}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-slate-500">Tone</dt>
                  <dd className="font-semibold text-ink-900">{config.data?.tone || '—'}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-slate-500">Response length</dt>
                  <dd className="font-semibold text-ink-900">{config.data?.responseLength || '—'}</dd>
                </div>
              </dl>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button as={Link} to="/app/knowledge-base" variant="outline" size="xs">
                  Edit knowledge
                </Button>
                <Button as={Link} to="/app/ai-training/prompts" variant="outline" size="xs">
                  Edit prompt
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Chat */}
        <AITestChat channel={channel} />
      </div>
    </>
  )
}
