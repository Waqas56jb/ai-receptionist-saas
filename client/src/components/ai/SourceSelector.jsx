import { Link } from 'react-router-dom'
import { Database, Instagram, MessageSquare, Mic, SlidersHorizontal } from 'lucide-react'
import cn from '../../lib/cn'
import { RadioCard } from '../ui/Field'
import Badge from '../ui/Badge'
import { formatDate } from '../../lib/format'

const channelMeta = {
  voice: { label: 'Voice knowledge', icon: Mic, route: '/app/voice-agent' },
  whatsapp: { label: 'WhatsApp knowledge', icon: MessageSquare, route: '/app/whatsapp-agent' },
  instagram: { label: 'Instagram knowledge', icon: Instagram, route: '/app/instagram-agent' },
}

/**
 * Knowledge / prompt source picker used on every channel agent page and on the
 * configuration-mode screen.
 */
export default function SourceSelector({
  kind = 'knowledge',
  value,
  onChange,
  channelKnowledge = {},
  name,
  className = '',
}) {
  const isKnowledge = kind === 'knowledge'
  const Icon = isKnowledge ? Database : SlidersHorizontal

  return (
    <div className={className}>
      <div className="mb-3 flex items-center gap-2">
        <Icon className="h-4 w-4 text-primary-400" aria-hidden="true" />
        <h3 className="text-[0.88rem] font-semibold text-ink-900">
          {isKnowledge ? 'Knowledge source' : 'Prompt configuration'}
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <RadioCard
          name={name || `${kind}-source`}
          value="shared"
          checked={value === 'shared'}
          onChange={() => onChange('shared')}
          title={isKnowledge ? 'Use shared knowledge base' : 'Shared prompt'}
          description={
            isKnowledge
              ? 'All channels answer from the main business knowledge base.'
              : 'All channels use the same system instructions.'
          }
        />
        <RadioCard
          name={name || `${kind}-source`}
          value="separate"
          checked={value === 'separate'}
          onChange={() => onChange('separate')}
          title={isKnowledge ? 'Use channel-specific knowledge' : 'Channel-specific prompt'}
          description={
            isKnowledge
              ? 'Each channel answers from its own knowledge set.'
              : 'Each channel gets its own system instructions.'
          }
        />
      </div>

      {value === 'shared' ? (
        <p className="mt-3 rounded-xl border border-primary-400/30 bg-primary-500/10 p-3.5 text-[0.8rem] leading-relaxed text-primary-300">
          {isKnowledge
            ? 'All channels use the main business knowledge base.'
            : 'All channels use the same system instructions from Prompt Configuration.'}
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {Object.entries(channelMeta).map(([id, meta]) => {
            const stats = channelKnowledge[id]
            const ChannelIcon = meta.icon
            return (
              <li
                key={id}
                className={cn('flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3.5')}
              >
                <span className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-100 text-slate-500">
                    <ChannelIcon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-[0.83rem] font-semibold text-ink-900">
                      {isKnowledge ? meta.label : meta.label.replace('knowledge', 'prompt')}
                    </span>
                    <span className="block text-[0.72rem] text-slate-500">
                      {isKnowledge
                        ? stats?.items
                          ? `${stats.items} items · updated ${formatDate(stats.updatedAt)}`
                          : 'No items yet'
                        : 'Independent system instructions'}
                    </span>
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  {isKnowledge && !stats?.items && <Badge tone="warning" size="sm">Needs setup</Badge>}
                  <Link to={meta.route} className="text-[0.76rem] font-semibold text-primary-400 underline-offset-4 hover:underline">
                    Configure
                  </Link>
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
