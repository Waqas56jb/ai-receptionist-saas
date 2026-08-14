import { ArrowDown, Brain, Database, Instagram, MessageSquare, Mic } from 'lucide-react'
import cn from '../../lib/cn'

const node = 'rounded-xl border px-3 py-2.5 text-center text-[0.78rem] font-semibold'

function Channel({ icon: Icon, label, tone = 'brand' }) {
  return (
    <div
      className={cn(
        node,
        'flex items-center justify-center gap-2',
        tone === 'brand' ? 'border-brand-200 bg-brand-50 text-brand-700' : 'border-slate-200 bg-white text-slate-600',
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </div>
  )
}

/** Visualises how knowledge flows to the channel agents in each mode. */
export default function ConfigModeDiagram({ mode = 'shared', className = '' }) {
  if (mode === 'shared') {
    return (
      <div className={cn('rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6', className)}>
        <p className="text-center text-[0.7rem] font-bold uppercase tracking-wider text-slate-500">Shared configuration</p>
        <div className="mx-auto mt-5 max-w-sm space-y-2">
          <div className={cn(node, 'flex items-center justify-center gap-2 border-slate-200 bg-white text-ink-900')}>
            <Database className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
            Knowledge base
          </div>
          <ArrowDown className="mx-auto h-4 w-4 text-slate-400" aria-hidden="true" />
          <div className={cn(node, 'flex items-center justify-center gap-2 border-ink-800 bg-ink-900 text-white')}>
            <Brain className="h-3.5 w-3.5 text-brand-300" aria-hidden="true" />
            AI core
          </div>
          <ArrowDown className="mx-auto h-4 w-4 text-slate-400" aria-hidden="true" />
          <div className="grid grid-cols-3 gap-2">
            <Channel icon={Mic} label="Voice" />
            <Channel icon={MessageSquare} label="WhatsApp" />
            <Channel icon={Instagram} label="Instagram" />
          </div>
        </div>
        <p className="mt-5 text-center text-[0.8rem] text-slate-500">
          All channels use the main business knowledge base and the same system instructions.
        </p>
      </div>
    )
  }

  const lanes = [
    { icon: Mic, label: 'Voice' },
    { icon: MessageSquare, label: 'WhatsApp' },
    { icon: Instagram, label: 'Instagram' },
  ]

  return (
    <div className={cn('rounded-2xl border border-slate-200 bg-slate-50/70 p-5 sm:p-6', className)}>
      <p className="text-center text-[0.7rem] font-bold uppercase tracking-wider text-slate-500">Channel-specific configuration</p>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {lanes.map((lane) => (
          <div key={lane.label} className="space-y-2">
            <div className={cn(node, 'flex items-center justify-center gap-2 border-slate-200 bg-white text-ink-900')}>
              <Database className="h-3.5 w-3.5 text-brand-600" aria-hidden="true" />
              {lane.label} knowledge
            </div>
            <ArrowDown className="mx-auto h-4 w-4 text-slate-400" aria-hidden="true" />
            <Channel icon={lane.icon} label={`${lane.label} agent`} />
          </div>
        ))}
      </div>
      <p className="mt-5 text-center text-[0.8rem] text-slate-500">
        Each channel has its own knowledge and prompts, configured independently.
      </p>
    </div>
  )
}
