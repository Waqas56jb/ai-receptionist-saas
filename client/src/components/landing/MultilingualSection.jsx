import { useState } from 'react'
import { Globe, Languages, ArrowLeftRight } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import ChatPanel from '../ui/ChatPanel'

const conversations = [
  {
    code: 'fr',
    language: 'French',
    native: 'Français',
    detected: 'French detected automatically',
    messages: [
      { from: 'customer', label: 'Customer', text: 'Bonjour, avez-vous une chambre disponible ?' },
      {
        from: 'ai',
        label: 'AI Receptionist',
        text: 'Oui, nous avons une chambre Deluxe disponible ce soir à 180 $. Souhaitez-vous que je la réserve pour vous ?',
      },
    ],
  },
  {
    code: 'es',
    language: 'Spanish',
    native: 'Español',
    detected: 'Spanish detected automatically',
    messages: [
      { from: 'customer', label: 'Customer', text: '¿A qué hora abren mañana?' },
      {
        from: 'ai',
        label: 'AI Receptionist',
        text: 'Abrimos a las 8:00 y la recepción está disponible las 24 horas. ¿Desea reservar una mesa para el desayuno?',
      },
    ],
  },
  {
    code: 'de',
    language: 'German',
    native: 'Deutsch',
    detected: 'German detected automatically',
    messages: [
      { from: 'customer', label: 'Customer', text: 'Ist das Frühstück im Preis inbegriffen?' },
      {
        from: 'ai',
        label: 'AI Receptionist',
        text: 'Ja, das Frühstück ist inbegriffen und wird von 7:00 bis 10:30 Uhr serviert. Soll ich einen Tisch reservieren?',
      },
    ],
  },
]

export default function MultilingualSection() {
  const [active, setActive] = useState(0)
  const current = conversations[active]

  return (
    <section
      className="dark-section section-y relative overflow-hidden bg-ink-950"
      aria-labelledby="multilingual-heading"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-grid-dark [background-size:64px_64px] opacity-40" />
        <div className="absolute left-1/2 top-0 h-[28rem] w-[36rem] -translate-x-1/2 rounded-full bg-brand-600/20 blur-[130px]" />
      </div>

      <div className="container-page relative">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading
              id="multilingual-heading"
              eyebrow="Multilingual AI"
              title="Speak your customer's language."
              description="The AI recognises the language a customer writes or speaks in and replies naturally in the same language — without you configuring anything in advance."
              tone="dark"
              align="left"
            />

            <Reveal delay={0.18}>
              <div className="mt-9 flex flex-wrap gap-2.5" role="group" aria-label="Choose an example language">
                {conversations.map((conversation, i) => (
                  <button
                    key={conversation.code}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-pressed={active === i}
                    className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                      active === i
                        ? 'border-brand-400/40 bg-brand-500/15 text-white'
                        : 'border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <Languages className="h-4 w-4 text-brand-300" aria-hidden="true" />
                    {conversation.native}
                  </button>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-8 flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <ArrowLeftRight className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" aria-hidden="true" />
                <p className="text-[0.875rem] leading-relaxed text-slate-300">
                  A guest can start a conversation in one language and switch mid-sentence — the AI
                  follows, and your team still reads a translated transcript in the dashboard.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <ChatPanel
              key={current.code}
              tone="dark"
              title="Harbour View Hotel"
              channel={`WhatsApp · ${current.detected}`}
              status="Live"
              messages={current.messages}
              footer={
                <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-400">
                  <Globe className="h-3.5 w-3.5 text-brand-300" aria-hidden="true" />
                  Replying in {current.language} · Transcript available in English
                </span>
              }
            />
          </Reveal>
        </div>
      </div>
    </section>
  )
}
