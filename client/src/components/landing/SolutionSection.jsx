import Reveal from '../ui/Reveal'
import { platformFeatures } from '../../data/landing'

export default function SolutionSection() {
  return (
    <section id="product" className="scroll-mt-24 py-24" aria-labelledby="solution-heading">
      <div className="section-shell">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Reveal>
              <h6 className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-500">
                The platform
              </h6>
            </Reveal>
            <Reveal delay={0.06}>
              <h2
                id="solution-heading"
                className="mt-3 font-display text-3xl font-bold leading-[1.15] tracking-[-0.025em] text-ink sm:text-4xl"
              >
                Everything you need to run reception across every channel.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-muted">
              Calls, messages, knowledge, leads and live conversation status all in one place.
              Managing your front desk takes a browser tab, not a night shift.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {platformFeatures.map((feature, i) => (
            <Reveal key={feature.n} delay={i * 0.08}>
              <article className="group relative overflow-hidden rounded-2xl border border-line bg-surface p-7 transition duration-300 hover:-translate-y-1 hover:border-line-strong">
                <span
                  className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-70 transition group-hover:opacity-100"
                  style={{ backgroundImage: `linear-gradient(to right, transparent, ${feature.color}, transparent)` }}
                />
                <span
                  className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition duration-500 group-hover:opacity-100"
                  style={{ backgroundColor: `${feature.color}24` }}
                />
                <div className="flex items-start justify-between">
                  <span
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-lg"
                    style={{
                      backgroundImage: `linear-gradient(140deg, ${feature.from}, ${feature.to})`,
                      boxShadow: `0 10px 22px -12px ${feature.color}`,
                    }}
                  >
                    <feature.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span
                    className="font-display text-xs font-bold tracking-[0.2em] transition group-hover:opacity-100"
                    style={{ color: feature.color, opacity: 0.55 }}
                  >
                    {feature.n}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-lg font-bold tracking-tight text-ink">
                  {feature.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted">{feature.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
