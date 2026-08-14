import { Users, Radio, Brain, Building2, ArrowRight, ArrowDown } from 'lucide-react'
import SectionHeading from './ui/SectionHeading'
import Reveal from './ui/Reveal'
import { channels } from '../data/landing'

const flow = [
  { icon: Users, label: 'Customer' },
  { icon: Radio, label: 'Channel' },
  { icon: Brain, label: 'AI Receptionist' },
  { icon: Building2, label: 'Business' },
]

export default function ChannelsSection() {
  return (
    <section id="solutions" className="section-y scroll-mt-24" aria-labelledby="channels-heading">
      <div className="container-page">
        <SectionHeading
          id="channels-heading"
          eyebrow="Channels"
          title="One AI. Every customer channel."
          description="Your customers keep using the channels they already prefer. Every conversation lands in one place, handled by the same AI that knows your business."
        />

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((channel, i) => (
            <Reveal key={channel.title} delay={i * 0.08}>
              <article className="group relative h-full overflow-hidden card-surface p-6 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card">
                <div
                  className={`pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${channel.accent} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                  aria-hidden="true"
                />
                <div className="relative">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink-900 text-white">
                    <channel.icon className="h-[1.3rem] w-[1.3rem]" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-ink-900">{channel.title}</h3>
                  <p className="mt-2.5 text-[0.925rem] leading-relaxed text-slate-600">
                    {channel.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Conversation flow */}
        <Reveal delay={0.15}>
          <div className="mt-12 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-6 sm:rounded-[1.5rem] sm:p-8">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              How a conversation travels
            </p>
            <ul className="mt-7 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-3">
              {flow.map((node, i) => (
                <li key={node.label} className="flex flex-col items-center gap-2 sm:flex-row sm:gap-3">
                  <span className="inline-flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-subtle">
                    <node.icon className="h-4 w-4 text-brand-600" aria-hidden="true" />
                    <span className="text-sm font-semibold text-ink-900">{node.label}</span>
                  </span>
                  {i < flow.length - 1 && (
                    <>
                      <ArrowRight className="hidden h-4 w-4 text-slate-400 sm:block" aria-hidden="true" />
                      <ArrowDown className="h-4 w-4 text-slate-400 sm:hidden" aria-hidden="true" />
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
