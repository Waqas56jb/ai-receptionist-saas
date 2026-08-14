import { Check, ArrowRight, Building2 } from 'lucide-react'
import Reveal from '../ui/Reveal'
import Button from '../ui/Button'
import ChatPanel from '../ui/ChatPanel'
import { solutionFeatures } from '../../data/landing'

const conversation = [
  { from: 'customer', label: 'Customer', text: 'Do you have a room available tonight?' },
  {
    from: 'ai',
    label: 'AI Receptionist',
    text: 'Yes, we currently have a Deluxe King Room available. Would you like me to help you with the booking?',
  },
  { from: 'customer', label: 'Customer', text: 'Is breakfast included?' },
  {
    from: 'ai',
    label: 'AI Receptionist',
    text: 'Breakfast is included with every Deluxe room and is served from 7:00 to 10:30 AM.',
  },
]

export default function SolutionSection() {
  return (
    <section
      id="product"
      className="section-y overflow-hidden scroll-mt-24"
      aria-labelledby="solution-heading"
    >
      <div className="container-page">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-16">
          {/* Explanation */}
          <div>
            <Reveal>
              <span className="eyebrow">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500" aria-hidden="true" />
                The Solution
              </span>
            </Reveal>

            <Reveal delay={0.06}>
              <h2
                id="solution-heading"
                className="mt-5 text-[2rem] font-bold leading-[1.12] tracking-tight text-ink-900 sm:text-[2.5rem] lg:text-[2.85rem]"
              >
                Meet your AI receptionist.
              </h2>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-5 text-pretty text-base leading-relaxed text-slate-600 sm:text-lg">
                It picks up the phone, replies to messages and answers questions using your own
                business information — the same way a well-trained front-desk employee would.
              </p>
            </Reveal>

            <ul className="mt-8 grid grid-cols-1 gap-x-6 gap-y-3.5 sm:grid-cols-2">
              {solutionFeatures.map((feature, i) => (
                <Reveal as="li" key={feature} delay={0.05 + i * 0.04} y={12}>
                  <span className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600">
                      <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                    </span>
                    <span className="text-[0.925rem] leading-relaxed text-slate-700">{feature}</span>
                  </span>
                </Reveal>
              ))}
            </ul>

            <Reveal delay={0.2}>
              <div className="mt-9">
                <Button as="a" href="#how-it-works" variant="primary" size="lg">
                  See how it works
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </Reveal>
          </div>

          {/* Conversation mockup */}
          <Reveal delay={0.1} className="relative">
            <div
              className="pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-brand-100/60 via-slate-100/40 to-transparent blur-2xl"
              aria-hidden="true"
            />
            <ChatPanel
              title="Harbour View Hotel"
              channel="Phone call · Answered by AI"
              status="Live"
              messages={conversation}
              footer={
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
                    <Building2 className="h-3.5 w-3.5 text-brand-500" aria-hidden="true" />
                    Answered from this business's knowledge base
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-[0.7rem] font-semibold text-brand-700">
                    Lead captured
                  </span>
                </div>
              }
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
