import { ArrowRight, CalendarDays } from 'lucide-react'
import Reveal from './ui/Reveal'
import Button from './ui/Button'

export default function FinalCTA() {
  return (
    <section
      id="get-started"
      className="dark-section relative scroll-mt-24 overflow-hidden bg-ink-900 py-20 sm:py-24 lg:py-28"
      aria-labelledby="cta-heading"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-grid-dark [background-size:64px_64px] opacity-40" />
        <div className="absolute left-1/2 top-1/2 h-[30rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-600/20 blur-[130px]" />
      </div>

      <div className="container-page relative">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <span className="eyebrow-dark">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-300" aria-hidden="true" />
              Get Started
            </span>
          </Reveal>

          <Reveal delay={0.06}>
            <h2
              id="cta-heading"
              className="mt-6 text-[2.125rem] font-bold leading-[1.1] tracking-tight text-white sm:text-[2.75rem] lg:text-[3.15rem]"
            >
              Never miss another customer.
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-5 text-pretty text-base leading-relaxed text-slate-300 sm:text-lg">
              Give your business an AI receptionist that works 24/7 — answering calls, replying to
              messages and turning enquiries into booked customers.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Button as="a" href="#" variant="onDark" size="lg">
                Get Started
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button as="a" href="#" variant="outlineDark" size="lg">
                <CalendarDays className="h-[1.1rem] w-[1.1rem]" aria-hidden="true" />
                Book a Demo
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <p className="mt-6 text-sm text-slate-400">
              Set up your business, connect a number, go live the same day.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
