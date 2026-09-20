import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Reveal from '../ui/Reveal'
import Img from '../ui/Img'
import { industries } from '../../data/landing'

export default function Industries() {
  const [active, setActive] = useState(0)
  const current = industries[active]

  const prev = () => setActive((i) => (i === 0 ? industries.length - 1 : i - 1))
  const next = () => setActive((i) => (i === industries.length - 1 ? 0 : i + 1))

  return (
    <section id="industries" className="scroll-mt-24 py-24" aria-labelledby="industries-heading">
      <div className="section-shell">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Reveal>
              <h6 className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-500">
                Industries
              </h6>
            </Reveal>
            <Reveal delay={0.06}>
              <h2
                id="industries-heading"
                className="mt-3 font-display text-3xl font-bold leading-[1.15] tracking-[-0.025em] text-ink sm:text-4xl"
              >
                Choose a space. See what its receptionist should handle.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-muted">
              Six very different commercial environments on one platform — bookings, FAQs,
              after-hours calls and live chat.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="relative mt-12">
          <div className="grid overflow-hidden rounded-3xl border border-line bg-surface lg:grid-cols-12">
            <div className="relative aspect-[16/10] overflow-hidden bg-canvas lg:col-span-7 lg:aspect-auto lg:min-h-[28rem]">
              <Img
                key={current.image}
                src={current.image}
                alt={current.alt}
                className="h-full w-full object-cover"
                width={900}
                height={563}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-canvas via-transparent to-transparent lg:bg-gradient-to-r" />
              <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-line bg-canvas/70 px-3 py-1 text-xxs font-semibold uppercase tracking-wider text-ink backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Live
              </span>
            </div>

            <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-5">
              <div>
                <p className="font-display text-xs font-bold tracking-[0.2em] text-primary-500">
                  {String(active + 1).padStart(2, '0')} / {String(industries.length).padStart(2, '0')}
                </p>
                <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-ink">
                  {current.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{current.useCase}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {current.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-line bg-surface-2/50 px-2.5 py-1 text-xxs font-medium text-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex items-center justify-between gap-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={prev}
                    className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink transition hover:border-primary-400 hover:text-primary-500"
                    aria-label="Previous industry"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    className="grid h-10 w-10 place-items-center rounded-full border border-line text-ink transition hover:border-primary-400 hover:text-primary-500"
                    aria-label="Next industry"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
                <ol className="hidden gap-1.5 sm:flex">
                  {industries.map((industry, i) => (
                    <li key={industry.name}>
                      <button
                        type="button"
                        onClick={() => setActive(i)}
                        aria-label={industry.name}
                        aria-current={i === active}
                        className={`h-1.5 rounded-full transition ${
                          i === active ? 'w-6 bg-primary-400' : 'w-1.5 bg-line-strong'
                        }`}
                      />
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
