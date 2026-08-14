import SectionHeading from './ui/SectionHeading'
import Reveal from './ui/Reveal'
import { problems } from '../data/landing'

export default function ProblemSection() {
  return (
    <section className="section-y bg-slate-50/70" aria-labelledby="problem-heading">
      <div className="container-page">
        <SectionHeading
          id="problem-heading"
          eyebrow="The Problem"
          title="Every missed call is a missed opportunity."
          description="Customer enquiries do not wait for office hours. When nobody answers, people simply move on to the next business."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {problems.map((problem, i) => (
            <Reveal key={problem.title} delay={i * 0.08}>
              <article className="group card-surface h-full p-6 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
                  <problem.icon className="h-[1.3rem] w-[1.3rem]" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-ink-900">{problem.title}</h3>
                <p className="mt-2.5 text-[0.925rem] leading-relaxed text-slate-600">
                  {problem.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
