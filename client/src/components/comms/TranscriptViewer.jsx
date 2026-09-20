import { Bot, UserRound, UserCheck } from 'lucide-react'
import cn from '../../lib/cn'
import Badge from '../ui/Badge'
import { formatClock, formatDateTime, formatDuration } from '../../lib/format'
import { channelLabel } from '../../lib/channels'

const speaker = {
  ai: { label: 'AI receptionist', icon: Bot, className: 'bg-primary-500/15 text-primary-400' },
  customer: { label: 'Customer', icon: UserRound, className: 'bg-slate-100 text-slate-600' },
  human: { label: 'Team', icon: UserCheck, className: 'bg-ink-900 text-white' },
}

/** Clean read-only transcript, used by the Calls table and the Transcripts page. */
export default function TranscriptViewer({ transcript, className = '' }) {
  if (!transcript) return null

  return (
    <div className={className}>
      <dl className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:grid-cols-4">
        <div>
          <dt className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-400">Channel</dt>
          <dd className="mt-1 text-[0.82rem] font-semibold text-ink-900">{channelLabel(transcript.channel)}</dd>
        </div>
        <div>
          <dt className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-400">Duration</dt>
          <dd className="mt-1 text-[0.82rem] font-semibold text-ink-900">{formatDuration(transcript.duration)}</dd>
        </div>
        <div>
          <dt className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-400">Language</dt>
          <dd className="mt-1 text-[0.82rem] font-semibold text-ink-900">{transcript.language}</dd>
        </div>
        <div>
          <dt className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-400">Lead</dt>
          <dd className="mt-1">
            <Badge tone={transcript.lead === 'Converted' ? 'success' : 'brand'} size="sm">
              {transcript.lead}
            </Badge>
          </dd>
        </div>
      </dl>

      <p className="mt-3 text-[0.78rem] text-slate-500">
        {formatDateTime(transcript.at)} · outcome: <span className="font-semibold text-ink-900">{transcript.outcome}</span>
      </p>

      <ol className="mt-4 space-y-3">
        {transcript.lines.map((line, i) => {
          const meta = speaker[line.from] || speaker.customer
          const Icon = meta.icon
          return (
            <li key={i} className="flex gap-3">
              <span className="w-11 shrink-0 pt-1 text-right font-mono text-[0.7rem] tabular-nums text-slate-400">
                {formatClock(line.at)}
              </span>
              <span className={cn('grid h-7 w-7 shrink-0 place-items-center rounded-full', meta.className)}>
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[0.68rem] font-bold uppercase tracking-wider text-slate-400">{meta.label}</p>
                <p className="mt-0.5 text-[0.85rem] leading-relaxed text-slate-700">{line.text}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
