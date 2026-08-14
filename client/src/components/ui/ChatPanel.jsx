import { motion, useReducedMotion } from 'framer-motion'
import { Sparkles, UserRound } from 'lucide-react'

/**
 * Reusable AI-conversation mockup used by the solution and multilingual
 * sections. Purely presentational — no chat logic behind it.
 */
export default function ChatPanel({
  title = 'AI Receptionist',
  status = 'Online',
  channel,
  messages = [],
  footer,
  tone = 'light',
  className = '',
}) {
  const dark = tone === 'dark'
  const reduceMotion = useReducedMotion()

  return (
    <div
      className={`overflow-hidden rounded-2xl border shadow-lift sm:rounded-[1.5rem] ${
        dark ? 'border-white/10 bg-ink-800/60 backdrop-blur' : 'border-slate-200/80 bg-white'
      } ${className}`}
    >
      <div
        className={`flex items-center justify-between gap-3 border-b px-4 py-3.5 sm:px-5 ${
          dark ? 'border-white/10' : 'border-slate-200/80 bg-slate-50/60'
        }`}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <span
            className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
              dark ? 'bg-brand-500/20' : 'bg-brand-600'
            }`}
          >
            <Sparkles
              className={`h-4 w-4 ${dark ? 'text-brand-300' : 'text-white'}`}
              aria-hidden="true"
            />
          </span>
          <div className="min-w-0">
            <p
              className={`truncate font-display text-sm font-semibold ${
                dark ? 'text-white' : 'text-ink-900'
              }`}
            >
              {title}
            </p>
            {channel && (
              <p className={`truncate text-xs ${dark ? 'text-slate-400' : 'text-slate-500'}`}>
                {channel}
              </p>
            )}
          </div>
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider ${
            dark
              ? 'border border-emerald-400/25 bg-emerald-400/10 text-emerald-300'
              : 'border border-emerald-200 bg-emerald-50 text-emerald-700'
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
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
                <span
                  className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full ${
                    dark ? 'bg-white/10' : 'bg-slate-100'
                  }`}
                >
                  <UserRound
                    className={`h-3.5 w-3.5 ${dark ? 'text-slate-300' : 'text-slate-500'}`}
                    aria-hidden="true"
                  />
                </span>
              )}

              <div className={`max-w-[85%] ${isAi ? 'text-right' : ''}`}>
                {message.label && (
                  <p
                    className={`mb-1 text-[0.65rem] font-semibold uppercase tracking-wider ${
                      dark ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    {message.label}
                  </p>
                )}
                <p
                  className={`inline-block text-left text-[0.85rem] leading-relaxed sm:text-[0.9rem] ${
                    isAi
                      ? dark
                        ? 'rounded-2xl rounded-tr-sm bg-brand-500/15 px-3.5 py-2.5 text-brand-100 ring-1 ring-inset ring-brand-400/20'
                        : 'rounded-2xl rounded-tr-sm bg-brand-600 px-3.5 py-2.5 text-white'
                      : dark
                        ? 'rounded-2xl rounded-tl-sm bg-white/[0.06] px-3.5 py-2.5 text-slate-200'
                        : 'rounded-2xl rounded-tl-sm bg-slate-100 px-3.5 py-2.5 text-slate-700'
                  }`}
                >
                  {message.text}
                </p>
              </div>

              {isAi && (
                <span
                  className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full ${
                    dark ? 'bg-brand-500/20' : 'bg-brand-50'
                  }`}
                >
                  <Sparkles
                    className={`h-3.5 w-3.5 ${dark ? 'text-brand-300' : 'text-brand-600'}`}
                    aria-hidden="true"
                  />
                </span>
              )}
            </motion.div>
          )
        })}
      </div>

      {footer && (
        <div
          className={`border-t px-4 py-3.5 sm:px-5 ${
            dark ? 'border-white/10 bg-white/[0.02]' : 'border-slate-200/80 bg-slate-50/60'
          }`}
        >
          {footer}
        </div>
      )}
    </div>
  )
}
