import { Check } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import Button from '../ui/Button'
import { pricingPlans } from '../../data/landing'

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="section-y scroll-mt-24 bg-slate-50/70"
      aria-labelledby="pricing-heading"
    >
      <div className="container-page">
        <SectionHeading
          id="pricing-heading"
          eyebrow="Pricing"
          title="Simple plans for every stage."
          description="Final pricing is being confirmed. Talk to us and we'll match a plan to the number of calls and messages your business handles."
        />

        <div className="mt-14 grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.09}>
              <article
                className={`relative flex h-full flex-col rounded-2xl p-7 transition duration-300 sm:p-8 ${
                  plan.featured
                    ? 'border border-ink-800 bg-ink-900 shadow-panel lg:-mt-4 lg:pb-10 lg:pt-10'
                    : 'border border-slate-200/80 bg-white shadow-subtle hover:border-brand-200 hover:shadow-card'
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-7 rounded-full bg-ember-500 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-white sm:left-8">
                    Most popular
                  </span>
                )}

                <h3
                  className={`font-display text-lg font-bold ${
                    plan.featured ? 'text-white' : 'text-ink-900'
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`mt-2 text-[0.9rem] leading-relaxed ${
                    plan.featured ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {plan.description}
                </p>

                <p
                  className={`mt-6 font-display text-2xl font-bold tracking-tight sm:text-[1.75rem] ${
                    plan.featured ? 'text-white' : 'text-ink-900'
                  }`}
                >
                  {plan.price}
                </p>

                <ul className="mt-6 flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <span
                        className={`mt-0.5 grid h-[1.125rem] w-[1.125rem] shrink-0 place-items-center rounded-full ${
                          plan.featured ? 'bg-brand-500/25 text-brand-200' : 'bg-brand-50 text-brand-600'
                        }`}
                      >
                        <Check className="h-2.5 w-2.5" strokeWidth={3.5} aria-hidden="true" />
                      </span>
                      <span
                        className={`text-[0.875rem] leading-relaxed ${
                          plan.featured ? 'text-slate-300' : 'text-slate-600'
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  as="a"
                  href="#get-started"
                  size="lg"
                  variant={plan.featured ? 'onDark' : 'secondary'}
                  className="mt-8 w-full"
                >
                  {plan.cta}
                </Button>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.16}>
          <p className="mt-10 text-center text-sm text-slate-500">
            Not sure which plan fits?{' '}
            <a href="#get-started" className="font-semibold text-brand-600 underline-offset-4 hover:underline">
              Talk to Sales
            </a>{' '}
            and we'll help you choose.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
