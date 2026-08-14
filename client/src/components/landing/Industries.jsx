import { Link } from 'react-router-dom'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import Img from '../ui/Img'
import { industries } from '../../data/landing'

export default function Industries() {
  return (
    <section id="industries" className="section-y scroll-mt-24" aria-labelledby="industries-heading">
      <div className="container-page">
        <SectionHeading
          id="industries-heading"
          eyebrow="Industries"
          title="Built for any business that talks to customers."
          description="The platform is not tied to one sector. Each business trains its own AI receptionist on its own information — these are simply the places it fits naturally."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry, i) => (
            <Reveal key={industry.name} delay={(i % 3) * 0.08}>
              <article className="group h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-subtle transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card">
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <Img
                    src={industry.image}
                    alt={industry.alt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    width={900}
                    height={563}
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-ink-900/55 via-ink-900/5 to-transparent"
                    aria-hidden="true"
                  />
                  <span className="absolute bottom-3 left-3 grid h-9 w-9 place-items-center rounded-xl bg-white/95 text-brand-600 shadow-subtle backdrop-blur">
                    <industry.icon className="h-[1.1rem] w-[1.1rem]" aria-hidden="true" />
                  </span>
                </div>

                <div className="p-5 sm:p-6">
                  <h3 className="text-lg font-semibold text-ink-900">{industry.name}</h3>
                  <p className="mt-2 text-[0.925rem] leading-relaxed text-slate-600">
                    {industry.useCase}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.12}>
          <p className="mt-10 text-center text-sm text-slate-500">
            Running a different kind of business?{' '}
            <Link to="/signup" className="font-semibold text-brand-600 underline-offset-4 hover:underline">
              The AI adapts to your information too.
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
