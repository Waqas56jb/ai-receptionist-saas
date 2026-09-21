import { Link } from 'react-router-dom'
import { Bot, Database, Globe, Languages, MessageSquare, SlidersHorizontal, UserRound } from 'lucide-react'
import cn from '../../lib/cn'
import Badge from '../ui/Badge'

const channelIcon = { whatsapp: MessageSquare, web: Globe }

function Row({ icon: Icon, label, children }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <span className="flex items-center gap-2 text-[0.8rem] text-slate-500">
        <Icon className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
        {label}
      </span>
      <span className="text-right text-[0.8rem] font-semibold text-ink-900">{children}</span>
    </div>
  )
}

/**
 * Reusable configuration summary. Appears on the AI overview, the playground
 * and every channel agent page so the current setup is always visible.
 */
export default function AIStatusCard({ config, channels = [], languages = [], className = '', compact = false }) {
  if (!config) return null

  return (
    <div className={cn('overflow-hidden rounded-2xl border border-slate-200/80 bg-white', className)}>
      <div className="flex items-center justify-between gap-3 border-b border-slate-200/80 bg-ink-900 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500/20">
            <Bot className="h-4 w-4 text-brand-300" aria-hidden="true" />
          </span>
          <div>
            <p className="font-display text-[0.85rem] font-semibold text-white">AI receptionist</p>
            <p className="text-[0.7rem] text-slate-400">Configuration summary</p>
          </div>
        </div>
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider',
            config.enabled
              ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
              : 'border-white/15 bg-white/5 text-slate-300',
          )}
        >
          <span className={cn('h-1.5 w-1.5 rounded-full', config.enabled ? 'bg-emerald-400' : 'bg-slate-400')} aria-hidden="true" />
          {config.enabled ? 'Online' : 'Paused'}
        </span>
      </div>

      <div className="divide-y divide-slate-100 px-5 py-2">
        <Row icon={Database} label="Knowledge">
          <Badge tone={config.knowledgeMode === 'shared' ? 'brand' : 'info'} size="sm">
            {config.knowledgeMode === 'shared' ? 'Shared' : 'Per channel'}
          </Badge>
        </Row>
        <Row icon={SlidersHorizontal} label="Prompt">
          <Badge tone={config.promptMode === 'shared' ? 'brand' : 'info'} size="sm">
            {config.promptMode === 'shared' ? 'Shared' : 'Per channel'}
          </Badge>
        </Row>

        {!compact &&
          channels
            .filter((c) => c.id === 'whatsapp' || c.id === 'web')
            .map((channel) => {
              const Icon = channelIcon[channel.id] || MessageSquare
              return (
                <Row key={channel.id} icon={Icon} label={channel.name}>
                  <Badge tone={channel.connected ? 'success' : 'neutral'} size="sm" dot>
                    {channel.connected ? 'Connected' : 'Not connected'}
                  </Badge>
                </Row>
              )
            })}

        <Row icon={Languages} label="Languages">
          {languages.length ? languages.join(', ') : '—'}
        </Row>
        <Row icon={UserRound} label="Human handoff">
          <Badge tone={config.humanHandoff ? 'success' : 'neutral'} size="sm">
            {config.humanHandoff ? 'Enabled' : 'Disabled'}
          </Badge>
        </Row>
      </div>

      {!compact && (
        <div className="border-t border-slate-200/80 bg-slate-50/60 px-5 py-3">
          <Link to="/app/ai-config" className="text-[0.78rem] font-semibold text-brand-600 underline-offset-4 hover:underline">
            Change configuration mode
          </Link>
        </div>
      )}
    </div>
  )
}
