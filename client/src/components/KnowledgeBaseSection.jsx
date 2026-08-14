import {
  Database,
  FileText,
  UploadCloud,
  CheckCircle2,
  Loader2,
  Brain,
  MessageSquare,
  Building2,
  ArrowRight,
  ArrowDown,
} from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import SectionHeading from './ui/SectionHeading'
import Reveal from './ui/Reveal'
import { knowledgeItems } from '../data/landing'

const documents = [
  { name: 'room-rates-2026.pdf', size: '412 KB', status: 'indexed' },
  { name: 'guest-policies.pdf', size: '188 KB', status: 'indexed' },
  { name: 'faq-common-questions.docx', size: '96 KB', status: 'indexed' },
  { name: 'restaurant-menu.pdf', size: '640 KB', status: 'processing' },
]

const flow = [
  { icon: Building2, label: 'Business Information', caption: 'Services, prices, hours, documents' },
  { icon: Database, label: 'Knowledge Base', caption: 'Structured and searchable' },
  { icon: Brain, label: 'AI Receptionist', caption: 'Understands your business' },
  { icon: MessageSquare, label: 'Customer Conversation', caption: 'Accurate, instant answers' },
]

export default function KnowledgeBaseSection() {
  const reduceMotion = useReducedMotion()

  return (
    <section
      className="dark-section section-y relative overflow-hidden bg-ink-900"
      aria-labelledby="knowledge-heading"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-grid-dark [background-size:64px_64px] opacity-50" />
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-brand-600/20 blur-[120px]" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-brand-500/15 blur-[120px]" />
      </div>

      <div className="container-page relative">
        <SectionHeading
          id="knowledge-heading"
          eyebrow="Knowledge Base"
          title="Teach the AI everything about your business."
          description="Upload your documents and fill in your business details once. Every business on the platform gets its own private knowledge base, so the AI answers with your prices, your policies and your services — never generic information."
          tone="dark"
        />

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-8">
          {/* Document manager mockup */}
          <Reveal>
            <div className="h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur sm:rounded-[1.5rem]">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-500/20">
                    <Database className="h-4 w-4 text-brand-300" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-display text-sm font-semibold text-white">Knowledge Base</p>
                    <p className="text-xs text-slate-400">Harbour View Hotel</p>
                  </div>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-slate-300">
                  4 sources
                </span>
              </div>

              <ul className="divide-y divide-white/[0.06]">
                {documents.map((doc, i) => (
                  <motion.li
                    key={doc.name}
                    initial={{ opacity: 0, x: reduceMotion ? 0 : -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.45, delay: reduceMotion ? 0 : i * 0.09 }}
                    className="flex items-center gap-3 px-5 py-3.5"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/[0.06]">
                      <FileText className="h-4 w-4 text-slate-300" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[0.85rem] font-medium text-white">{doc.name}</p>
                      <p className="text-xs text-slate-500">{doc.size}</p>
                    </div>
                    {doc.status === 'indexed' ? (
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[0.65rem] font-semibold text-emerald-300">
                        <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                        Indexed
                      </span>
                    ) : (
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-brand-400/25 bg-brand-400/10 px-2.5 py-1 text-[0.65rem] font-semibold text-brand-200">
                        <Loader2
                          className={`h-3 w-3 ${reduceMotion ? '' : 'animate-spin'}`}
                          aria-hidden="true"
                        />
                        Processing
                      </span>
                    )}
                  </motion.li>
                ))}
              </ul>

              <div className="px-5 pb-5 pt-4">
                <div className="flex items-center justify-center gap-2.5 rounded-xl border border-dashed border-white/15 bg-white/[0.02] px-4 py-5 text-center">
                  <UploadCloud className="h-4 w-4 text-brand-300" aria-hidden="true" />
                  <p className="text-[0.8rem] text-slate-400">
                    Drop PDFs and documents here to train your AI
                  </p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* What the AI learns */}
          <Reveal delay={0.1}>
            <div className="h-full rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:rounded-[1.5rem] sm:p-7">
              <h3 className="font-display text-lg font-semibold text-white">
                What your AI receptionist learns
              </h3>
              <p className="mt-2 text-[0.9rem] leading-relaxed text-slate-400">
                The same platform adapts to any sector — a hotel teaches it rooms and amenities, a
                clinic teaches it treatments and appointment rules.
              </p>

              <ul className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                {knowledgeItems.map((item, i) => (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.4, delay: reduceMotion ? 0 : i * 0.05 }}
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 transition-colors duration-300 hover:border-brand-400/30 hover:bg-brand-500/10"
                  >
                    <item.icon className="h-3.5 w-3.5 shrink-0 text-brand-300" aria-hidden="true" />
                    <span className="truncate text-[0.78rem] font-medium text-slate-200">
                      {item.label}
                    </span>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-6 rounded-xl border border-brand-400/20 bg-brand-500/10 p-4">
                <p className="text-[0.85rem] leading-relaxed text-brand-100">
                  <span className="font-semibold text-white">Ask anything:</span> "What time is
                  check-out and do you allow late check-out?" — answered from your own policy
                  document, word for word.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Flow diagram */}
        <div className="mt-14">
          <ul className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-[repeat(4,minmax(0,1fr))] lg:items-stretch">
            {flow.map((node, i) => (
              <Reveal as="li" key={node.label} delay={i * 0.09} className="relative">
                <div className="flex h-full items-start gap-3.5 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-500/15 text-brand-300">
                    <node.icon className="h-[1.15rem] w-[1.15rem]" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[0.9rem] font-semibold text-white">{node.label}</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">{node.caption}</p>
                  </div>
                </div>

                {i < flow.length - 1 && (
                  <>
                    <ArrowRight
                      className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-brand-400/60 lg:block"
                      aria-hidden="true"
                    />
                    <ArrowDown
                      className="mx-auto my-1 h-4 w-4 text-brand-400/50 lg:hidden"
                      aria-hidden="true"
                    />
                  </>
                )}
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
