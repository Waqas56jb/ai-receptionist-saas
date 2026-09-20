import { motion, useReducedMotion } from 'framer-motion'
import { Sparkles, UserRound } from 'lucide-react'

export default function ChatPanel({
  title = 'AI Receptionist',
  status = 'Online',
  channel,
  messages = [],
  footer,
  className = '',
}) {
  const reduceMotion = useReducedMotion()

  return (
    <div className={`panel-raised overflow-hidden rounded-2xl ${className}`}>
      <div className="flex items-center justify-between gap-3 border-b border-line bg-surface-2/70 px-4 py-3.5 sm:px-5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary-500/20">
            <Sparkles className="h-4 w-4 text-primary-400" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-semibold text-ink">{title}</p>
            {channel && <p className="truncate text-xs text-muted">{channel}</p>}
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
          {status}
        </span>
      </div>

      <div className="space-y-3.5 p-4 sm:p-5">
        {messages.map((message, i) => {
          const isAi = message.from === 'ai'
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.45, delay: reduceMotion ? 0 : i * 0.14 }}
              className={`flex gap-2.5 ${isAi ? 'justify-end' : ''}`}
            >
              {!isAi && (
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-surface-2">
                  <UserRound className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
                </span>
              )}

              <div className={`max-w-[85%] ${isAi ? 'text-right' : ''}`}>
                {message.label && (
                  <p className="mb-1 text-[0.65rem] font-semibold uppercase tracking-wider text-subtle">
                    {message.label}
                  </p>
                )}
                <p
                  className={`inline-block text-left text-[0.85rem] leading-relaxed sm:text-[0.9rem] ${
                    isAi
                      ? 'rounded-2xl rounded-tr-sm bg-primary-500/15 px-3.5 py-2.5 text-ink ring-1 ring-inset ring-primary-400/20'
                      : 'rounded-2xl rounded-tl-sm bg-surface-2 px-3.5 py-2.5 text-ink'
                  }`}
                >
                  {message.text}
                </p>
              </div>

              {isAi && (
                <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary-500/20">
                  <Sparkles className="h-3.5 w-3.5 text-primary-400" aria-hidden="true" />
                </span>
              )}
            </motion.div>
          )
        })}
      </div>

      {footer && <div className="border-t border-line bg-canvas/40 px-4 py-3.5 sm:px-5">{footer}</div>}
    </div>
  )
}
