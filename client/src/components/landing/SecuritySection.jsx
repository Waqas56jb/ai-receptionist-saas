import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import { securityItems } from '../../data/landing'

export default function SecuritySection() {
  return (
    <section className="scroll-mt-24 border-t border-line py-24" aria-labelledby="security-heading">
      <div className="section-shell">
        <SectionHeading
          id="security-heading"
          eyebrow="Trust & Control"
          title="Your business data stays your business data."
          description="The AI only ever speaks from what you give it, and every account is separated from every other business on the platform."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {securityItems.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 0.08}>
              <article className="group h-full rounded-2xl border border-line bg-surface p-6 transition duration-300 hover:-translate-y-1 hover:border-line-strong">
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-surface-2 text-ink transition-colors duration-300 group-hover:border-primary-400/40 group-hover:bg-primary-500/10 group-hover:text-primary-500">
                  <item.icon className="h-[1.25rem] w-[1.25rem]" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-[1.05rem] font-semibold text-ink">{item.title}</h3>
                <p className="mt-2.5 text-[0.925rem] leading-relaxed text-muted">{item.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
