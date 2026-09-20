import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { PhoneCall, MessageSquare, Globe, MoonStar, Sunrise } from 'lucide-react'
import Reveal from '../ui/Reveal'

const nightActivity = [
  { time: '23:41', icon: MessageSquare, text: 'WhatsApp enquiry about pricing', tag: 'Answered' },
  { time: '02:14', icon: PhoneCall, text: 'Call — availability for next weekend', tag: 'Lead captured' },
  { time: '05:58', icon: Globe, text: 'Website question about parking', tag: 'Answered' },
  { time: '07:12', icon: PhoneCall, text: 'Call — booking confirmed for tonight', tag: 'Booked' },
]

const HOURS = [2, 1, 1, 0, 1, 2, 3, 5, 7, 8, 6, 7, 8, 6, 5, 6, 7, 8, 6, 5, 4, 3, 3, 2]

export default function AvailabilitySection() {
  const reduceMotion = useReducedMotion()
  const max = Math.max(...HOURS)

  return (
    <section id="availability" className="scroll-mt-24 border-y border-line bg-canvas-soft py-24" aria-labelledby="availability-heading">
      <div className="section-shell">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <div>
            <Reveal>
              <h6 className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-500">Always On</h6>
            </Reveal>
            <Reveal delay={0.06}>
              <h2
                id="availability-heading"
                className="mt-3 font-display text-3xl font-bold leading-[1.15] tracking-[-0.025em] text-ink sm:text-4xl"
              >
                Your business doesn&apos;t close at 5&nbsp;PM.
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-4 text-pretty text-base leading-relaxed text-muted sm:text-lg">
                Your AI receptionist keeps answering questions, capturing leads and handling
                enquiries while your team focuses on the business — through evenings, weekends and
                public holidays.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <dl className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-line bg-surface p-5">
                  <dt className="flex items-center gap-2 text-sm font-semibold text-ink">
                    <MoonStar className="h-4 w-4 text-primary-500" aria-hidden="true" />
                    After hours
                  </dt>
                  <dd className="mt-2 text-[0.9rem] leading-relaxed text-muted">
                    Enquiries that arrive at midnight are answered at midnight, not the next morning.
                  </dd>
                </div>
                <div className="rounded-2xl border border-line bg-surface p-5">
                  <dt className="flex items-center gap-2 text-sm font-semibold text-ink">
                    <Sunrise className="h-4 w-4 text-primary-500" aria-hidden="true" />
                    Every morning
                  </dt>
                  <dd className="mt-2 text-[0.9rem] leading-relaxed text-muted">
                    Your team starts the day with a clean inbox of transcripts, leads and follow-ups.
                  </dd>
                </div>
              </dl>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-8">
                <Link to="/signup" className="btn-mint !px-7 !py-3.5 text-base">
                  Start for Free
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="panel-raised relative overflow-hidden rounded-2xl p-6 sm:p-8">
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-subtle">
                    AI Receptionist
                  </p>
                  <div className="mt-2 flex items-center gap-2.5">
                    <span className="relative flex h-2.5 w-2.5">
                      {!reduceMotion && (
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                      )}
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                    </span>
                    <span className="font-display text-xl font-bold uppercase tracking-[0.12em] text-ink sm:text-2xl">
                      Online
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-display text-4xl font-extrabold leading-none tracking-tight text-ink sm:text-5xl">
                    24<span className="text-primary-400">/</span>7
                  </p>
                  <p className="mt-2 text-xs text-muted">Never offline</p>
                </div>
              </div>

              <div className="relative mt-8">
                <div className="flex h-20 items-end gap-[3px]" aria-hidden="true">
                  {HOURS.map((value, i) => (
                    <motion.span
                      key={i}
                      initial={{ scaleY: reduceMotion ? 1 : 0.15 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ duration: 0.6, delay: reduceMotion ? 0 : i * 0.02, ease: [0.22, 1, 0.36, 1] }}
                      style={{ height: `${Math.max((value / max) * 100, 8)}%` }}
                      className={`flex-1 origin-bottom rounded-sm ${
                        i < 7 || i > 20 ? 'bg-primary-400/70' : 'bg-line-strong'
                      }`}
                    />
                  ))}
                </div>
                <div className="mt-3 flex justify-between text-[0.65rem] font-medium uppercase tracking-wider text-subtle">
                  <span>00:00</span>
                  <span>06:00</span>
                  <span>12:00</span>
                  <span>18:00</span>
                  <span>24:00</span>
                </div>
                <p className="mt-3 text-xs text-muted">
                  <span className="mr-1.5 inline-block h-2 w-2 rounded-sm bg-primary-400/70" aria-hidden="true" />
                  Conversations handled outside working hours
                </p>
              </div>

              <ul className="relative mt-7 space-y-2">
                {nightActivity.map((item, i) => (
                  <motion.li
                    key={item.time}
                    initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.4, delay: reduceMotion ? 0 : i * 0.08 }}
                    className="flex items-center gap-3 rounded-xl border border-line bg-canvas/40 px-3.5 py-2.5"
                  >
                    <span className="font-mono text-[0.7rem] tabular-nums text-subtle">{item.time}</span>
                    <item.icon className="h-3.5 w-3.5 shrink-0 text-primary-400" aria-hidden="true" />
                    <span className="min-w-0 flex-1 truncate text-[0.8rem] text-ink">{item.text}</span>
                    <span className="hidden shrink-0 rounded-full bg-emerald-400/10 px-2 py-0.5 text-[0.65rem] font-semibold text-emerald-400 sm:inline">
                      {item.tag}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
