import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Reveal from '../ui/Reveal'
import Img from '../ui/Img'
import { industries } from '../../data/landing'

function IndustryCard({ industry, index, featured, onSelect }) {
  const number = String(index + 1).padStart(2, '0')

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-current={featured}
      className={`flex h-full w-full flex-col overflow-hidden rounded-3xl border text-left transition duration-300 ${
        featured
          ? 'border-primary-400/70 bg-surface shadow-[0_0_0_1px_rgb(45_212_191_/_0.35),0_24px_60px_-28px_rgb(20_184_166_/_0.55)]'
          : 'border-line bg-surface/80 hover:border-line-strong'
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Img
          src={industry.image}
          alt={industry.alt}
          className="h-full w-full object-cover"
          width={720}
          height={450}
        />
        <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-rose-500/90 px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-wider text-white shadow-lg">
          <span className="h-1.5 w-1.5 rounded-full bg-white" aria-hidden="true" />
          Live
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <p className="font-display text-xs font-bold tracking-[0.18em] text-primary-500">{number}</p>
        <h3 className={`mt-2 font-display text-xl font-bold tracking-tight ${featured ? 'text-primary-400' : 'text-ink'}`}>
          {industry.sector}
        </h3>
        <p className="mt-1 text-[0.78rem] font-medium text-muted">{industry.name}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted">{industry.useCase}</p>
        <div className="mt-auto flex flex-wrap gap-2 pt-5">
          {industry.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-line bg-canvas-soft/80 px-2.5 py-1 text-[0.68rem] font-medium text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </button>
  )
}

export default function Industries() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = industries.length

  const prev = () => setActive((i) => (i === 0 ? total - 1 : i - 1))
  const next = () => setActive((i) => (i === total - 1 ? 0 : i + 1))

  const visible = [
    (active - 1 + total) % total,
    active,
    (active + 1) % total,
  ]

  useEffect(() => {
    if (paused) return undefined
    const id = window.setInterval(next, 5500)
    return () => window.clearInterval(id)
  }, [paused, active])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <section
      id="industries"
      className="scroll-mt-24 py-24"
      aria-labelledby="industries-heading"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="section-shell">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <Reveal>
              <h6 className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-500">Industries</h6>
            </Reveal>
            <Reveal delay={0.06}>
              <h2
                id="industries-heading"
                className="mt-3 font-display text-3xl font-bold leading-[1.15] tracking-[-0.025em] text-ink sm:text-4xl"
              >
                Choose a space. See what its receptionist should handle.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-4 max-w-xl text-muted">
                Twenty very different commercial environments on one platform — banks, hospitals,
                hotels, government offices and more. Each one answers calls and messages from its
                own knowledge.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <p className="font-display text-sm font-semibold tabular-nums text-muted">
              <span className="text-ink">{String(active + 1).padStart(2, '0')}</span>
              <span className="mx-1 text-subtle">/</span>
              {String(total).padStart(2, '0')}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.12} className="relative mt-12">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visible.map((index, position) => {
              const featured = position === 1
              return (
                <div
                  key={`${industries[index].sector}-${index}`}
                  className={position === 0 ? 'hidden lg:block' : position === 2 ? 'hidden md:block' : 'block'}
                >
                  <IndustryCard
                    industry={industries[index]}
                    index={index}
                    featured={featured}
                    onSelect={() => setActive(index)}
                  />
                </div>
              )
            })}
          </div>

          <button
            type="button"
            onClick={prev}
            className="absolute left-0 top-1/2 z-10 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface text-ink shadow-lift transition hover:border-primary-400 hover:text-primary-400"
            aria-label="Previous industry"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-0 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 translate-x-1/2 place-items-center rounded-full bg-ember-500 text-white shadow-lg shadow-ember-500/30 transition hover:bg-ember-400"
            aria-label="Next industry"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </Reveal>

        <ol className="mt-8 flex items-center justify-center gap-1.5">
          {industries.map((industry, i) => (
            <li key={industry.sector}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`${industry.sector}: ${industry.name}`}
                aria-current={i === active}
                className={`h-1.5 rounded-full transition ${
                  i === active ? 'w-6 bg-primary-400' : 'w-1.5 bg-line-strong hover:bg-primary-400/50'
                }`}
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
