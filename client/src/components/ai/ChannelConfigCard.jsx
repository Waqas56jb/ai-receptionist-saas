import { Link } from 'react-router-dom'
import { ArrowRight, Globe, Instagram, MessageSquare, Mic } from 'lucide-react'
import cn from '../../lib/cn'
import Badge from '../ui/Badge'
import Toggle from '../ui/Toggle'
import { formatDate } from '../../lib/format'

const icons = { voice: Mic, whatsapp: MessageSquare, instagram: Instagram, web: Globe }

export default function ChannelConfigCard({ channel, onToggle, className = '' }) {
  const Icon = icons[channel.id] || Globe

  return (
    <div className={cn('flex h-full flex-col rounded-2xl border border-slate-200/80 bg-white p-5 transition-shadow hover:shadow-card', className)}>
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            'grid h-11 w-11 place-items-center rounded-xl',
            channel.connected ? 'bg-brand-50 text-brand-600' : 'bg-slate-100 text-slate-400',
          )}
        >
          <Icon className="h-[1.2rem] w-[1.2rem]" aria-hidden="true" />
        </span>
        <Badge tone={channel.connected ? 'success' : 'neutral'} dot>
          {channel.connected ? 'Connected' : 'Not connected'}
        </Badge>
      </div>

      <h3 className="mt-4 font-display text-[1rem] font-semibold text-ink-900">{channel.name}</h3>
      <p className="mt-1.5 text-[0.83rem] leading-relaxed text-slate-500">{channel.description}</p>

      <dl className="mt-4 space-y-1.5 text-[0.78rem]">
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500">Identifier</dt>
          <dd className="truncate font-medium text-ink-900">{channel.identifier || '—'}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500">Provider</dt>
          <dd className="truncate font-medium text-ink-900">{channel.provider}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500">Last connected</dt>
          <dd className="font-medium text-ink-900">{channel.lastConnectedAt ? formatDate(channel.lastConnectedAt) : '—'}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-slate-500">Configuration</dt>
          <dd>
            <Badge tone={channel.configured ? 'success' : 'warning'} size="sm">
              {channel.configured ? 'Configured' : 'Needs setup'}
            </Badge>
          </dd>
        </div>
      </dl>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
        {onToggle ? (
          <Toggle
            size="sm"
            checked={channel.enabled}
            onChange={(v) => onToggle(channel.id, v)}
            className="flex-1"
            label={channel.enabled ? 'Enabled' : 'Disabled'}
          />
        ) : (
          <span />
        )}
        <Link
          to={channel.route}
          className="inline-flex shrink-0 items-center gap-1.5 text-[0.8rem] font-semibold text-brand-600 underline-offset-4 hover:underline"
        >
          Configure
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}
