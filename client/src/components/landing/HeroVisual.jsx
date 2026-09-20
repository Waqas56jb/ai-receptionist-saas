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
      className={`absolute z-20 hidden items-center gap-2.5 rounded-2xl border border-line bg-surface/90 px-3.5 py-2.5 shadow-xl backdrop-blur lg:flex ${
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
    <div className="relative lg:py-[4.5rem]">
      <motion.div
        initial={{ opacity: 0, y: reduceMotion ? 0 : 28, scale: reduceMotion ? 1 : 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        className="panel-raised relative overflow-hidden rounded-2xl"
      >
        <div className="flex items-center gap-2 border-b border-line bg-surface-2/70 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent-400/70" aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" aria-hidden="true" />
          <span className="ms-3 truncate rounded-md bg-canvas/60 px-2.5 py-1 text-xxs text-subtle">
            app.devmark / conversations / live
          </span>
        </div>

        <div className="relative flex items-center justify-between border-b border-line px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary-500/20">
              <Sparkles className="h-3.5 w-3.5 text-primary-400" aria-hidden="true" />
            </span>
            <span className="font-display text-[0.8rem] font-semibold text-ink sm:text-sm">
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
          <div className="rounded-xl border border-line bg-canvas/40 p-4 sm:rounded-2xl sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary-400 to-primary-700 font-display text-sm font-bold text-primary-950 sm:h-11 sm:w-11">
                  DR
                </span>
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-semibold text-ink sm:text-[0.95rem]">
                    Daniel Reyes
                  </p>
                  <p className="truncate text-xs text-muted">+1 (415) 220 · Incoming call</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1.5 rounded-lg bg-surface-2/80 px-2.5 py-1.5">
                <Clock className="h-3.5 w-3.5 text-primary-400" aria-hidden="true" />
                <span className="font-mono text-xs tabular-nums text-ink">{formatDuration(seconds)}</span>
              </div>
            </div>

            <div className="mt-4 flex h-10 items-center gap-[3px]" aria-hidden="true">
              {WAVE.map((h, i) => (
                <motion.span
                  key={i}
                  className="w-full max-w-[4px] flex-1 rounded-full bg-gradient-to-t from-primary-700/40 to-primary-400"
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

            <div className="mt-4 space-y-2.5">
              <div className="flex gap-2.5">
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-surface-2">
                  <UserRound className="h-3 w-3 text-muted" aria-hidden="true" />
                </span>
                <p className="rounded-xl rounded-tl-sm bg-surface-2 px-3 py-2 text-xs leading-relaxed text-ink sm:text-[0.8rem]">
                  &ldquo;Hi, do you have a room available for tonight?&rdquo;
                </p>
              </div>
              <div className="flex justify-end gap-2.5">
                <p className="rounded-xl rounded-tr-sm bg-primary-500/15 px-3 py-2 text-xs leading-relaxed text-ink ring-1 ring-inset ring-primary-400/20 sm:text-[0.8rem]">
                  &ldquo;Yes — we have a Deluxe King Room available tonight at $180. Shall I reserve it for
                  you?&rdquo;
                </p>
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary-500/20">
                  <Sparkles className="h-3 w-3 text-primary-400" aria-hidden="true" />
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 sm:mt-4 sm:gap-3">
            {[
              { icon: Languages, label: 'Language', value: 'English' },
              { icon: BadgeCheck, label: 'Lead', value: 'Qualified' },
              { icon: CheckCircle2, label: 'Booking', value: 'Confirmed' },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-line bg-canvas/40 px-2.5 py-2 sm:rounded-xl sm:px-3 sm:py-2.5"
              >
                <div className="flex items-center gap-1.5 text-[0.6rem] uppercase tracking-wider text-subtle sm:text-[0.65rem]">
                  <item.icon className="h-3 w-3 text-primary-400" aria-hidden="true" />
                  {item.label}
                </div>
                <p className="mt-1 truncate text-xs font-semibold text-ink sm:text-[0.8rem]">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <FloatingCard className="-bottom-6 -left-6 top-auto" delay={0.6} floatDelay="0s">
        <div>
          <p className="text-xxs uppercase tracking-wider text-subtle">Calls online</p>
          <p className="mt-1 flex items-center gap-2 font-display text-lg font-semibold text-ink">
            <span className="relative flex h-2 w-2">
              {!reduceMotion && (
                <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-emerald-400" />
              )}
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            28 / 30
          </p>
        </div>
      </FloatingCard>

      <FloatingCard className="-right-6 -top-6" delay={0.75} floatDelay="-3s">
        <div>
          <p className="text-xxs uppercase tracking-wider text-subtle">Campaign</p>
          <p className="mt-1 font-display text-sm font-semibold text-ink">Tonight’s arrivals</p>
          <p className="text-xxs text-primary-500">Scheduled · 8 locations</p>
        </div>
      </FloatingCard>

      <FloatingCard className="bottom-8 right-1 hidden xl:flex" delay={0.9} floatDelay="1.2s">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500/15">
          <MessageSquare className="h-4 w-4 text-emerald-400" aria-hidden="true" />
        </span>
        <div>
          <p className="text-[0.7rem] font-semibold text-ink">WhatsApp</p>
          <p className="text-[0.65rem] text-muted">Replied instantly</p>
        </div>
      </FloatingCard>

      <FloatingCard className="left-1 top-8 hidden xl:flex" delay={1.05} floatDelay="0.6s">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-500/15">
          <PhoneCall className="h-4 w-4 text-primary-500" aria-hidden="true" />
        </span>
        <div>
          <p className="text-[0.7rem] font-semibold text-ink">Incoming Call</p>
          <p className="text-[0.65rem] text-muted">Answered in 1.2s</p>
        </div>
      </FloatingCard>
    </div>
  )
}
