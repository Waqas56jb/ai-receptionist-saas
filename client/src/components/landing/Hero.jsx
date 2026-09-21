import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check, Clock, Zap, MonitorOff } from 'lucide-react'
import HeroVisual from './HeroVisual'
import { heroStats } from '../../data/landing'

const statIcons = [Clock, Zap, MonitorOff]

export default function Hero() {
  const reduceMotion = useReducedMotion()

  const rise = (delay) => ({
    initial: { opacity: 0, y: reduceMotion ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  })

  return (
    <section className="relative isolate overflow-hidden pb-20 pt-14 sm:pt-20 lg:pb-24 lg:pt-24" aria-labelledby="hero-heading">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-aurora" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid mask-fade-b" aria-hidden="true" />

      <div className="section-shell">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <motion.div {...rise(0)}>
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-2/70 px-3 py-1 text-xs font-medium tracking-wide text-primary-500 backdrop-blur">
                <span className="relative flex h-1.5 w-1.5">
                  {!reduceMotion && (
                    <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-secondary-400" />
                  )}
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-secondary-500" />
                </span>
                Trusted across hotels, clinics, retail & more.
              </span>
            </motion.div>

            <motion.h1
              id="hero-heading"
              {...rise(0.08)}
              className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-[-0.03em] sm:text-5xl lg:text-[3.5rem]"
            >
              <span className="text-ink">Answer every call,</span>
              <br />
              <span className="text-gradient">on every channel.</span>
            </motion.h1>

            <motion.p
              {...rise(0.16)}
              className="mt-6 max-w-xl text-lg leading-relaxed text-muted"
            >
              Push replies, bookings and lead capture to every phone line, WhatsApp thread, website
              chat and social inbox instantly. Your existing numbers and pages become a 24/7
              receptionist — no new hardware, no missed customers.
            </motion.p>

            <motion.div {...rise(0.24)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link to="/signup" className="btn-mint !px-7 !py-3.5 text-base">
                Start for Free
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a href="#how-it-works" className="btn-ghost-surface !px-7 !py-3.5 text-base">
                See how it works
              </a>
            </motion.div>

            <motion.p
              {...rise(0.3)}
              className="mt-3.5 flex items-center gap-2 text-xs text-muted"
            >
              <Check className="h-4 w-4 shrink-0 text-ember-400" strokeWidth={2.5} aria-hidden="true" />
              <span>Set up your business, connect a channel, go live the same day — no credit card needed.</span>
            </motion.p>

            <motion.dl
              {...rise(0.36)}
              className="mt-12 grid max-w-xl grid-cols-1 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface/50 backdrop-blur sm:grid-cols-3 sm:divide-x sm:divide-y-0"
            >
              {heroStats.map((stat, i) => {
                const Icon = statIcons[i]
                return (
                  <div key={stat.label} className="group relative p-5">
                    <span
                      className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-70"
                      style={{ backgroundImage: `linear-gradient(to right, transparent, ${stat.color}, transparent)` }}
                    />
                    <span
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{ backgroundColor: stat.bg, color: stat.color }}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <dd className="mt-3 font-display text-2xl font-bold tracking-tight text-ink">
                      {stat.value}
                    </dd>
                    <dt className="mt-0.5 text-xxs uppercase tracking-[0.16em] text-subtle">{stat.label}</dt>
                  </div>
                )
              })}
            </motion.dl>
          </div>

          <div className="relative lg:col-span-6">
            <div className="absolute -inset-4 -z-10 rounded-full bg-primary-500/12 blur-3xl" aria-hidden="true" />
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  )
}
