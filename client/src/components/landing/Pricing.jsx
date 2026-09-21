import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { brand } from '../../config/brand'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import { pricingPlans } from '../../data/landing'

export default function Pricing() {
  const [selected, setSelected] = useState('professional')
  const current = pricingPlans.find((plan) => plan.id === selected) || pricingPlans[1]

  return (
    <section id="pricing" className="scroll-mt-24 py-24" aria-labelledby="pricing-heading">
      <div className="section-shell">
        <SectionHeading
          id="pricing-heading"
          eyebrow="Pricing"
          title="Choose the plan that fits your front desk"
          description="Start free while we confirm final pricing, or talk to us and we'll match a plan to the calls and messages you handle."
        />

        <Reveal delay={0.1} className="mx-auto mt-14 max-w-3xl">
          <div className="space-y-3">
            {pricingPlans.map((plan) => {
              const active = selected === plan.id
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelected(plan.id)}
                  className={`group relative flex w-full items-center gap-4 rounded-2xl border p-5 text-left transition duration-300 ${
                    active
                      ? 'border-primary-500/60 bg-primary-500/10 shadow-lg shadow-primary-600/10'
                      : 'border-line bg-surface hover:border-line-strong hover:bg-surface-2/40'
                  }`}
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
                      active ? 'border-primary-500 bg-primary-500' : 'border-line group-hover:border-primary-400'
                    }`}
                  >
                    {active && <Check className="h-3 w-3 text-white" strokeWidth={3.5} aria-hidden="true" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-display text-lg font-bold tracking-tight text-ink">{plan.name}</span>
                      {plan.featured && (
                        <span className="rounded-full bg-ember-500 px-2 py-0.5 text-xxs font-semibold text-white">
                          Most Popular
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted">{plan.hint}</span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="font-display text-xl font-bold tracking-tight text-ink sm:text-2xl">
                      {plan.price}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
            <p className="text-xs text-muted">{current.description}</p>
            {current.cta === 'Talk to Sales' ? (
              <a
                href={`mailto:${brand.contactEmail}?subject=Enterprise%20plan%20enquiry`}
                className="btn-mint !px-5 !py-2 text-xs"
              >
                {current.cta}
              </a>
            ) : (
              <Link to="/signup" className="btn-mint !px-5 !py-2 text-xs">
                {current.cta}
              </Link>
            )}
          </div>

          <ul className="mt-6 grid gap-2 sm:grid-cols-2">
            {current.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm text-muted">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" strokeWidth={2.5} aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
