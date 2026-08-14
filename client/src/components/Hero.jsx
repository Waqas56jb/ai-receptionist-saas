import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, PlayCircle, PhoneCall, MessageSquare, Instagram, Globe } from 'lucide-react'
import Button from './ui/Button'
import HeroVisual from './HeroVisual'

const heroChannels = [
  { icon: PhoneCall, label: 'Phone' },
  { icon: MessageSquare, label: 'WhatsApp' },
  { icon: Instagram, label: 'Instagram' },
  { icon: Globe, label: 'Web' },
]

export default function Hero() {
  const reduceMotion = useReducedMotion()

  const rise = (delay) => ({
    initial: { opacity: 0, y: reduceMotion ? 0 : 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  })

  return (
    <section
      className="relative overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-10 lg:pt-32 xl:pt-36"
      aria-labelledby="hero-heading"
    >
      {/* Layered background: soft blue wash + faint grid */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/70 via-white to-white" />
        <div className="absolute inset-x-0 top-0 h-[38rem] bg-grid-light [background-size:56px_56px] mask-fade-b opacity-70" />
        <div className="absolute -left-40 top-10 h-[26rem] w-[26rem] rounded-full bg-brand-200/25 blur-[100px]" />
        <div className="absolute -right-24 top-40 h-[22rem] w-[22rem] rounded-full bg-brand-300/20 blur-[100px]" />
      </div>

      <div className="container-page">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-12 xl:gap-16">
          {/* Copy */}
          <div className="max-w-xl lg:max-w-none">
            <motion.div {...rise(0)}>
              <span className="eyebrow">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500" aria-hidden="true" />
                AI Receptionist Platform
              </span>
            </motion.div>

            <motion.h1
              id="hero-heading"
              {...rise(0.08)}
              className="mt-6 text-[2.5rem] font-extrabold leading-[1.06] tracking-[-0.03em] text-ink-900 sm:text-[3.25rem] lg:text-[3.75rem] xl:text-[4.25rem]"
            >
              Your AI receptionist,{' '}
              <span className="relative whitespace-nowrap text-brand-600">
                available 24/7.
              </span>
            </motion.h1>

            <motion.p
              {...rise(0.16)}
              className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-slate-600 sm:text-lg"
            >
              Answer every call and customer message instantly with an AI receptionist that knows
              your business, speaks multiple languages and works around the clock — so no enquiry
              ever goes unanswered.
            </motion.p>

            <motion.div {...rise(0.24)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button as="a" href="#get-started" variant="primary" size="lg">
                Get Started
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button as="a" href="#product" variant="secondary" size="lg">
                <PlayCircle className="h-[1.15rem] w-[1.15rem]" aria-hidden="true" />
                Watch Demo
              </Button>
            </motion.div>

            <motion.ul
              {...rise(0.32)}
              className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm font-medium text-slate-500"
            >
              {heroChannels.map((channel, i) => (
                <li key={channel.label} className="flex items-center gap-2">
                  {i > 0 && (
                    <span className="mr-3 hidden h-1 w-1 rounded-full bg-slate-300 sm:inline-block" aria-hidden="true" />
                  )}
                  <channel.icon className="h-4 w-4 text-brand-500" aria-hidden="true" />
                  {channel.label}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Product UI */}
          <div className="relative lg:pl-4">
            <HeroVisual />
          </div>
        </div>
      </div>
    </section>
  )
}
