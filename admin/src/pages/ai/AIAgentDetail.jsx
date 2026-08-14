import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Bot, Building2, Info, MessagesSquare, Pause, Play, ShieldAlert } from 'lucide-react'
import { channelLabel, formatNumber, timeAgo } from '../../lib/utils'
import PageHeader from '../../components/layout/PageHeader'
import { Card, CardBody, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge, { StatusBadge } from '../../components/ui/Badge'
import { ConfirmDialog } from '../../components/ui/Modal'
import { EmptyState, ErrorState } from '../../components/ui/States'
import { SkeletonDetail } from '../../components/ui/Skeleton'
import { useAsync } from '../../hooks'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import { aiService, conversationService } from '../../services/aiService'

function Row({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="text-[0.82rem] text-slate-500">{label}</span>
      <span className="min-w-0 text-right text-[0.84rem] font-medium text-ink-900">{children}</span>
    </div>
  )
}

export default function AIAgentDetail() {
  const { id } = useParams()
  const toast = useToast()
  const { admin, can } = useAuth()
  const [statusChange, setStatusChange] = useState(null)
  const [busy, setBusy] = useState(false)

  const agent = useAsync(() => aiService.getAgent(id), [id])
  const conversations = useAsync(() => conversationService.listConversations(), [])

  if (agent.error) {
    return (
      <Card>
        <ErrorState onRetry={agent.reload} />
      </Card>
    )
  }
  if (agent.loading) return <SkeletonDetail />
  if (!agent.data) {
    return (
      <Card>
        <EmptyState icon={Bot} title="AI agent not found" description="It may have been removed." action={<Button as={Link} to="/ai-agents" size="sm">Back to AI agents</Button>} />
      </Card>
    )
  }

  const a = agent.data
  const recent = (conversations.data || []).filter((c) => c.businessId === a.businessId).slice(0, 6)

  return (
    <>
      <PageHeader
        title={a.name}
        breadcrumbs={[{ label: 'AI Agents', to: '/ai-agents' }, { label: a.business }]}
        description={`Configuration for ${a.business}`}
        badge={<StatusBadge status={a.status} />}
        actions={
          <>
            <Button as={Link} to={`/businesses/${a.businessId}`} variant="outline" size="sm">
              <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
              Open business
            </Button>
            {a.status === 'Online' ? (
              <Button variant="secondary" size="sm" disabled={!can('ai.manageSettings')} onClick={() => setStatusChange('Paused')}>
                <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                Disable
              </Button>
            ) : (
              <Button size="sm" disabled={!can('ai.manageSettings')} onClick={() => setStatusChange('Online')}>
                <Play className="h-3.5 w-3.5" aria-hidden="true" />
                Enable
              </Button>
            )}
          </>
        }
      />

      <div className="mb-5 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
        <p className="text-[0.84rem] leading-relaxed text-slate-600">
          This is a read-only view of the customer's own configuration. Administrators can enable or
          disable the agent, but knowledge, prompts and channel settings are changed by the business
          in their portal — not from here.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <Card>
            <CardHeader icon={Bot} title="Configuration" />
            <CardBody className="divide-y divide-slate-100 py-0">
              <Row label="Business">{a.business}</Row>
              <Row label="Agent name">{a.name}</Row>
              <Row label="Status"><StatusBadge status={a.status} /></Row>
              <Row label="Knowledge source"><Badge tone="neutral" size="sm">{a.knowledgeMode}</Badge></Row>
              <Row label="Prompt mode"><Badge tone="neutral" size="sm">{a.promptMode}</Badge></Row>
              <Row label="Personality">{a.personality}</Row>
              <Row label="Languages">{a.languages.join(', ')}</Row>
              <Row label="Human handoff"><Badge tone={a.handoff ? 'success' : 'neutral'} size="sm">{a.handoff ? 'Enabled' : 'Disabled'}</Badge></Row>
              <Row label="Knowledge items">{a.knowledgeItems}</Row>
              <Row label="Last active">{timeAgo(a.lastActive)}</Row>
            </CardBody>
          </Card>

          <Card>
            <CardHeader icon={MessagesSquare} title="Recent conversations" />
            <CardBody className="p-0">
              {recent.length === 0 && <EmptyState compact icon={MessagesSquare} title="No conversations" description="This agent has not handled anything yet." />}
              <ul className="divide-y divide-slate-100">
                {recent.map((c) => (
                  <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3">
                    <div className="min-w-0">
                      <p className="text-[0.84rem] font-semibold text-ink-900">{c.customer}</p>
                      <p className="truncate text-[0.75rem] text-slate-500">{c.lastMessage}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge tone="neutral" size="sm">{channelLabel(c.channel)}</Badge>
                      <span className="text-[0.72rem] text-slate-400">{timeAgo(c.at)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Usage" />
            <CardBody className="divide-y divide-slate-100 py-0">
              <Row label="AI minutes">{formatNumber(a.aiMinutes)}</Row>
              <Row label="Conversations">{formatNumber(a.conversations)}</Row>
              <Row label="Connected channels">{a.channels.length}</Row>
              <Row label="Estimated cost">€{(a.aiMinutes * 0.06).toFixed(2)}</Row>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Channels" />
            <CardBody>
              {a.channels.length === 0 ? (
                <p className="text-[0.84rem] text-slate-500">No channels connected.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {a.channels.map((c) => (
                    <Badge key={c} tone="success" size="sm" dot>
                      {channelLabel(c)}
                    </Badge>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={Boolean(statusChange)}
        onClose={() => setStatusChange(null)}
        onConfirm={async () => {
          setBusy(true)
          try {
            agent.setData(await aiService.setAgentStatus(id, statusChange, admin?.name))
            toast.success(`AI agent ${statusChange === 'Online' ? 'enabled' : 'disabled'}.`)
            setStatusChange(null)
          } finally {
            setBusy(false)
          }
        }}
        loading={busy}
        tone={statusChange === 'Online' ? 'primary' : 'danger'}
        title={`${statusChange === 'Online' ? 'Enable' : 'Disable'} the AI for ${a.business}?`}
        description={statusChange === 'Online' ? 'The receptionist resumes answering.' : 'Calls and messages stop being answered automatically.'}
        warning={statusChange !== 'Online' ? 'This changes a customer-facing service. Make sure the business has been told.' : undefined}
        confirmLabel={statusChange === 'Online' ? 'Enable agent' : 'Disable agent'}
      >
        {statusChange !== 'Online' && (
          <div className="flex items-start gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-3.5">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
            <p className="text-[0.78rem] leading-relaxed text-slate-500">This action is written to the audit log against your name.</p>
          </div>
        )}
      </ConfirmDialog>
    </>
  )
}
