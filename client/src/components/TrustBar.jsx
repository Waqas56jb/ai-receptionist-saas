import Reveal from './ui/Reveal'
import { capabilityChannels } from '../data/landing'

export default function TrustBar() {
  return (
    <section className="border-y border-slate-200/70 bg-white/60 py-12 sm:py-14" aria-label="Supported channels">
      <div className="container-page">
        <Reveal>
          <p className="text-center font-display text-base font-semibold text-ink-900 sm:text-lg">
            Built for businesses that never want to miss a customer.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {capabilityChannels.map((channel) => (
              <li key={channel.label}>
                <span className="inline-flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-subtle transition-colors duration-300 hover:border-brand-200 hover:text-ink-900">
                  <channel.icon className="h-[1.1rem] w-[1.1rem] text-brand-500" aria-hidden="true" />
                  {channel.label}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="mt-6 text-center text-sm text-slate-500">
            Customers reach you the way they always have — no app to install, nothing new to learn.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
