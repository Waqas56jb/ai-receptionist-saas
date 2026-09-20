import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays } from 'lucide-react'
import Reveal from '../ui/Reveal'
import { brand } from '../../config/brand'

export default function FinalCTA() {
  return (
    <section
      id="get-started"
      className="relative scroll-mt-24 overflow-hidden border-t border-line py-20 sm:py-24 lg:py-28"
      aria-labelledby="cta-heading"
    >
      <div className="pointer-events-none absolute inset-0 bg-aurora" aria-hidden="true" />
      <div className="section-shell relative">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <h6 className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-500">
              One afternoon is enough
            </h6>
          </Reveal>
          <Reveal delay={0.06}>
            <h2
              id="cta-heading"
              className="mt-3 font-display text-3xl font-bold leading-[1.1] tracking-tight text-ink sm:text-4xl lg:text-[3.15rem]"
            >
              The phones are already ringing
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mt-5 text-pretty text-base leading-relaxed text-muted sm:text-lg">
              Get an AI receptionist on the number and inboxes you already use — no card details, no
              hardware order, no installer to schedule.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link to="/signup" className="btn-mint !px-7 !py-3.5 text-base">
                Start for Free
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <a
                href={`mailto:${brand.contactEmail}?subject=Demo%20request`}
                className="btn-ghost-surface !px-7 !py-3.5 text-base"
              >
                <CalendarDays className="h-[1.1rem] w-[1.1rem]" aria-hidden="true" />
                Book a walkthrough
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
