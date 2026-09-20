import { ArrowRight } from 'lucide-react'
import Reveal from '../ui/Reveal'
import { channels } from '../../data/landing'

export default function ChannelsSection() {
  return (
    <section id="solutions" className="scroll-mt-24 py-24" aria-labelledby="channels-heading">
      <div className="section-shell">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h6 className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-500">
            Channels
          </h6>
          <h2
            id="channels-heading"
            className="mt-3 font-display text-3xl font-bold leading-[1.15] tracking-[-0.025em] text-ink sm:text-4xl"
          >
            It runs on the numbers and pages you already own
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted">
            Any phone line, WhatsApp number, Instagram account or website becomes a managed
            receptionist — nothing new for customers to install.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {channels.map((channel, i) => (
            <Reveal key={channel.title} delay={i * 0.08}>
              <article className="group relative overflow-hidden rounded-2xl border border-line bg-surface p-7 transition duration-300 hover:-translate-y-1 hover:border-line-strong">
                <p className="text-xxs font-semibold uppercase tracking-[0.18em] text-subtle">
                  {channel.kicker}
                </p>
                <div className="mt-4 flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-ink text-canvas">
                    <channel.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold tracking-tight text-ink">
                      {channel.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{channel.description}</p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {channel.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-line bg-surface-2/50 px-2 py-0.5 text-xxs text-muted"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.12}>
          <p className="mt-10 text-center text-sm text-muted">
            If a customer can call or message you, the AI can answer.{' '}
            <a href="#how-it-works" className="inline-flex items-center gap-1 font-semibold text-primary-500">
              See the setup
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
