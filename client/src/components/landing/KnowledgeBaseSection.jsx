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
import SectionHeading from '../ui/SectionHeading'
import Reveal from '../ui/Reveal'
import { knowledgeItems } from '../../data/landing'

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
      id="knowledge"
      className="relative scroll-mt-24 overflow-hidden border-y border-line bg-canvas-soft py-24"
      aria-labelledby="knowledge-heading"
    >
      <div className="pointer-events-none absolute inset-0 bg-aurora opacity-40" aria-hidden="true" />
      <div className="section-shell relative">
        <SectionHeading
          id="knowledge-heading"
          eyebrow="Knowledge Base"
          title="Teach the AI everything about your business."
          description="Upload your documents and fill in your details once. Every business gets its own private knowledge base, so the AI answers with your prices, your policies and your services."
        />

        <div className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-8">
          <Reveal>
            <div className="h-full overflow-hidden rounded-2xl border border-line bg-surface">
              <div className="flex items-center justify-between border-b border-line px-5 py-4">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-500/20">
                    <Database className="h-4 w-4 text-primary-400" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-display text-sm font-semibold text-ink">Knowledge Base</p>
                    <p className="text-xs text-muted">Harbour View Hotel</p>
                  </div>
                </div>
                <span className="rounded-full border border-line bg-surface-2 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-muted">
                  4 sources
                </span>
              </div>

              <ul className="divide-y divide-line">
                {documents.map((doc, i) => (
                  <motion.li
                    key={doc.name}
                    initial={{ opacity: 0, x: reduceMotion ? 0 : -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ duration: 0.45, delay: reduceMotion ? 0 : i * 0.09 }}
                    className="flex items-center gap-3 px-5 py-3.5"
                  >
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-surface-2">
                      <FileText className="h-4 w-4 text-muted" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[0.85rem] font-medium text-ink">{doc.name}</p>
                      <p className="text-xs text-subtle">{doc.size}</p>
                    </div>
                    {doc.status === 'indexed' ? (
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-ember-400/30 bg-ember-500/10 px-2.5 py-1 text-[0.65rem] font-semibold text-ember-400">
                        <CheckCircle2 className="h-3 w-3" aria-hidden="true" />
                        Indexed
                      </span>
                    ) : (
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-primary-400/25 bg-primary-400/10 px-2.5 py-1 text-[0.65rem] font-semibold text-primary-400">
                        <Loader2 className={`h-3 w-3 ${reduceMotion ? '' : 'animate-spin'}`} aria-hidden="true" />
                        Processing
                      </span>
                    )}
                  </motion.li>
                ))}
              </ul>

              <div className="px-5 pb-5 pt-4">
                <div className="flex items-center justify-center gap-2.5 rounded-xl border border-dashed border-line bg-canvas/40 px-4 py-5 text-center">
                  <UploadCloud className="h-4 w-4 text-primary-400" aria-hidden="true" />
                  <p className="text-[0.8rem] text-muted">Drop PDFs and documents here to train your AI</p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="h-full rounded-2xl border border-line bg-surface p-6 sm:p-7">
              <h3 className="font-display text-lg font-semibold text-ink">What your AI receptionist learns</h3>
              <p className="mt-2 text-[0.9rem] leading-relaxed text-muted">
                The same platform adapts to any sector — a bank teaches it products and branch hours,
                a hospital teaches it departments and visiting rules, a hotel teaches it rooms and amenities.
              </p>

              <ul className="mt-6 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                {knowledgeItems.map((item, i) => (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.4, delay: reduceMotion ? 0 : i * 0.05 }}
                    className="flex items-center gap-2 rounded-xl border border-line bg-surface-2/50 px-3 py-2.5 transition-colors duration-300 hover:border-primary-400/40 hover:bg-primary-500/10"
                  >
                    <item.icon className="h-3.5 w-3.5 shrink-0 text-primary-400" aria-hidden="true" />
                    <span className="truncate text-[0.78rem] font-medium text-ink">{item.label}</span>
                  </motion.li>
                ))}
              </ul>

              <div className="mt-6 rounded-xl border border-primary-400/20 bg-primary-500/10 p-4">
                <p className="text-[0.85rem] leading-relaxed text-muted">
                  <span className="font-semibold text-ink">Ask anything:</span> &ldquo;What time is
                  check-out and do you allow late check-out?&rdquo; — answered from your own policy
                  document, word for word.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-14">
          <ul className="grid grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-[repeat(4,minmax(0,1fr))] lg:items-stretch">
            {flow.map((node, i) => (
              <Reveal as="li" key={node.label} delay={i * 0.09} className="relative">
                <div className="flex h-full items-start gap-3.5 rounded-2xl border border-line bg-surface p-5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-500/15 text-primary-400">
                    <node.icon className="h-[1.15rem] w-[1.15rem]" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[0.9rem] font-semibold text-ink">{node.label}</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted">{node.caption}</p>
                  </div>
                </div>
                {i < flow.length - 1 && (
                  <>
                    <ArrowRight
                      className="absolute -right-3 top-1/2 hidden h-5 w-5 -translate-y-1/2 text-primary-400/60 lg:block"
                      aria-hidden="true"
                    />
                    <ArrowDown className="mx-auto my-1 h-4 w-4 text-primary-400/50 lg:hidden" aria-hidden="true" />
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
