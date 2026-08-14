import SectionHeading from './ui/SectionHeading'
import Reveal from './ui/Reveal'
import { steps } from '../data/landing'

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="section-y scroll-mt-24 bg-slate-50/70"
      aria-labelledby="how-heading"
    >
      <div className="container-page">
        <SectionHeading
          id="how-heading"
          eyebrow="How It Works"
          title="From setup to your first AI conversation."
          description="No technical work and no new hardware. Most businesses are live on the same day they sign up."
        />

        <div className="relative mt-16">
          {/* Connecting line: horizontal on desktop, vertical on mobile */}
          <div
            className="pointer-events-none absolute left-[1.65rem] top-6 hidden h-[calc(100%-3rem)] w-px bg-gradient-to-b from-brand-200 via-brand-200 to-transparent sm:block lg:hidden"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute left-0 right-0 top-[3.15rem] hidden h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent lg:block"
            aria-hidden="true"
          />

          <ol className="relative grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-3 lg:gap-8">
            {steps.map((step, i) => (
              <Reveal as="li" key={step.number} delay={i * 0.12}>
                <div className="flex gap-5 sm:gap-6 lg:block">
                  <div className="relative shrink-0">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl border border-slate-200 bg-white shadow-subtle">
                      <step.icon className="h-6 w-6 text-brand-600" aria-hidden="true" />
                    </span>
                  </div>

                  <div className="lg:mt-6">
                    <span className="font-display text-sm font-bold tracking-[0.14em] text-brand-600">
                      {step.number}
                    </span>
                    <h3 className="mt-2 text-xl font-semibold text-ink-900">{step.title}</h3>
                    <p className="mt-2.5 max-w-sm text-[0.95rem] leading-relaxed text-slate-600">
                      {step.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
