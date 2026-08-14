import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import { securityItems } from '../../data/landing'

export default function SecuritySection() {
  return (
    <section className="section-y" aria-labelledby="security-heading">
      <div className="container-page">
        <SectionHeading
          id="security-heading"
          eyebrow="Trust & Control"
          title="Your business data stays your business data."
          description="The AI only ever speaks from what you give it, and every account is separated from every other business on the platform."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {securityItems.map((item, i) => (
            <Reveal key={item.title} delay={(i % 3) * 0.08}>
              <article className="group h-full rounded-2xl border border-slate-200/80 bg-white p-6 transition duration-300 hover:border-brand-200 hover:shadow-card">
                <span className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-ink-900 transition-colors duration-300 group-hover:border-brand-200 group-hover:bg-brand-50 group-hover:text-brand-600">
                  <item.icon className="h-[1.25rem] w-[1.25rem]" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-[1.05rem] font-semibold text-ink-900">{item.title}</h3>
                <p className="mt-2.5 text-[0.925rem] leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
