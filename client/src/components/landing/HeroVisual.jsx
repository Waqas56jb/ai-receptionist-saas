import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import {
  PhoneCall,
  Sparkles,
  CheckCircle2,
  MessageSquare,
  Clock,
  Languages,
  UserRound,
  BadgeCheck,
} from 'lucide-react'

// Fixed bar heights keep the waveform identical on every render (no layout jitter).
const WAVE = [
  22, 46, 30, 62, 38, 74, 44, 58, 28, 66, 36, 52, 24, 70, 40, 60, 30, 48, 26, 64, 34, 56, 42, 68, 32,
  50, 22, 60, 38, 44,
]

function formatDuration(totalSeconds) {
  const m = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
  const s = String(totalSeconds % 60).padStart(2, '0')
  return `${m}:${s}`
}

function FloatingCard({ children, className = '', delay = 0, floatDelay = '0s' }) {
  const reduceMotion = useReducedMotion()
  return (
    <motion.div
      initial={{ opacity: 0, y: reduceMotion ? 0 : 14, scale: reduceMotion ? 1 : 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute z-20 hidden items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white/95 px-3.5 py-2.5 shadow-lift backdrop-blur lg:flex ${
        reduceMotion ? '' : 'animate-float'
      } ${className}`}
      style={{ animationDelay: floatDelay }}
    >
      {children}
    </motion.div>
  )
}

export default function HeroVisual() {
  const [seconds, setSeconds] = useState(84)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    // The vertical padding on large screens is the runway the floating cards
    // sit in, so they never cover the panel's own content.
    <div className="relative lg:py-[4.5rem]">
      {/* Ambient glow behind the panel */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-6 bottom-0 -z-10 rounded-[3rem] bg-gradient-to-tr from-brand-500/20 via-brand-400/5 to-transparent blur-3xl"
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: reduceMotion ? 0 : 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink-900 shadow-panel sm:rounded-[1.75rem]"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-grid-dark [background-size:32px_32px] opacity-40"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-brand-500/25 blur-3xl"
          aria-hidden="true"
        />

        {/* App chrome */}
        <div className="relative flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-brand-500/20">
              <Sparkles className="h-3.5 w-3.5 text-brand-300" aria-hidden="true" />
            </span>
            <span className="font-display text-[0.8rem] font-semibold text-white sm:text-sm">
              Live Conversations
            </span>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-emerald-300 sm:text-[0.7rem]">
            <span className="relative flex h-1.5 w-1.5">
              {!reduceMotion && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              )}
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            AI Online
          </span>
        </div>

        <div className="relative p-4 sm:p-5">
          {/* Active call */}
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 sm:rounded-2xl sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 font-display text-sm font-bold text-white sm:h-11 sm:w-11">
                  DR
                </span>
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-semibold text-white sm:text-[0.95rem]">
                    Daniel Reyes
                  </p>
                  <p className="truncate text-xs text-slate-400">+1 (415) 220 · Incoming call</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white/[0.06] px-2.5 py-1.5">
                <Clock className="h-3.5 w-3.5 text-brand-300" aria-hidden="true" />
                <span className="font-mono text-xs tabular-nums text-slate-200">
                  {formatDuration(seconds)}
                </span>
              </div>
            </div>

            {/* Waveform */}
            <div className="mt-4 flex h-10 items-center gap-[3px]" aria-hidden="true">
              {WAVE.map((h, i) => (
                <motion.span
                  key={i}
                  className="w-full max-w-[4px] flex-1 rounded-full bg-gradient-to-t from-brand-500/40 to-brand-300"
                  style={{ height: `${h}%` }}
                  animate={reduceMotion ? undefined : { scaleY: [1, 0.55, 1.15, 0.8, 1] }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: (i % 10) * 0.12,
                  }}
                />
              ))}
            </div>

            {/* Live transcript */}
            <div className="mt-4 space-y-2.5">
              <div className="flex gap-2.5">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white/10">
                  <UserRound className="h-3 w-3 text-slate-300" aria-hidden="true" />
                </span>
                <p className="rounded-xl rounded-tl-sm bg-white/[0.06] px-3 py-2 text-xs leading-relaxed text-slate-200 sm:text-[0.8rem]">
                  "Hi, do you have a room available for tonight?"
                </p>
              </div>
              <div className="flex justify-end gap-2.5">
                <p className="rounded-xl rounded-tr-sm bg-brand-500/15 px-3 py-2 text-xs leading-relaxed text-brand-100 ring-1 ring-inset ring-brand-400/20 sm:text-[0.8rem]">
                  "Yes — we have a Deluxe King Room available tonight at $180. Shall I reserve it for
                  you?"
                </p>
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand-500/20">
                  <Sparkles className="h-3 w-3 text-brand-300" aria-hidden="true" />
                </span>
              </div>
            </div>
          </div>

          {/* Call metadata */}
          <div className="mt-3 grid grid-cols-3 gap-2 sm:mt-4 sm:gap-3">
            {[
              { icon: Languages, label: 'Language', value: 'English' },
              { icon: BadgeCheck, label: 'Lead', value: 'Qualified' },
              { icon: CheckCircle2, label: 'Booking', value: 'Confirmed' },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-2 sm:rounded-xl sm:px-3 sm:py-2.5"
              >
                <div className="flex items-center gap-1.5 text-[0.6rem] uppercase tracking-wider text-slate-500 sm:text-[0.65rem]">
                  <item.icon className="h-3 w-3 text-brand-300" aria-hidden="true" />
                  {item.label}
                </div>
                <p className="mt-1 truncate text-xs font-semibold text-white sm:text-[0.8rem]">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Floating status cards — decorative, desktop only. Two ride above the
          panel, three below, so nothing is hidden behind them. */}
      <FloatingCard className="left-1 top-0" delay={0.6} floatDelay="0s">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50">
          <PhoneCall className="h-4 w-4 text-brand-600" aria-hidden="true" />
        </span>
        <div>
          <p className="text-[0.7rem] font-semibold text-ink-900">Incoming Call</p>
          <p className="text-[0.65rem] text-slate-500">Answered in 1.2s</p>
        </div>
      </FloatingCard>

      <FloatingCard className="right-1 top-2" delay={0.75} floatDelay="1.2s">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50">
          <Sparkles className="h-4 w-4 text-emerald-600" aria-hidden="true" />
        </span>
        <div>
          <p className="text-[0.7rem] font-semibold text-ink-900">AI Answered</p>
          <p className="text-[0.65rem] text-slate-500">No wait time</p>
        </div>
      </FloatingCard>

      <FloatingCard className="bottom-0 left-1" delay={0.9} floatDelay="0.6s">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" />
        </span>
        <div>
          <p className="text-[0.7rem] font-semibold text-ink-900">Booking Confirmed</p>
          <p className="text-[0.65rem] text-slate-500">Deluxe King · Tonight</p>
        </div>
      </FloatingCard>

      <FloatingCard className="bottom-1 right-1" delay={1.05} floatDelay="2.1s">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50">
          <MessageSquare className="h-4 w-4 text-brand-600" aria-hidden="true" />
        </span>
        <div>
          <p className="text-[0.7rem] font-semibold text-ink-900">WhatsApp Message</p>
          <p className="text-[0.65rem] text-slate-500">Replied instantly</p>
        </div>
      </FloatingCard>
    </div>
  )
}
