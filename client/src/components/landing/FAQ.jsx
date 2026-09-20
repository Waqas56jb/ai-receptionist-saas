import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import Reveal from '../ui/Reveal'
import { faqs } from '../../data/landing'
import { brand } from '../../config/brand'

export default function FAQ() {
  const [open, setOpen] = useState(0)

  return (
    <section id="faq" className="scroll-mt-24 border-t border-line py-24" aria-labelledby="faq-heading">
      <div className="section-shell">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Reveal>
              <h6 className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-500">FAQ</h6>
              <h2
                id="faq-heading"
                className="mt-3 font-display text-3xl font-bold leading-[1.15] tracking-[-0.025em] text-ink sm:text-4xl"
              >
                Answers before you commit
              </h2>
              <p className="mt-4 text-muted">
                If something is missing here, ask us directly — every message reaches a person.
              </p>
              <a href={`mailto:${brand.contactEmail}`} className="btn-ghost-surface mt-6 !px-5">
                Talk to us
              </a>
            </Reveal>
          </div>

          <div className="lg:col-span-8">
            <ul className="space-y-3">
              {faqs.map((item, i) => {
                const expanded = open === i
                return (
                  <Reveal as="li" key={item.q} delay={i * 0.04}>
                    <button
                      type="button"
                      onClick={() => setOpen(expanded ? -1 : i)}
                      aria-expanded={expanded}
                      className={`w-full rounded-2xl border p-5 text-left transition duration-300 ${
                        expanded ? 'border-primary-500/40 bg-surface' : 'border-line bg-surface hover:border-line-strong'
                      }`}
                    >
                      <span className="flex items-start justify-between gap-4">
                        <span className="font-display text-base font-semibold text-ink">{item.q}</span>
                        <ChevronDown
                          className={`mt-0.5 h-4 w-4 shrink-0 text-muted transition-transform ${expanded ? 'rotate-180' : ''}`}
                          aria-hidden="true"
                        />
                      </span>
                      {expanded && <p className="mt-3 text-sm leading-relaxed text-muted">{item.a}</p>}
                    </button>
                  </Reveal>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
