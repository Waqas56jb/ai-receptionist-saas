import { ArrowRight } from 'lucide-react'
import Reveal from '../ui/Reveal'
import { steps } from '../../data/landing'

const palettes = [
  { from: '#26cfa6', to: '#0f6b5e' },
  { from: '#60a5fa', to: '#1d4ed8' },
  { from: '#c084fc', to: '#6d28d9' },
  { from: '#34d399', to: '#047857' },
]

function StepCard({ step }) {
  return (
    <div className="w-full rounded-2xl border border-line bg-surface p-5 shadow-xl shadow-black/5">
      <h3 className="font-display text-base font-bold tracking-tight text-ink">{step.title}</h3>
      <p className="mt-2 text-xs leading-relaxed text-muted">{step.description}</p>
      <a
        href={step.href}
        className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary-500 transition hover:gap-2.5"
      >
        Read more
        <ArrowRight className="h-3 w-3" aria-hidden="true" />
      </a>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {step.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-line bg-surface-2/50 px-2 py-0.5 text-xxs text-muted"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}

function StepIcon({ step, index }) {
  const palette = palettes[index % palettes.length]
  return (
    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-line bg-surface shadow-lg shadow-black/10">
      <span
        className="flex h-9 w-9 items-center justify-center rounded-full text-white"
        style={{ backgroundImage: `linear-gradient(140deg, ${palette.from}, ${palette.to})` }}
      >
        <step.icon className="h-4 w-4" aria-hidden="true" />
      </span>
    </span>
  )
}

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative scroll-mt-28 overflow-hidden border-y border-line bg-canvas-soft py-24"
      aria-labelledby="how-heading"
    >
      <div className="pointer-events-none absolute inset-0 bg-aurora opacity-50" aria-hidden="true" />

      <div className="section-shell relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h6 className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-500">
            How it works
          </h6>
          <h2
            id="how-heading"
            className="mt-3 font-display text-3xl font-bold leading-[1.15] tracking-[-0.025em] text-ink sm:text-4xl"
          >
            From empty inbox to live AI receptionist in four steps
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted">
            No technician, no new hardware, no integrator. One person can finish setup before lunch.
          </p>
        </Reveal>

        <div className="relative mt-20 hidden lg:block">
          <div
            className="pointer-events-none absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 rounded-full"
            style={{
              backgroundImage:
                'linear-gradient(to right, transparent, rgba(38,207,166,.6) 8%, rgba(38,207,166,.6) 92%, transparent)',
            }}
            aria-hidden="true"
          />
          <div className="relative grid grid-cols-4">
            {steps.map((step, i) => {
              const cardOnBottom = i % 2 === 0
              return (
                <Reveal key={step.number} delay={i * 0.09} className="flex flex-col items-center px-3">
                  <div className="flex h-[13.5rem] w-full flex-col items-center justify-end">
                    {cardOnBottom ? (
                      <>
                        <StepIcon step={step} index={i} />
                        <span className="mt-3 h-8 w-px border-l border-dashed border-primary-400/50" />
                      </>
                    ) : (
                      <StepCard step={step} />
                    )}
                  </div>
                  <span className="relative z-10 inline-flex items-center gap-2 rounded-full border border-primary-400/40 bg-surface px-4 py-2 shadow-lg shadow-black/10">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-400" />
                    <span className="font-display text-xs font-bold tracking-wide text-ink">
                      Step {i + 1}
                    </span>
                  </span>
                  <div className="flex h-[13.5rem] w-full flex-col items-center justify-start">
                    <span className="mb-3 h-8 w-px border-l border-dashed border-primary-400/50" />
                    {cardOnBottom ? <StepCard step={step} /> : <StepIcon step={step} index={i} />}
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>

        <ol className="relative mt-14 space-y-5 lg:hidden">
          {steps.map((step, i) => (
            <Reveal as="li" key={step.number} delay={i * 0.08} className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary-400/40 bg-surface font-display text-xxs font-bold text-primary-500">
                {i + 1}
              </span>
              <div className="flex-1">
                <StepCard step={step} />
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
