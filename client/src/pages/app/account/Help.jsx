import { useMemo, useState } from 'react'
import { BookOpen, ChevronDown, LifeBuoy, Mail, MessageCircle, Search, Send } from 'lucide-react'
import cn from '../../../lib/cn'
import PageHeader from '../../../components/layout/PageHeader'
import { Card, CardBody, CardHeader } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import Modal from '../../../components/ui/Modal'
import { Input, Select, Textarea } from '../../../components/ui/Field'
import { EmptyState } from '../../../components/ui/States'
import useAsync from '../../../hooks/useAsync'
import { useToast } from '../../../context/ToastContext'
import helpService from '../../../services/helpService'

export default function Help() {
  const toast = useToast()
  const articles = useAsync(() => helpService.getArticles(), [])
  const faqs = useAsync(() => helpService.getFaqs(), [])
  const support = useAsync(() => helpService.getSupportChannels(), [])

  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(null)
  const [reporting, setReporting] = useState(false)
  const [issue, setIssue] = useState({ area: 'AI training', subject: '', details: '' })
  const [sending, setSending] = useState(false)

  const filteredArticles = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return articles.data || []
    return (articles.data || []).filter(
      (a) => a.title.toLowerCase().includes(q) || a.description.toLowerCase().includes(q) || a.category.toLowerCase().includes(q),
    )
  }, [articles.data, query])

  const filteredFaqs = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return faqs.data || []
    return (faqs.data || []).filter((f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q))
  }, [faqs.data, query])

  const submit = async () => {
    if (!issue.subject.trim()) return
    setSending(true)
    try {
      const res = await helpService.submitIssue(issue)
      setReporting(false)
      setIssue({ area: 'AI training', subject: '', details: '' })
      toast.success(`Issue reported — reference ${res.reference}.`)
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Help & Support"
        description="Guides, answers and a way to reach a human when you need one."
        actions={
          <Button as="button" size="sm" onClick={() => setReporting(true)}>
            <LifeBuoy className="h-3.5 w-3.5" aria-hidden="true" />
            Report an issue
          </Button>
        }
      />

      <div className="mb-5 max-w-lg">
        <Input
          icon={Search}
          type="search"
          placeholder="Search help articles and FAQs…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search help"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <Card>
            <CardHeader icon={BookOpen} title="Documentation" description="Step-by-step guides for every part of the portal." />
            <CardBody>
              {!filteredArticles.length ? (
                <EmptyState
                  compact
                  icon={Search}
                  title={query ? 'No articles match' : 'No documentation yet'}
                  description={query ? 'Try a different word or browse the FAQs.' : 'Help articles will appear here when they are published.'}
                />
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {filteredArticles.map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => toast.info('Full documentation opens once the help site is live.')}
                      className="group rounded-xl border border-slate-200 bg-white p-4 text-left transition-all hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card"
                    >
                      <Badge tone="neutral" size="sm">
                        {a.category}
                      </Badge>
                      <p className="mt-2.5 text-[0.88rem] font-semibold text-ink-900">{a.title}</p>
                      <p className="mt-1 text-[0.8rem] leading-relaxed text-slate-500">{a.description}</p>
                      <p className="mt-2.5 text-[0.72rem] text-slate-400">{a.minutes} min read</p>
                    </button>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader icon={MessageCircle} title="Frequently asked questions" />
            <CardBody className="space-y-2">
              {!filteredFaqs.length ? (
                <EmptyState
                  compact
                  icon={Search}
                  title={query ? 'No answers match' : 'No FAQs yet'}
                  description={query ? 'Try a different search or contact support.' : 'Answers will appear here as they are added.'}
                />
              ) : (
                filteredFaqs.map((f) => (
                  <div key={f.id} className="rounded-xl border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setOpen(open === f.id ? null : f.id)}
                      aria-expanded={open === f.id}
                      className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
                    >
                      <span className="text-[0.85rem] font-semibold text-ink-900">{f.q}</span>
                      <ChevronDown className={cn('h-4 w-4 shrink-0 text-slate-400 transition-transform', open === f.id && 'rotate-180')} aria-hidden="true" />
                    </button>
                    {open === f.id && (
                      <p className="border-t border-slate-100 px-4 py-3.5 text-[0.83rem] leading-relaxed text-slate-600">{f.a}</p>
                    )}
                  </div>
                ))
              )}
            </CardBody>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader icon={Mail} title="Contact support" />
            <CardBody className="space-y-3">
              {(support.data || []).map((s) => (
                <div key={s.id} className="rounded-xl border border-slate-200 p-4">
                  <p className="text-[0.85rem] font-semibold text-ink-900">{s.title}</p>
                  <p className="mt-1 text-[0.8rem] leading-relaxed text-slate-500">{s.description}</p>
                  <Button
                    as="button"
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    onClick={() => (s.id === 's3' ? setReporting(true) : toast.info('Support channels open once the backend is connected.'))}
                  >
                    {s.action}
                  </Button>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="System status" />
            <CardBody>
              <ul className="space-y-2.5">
                {['Voice', 'WhatsApp', 'Instagram', 'Dashboard'].map((system) => (
                  <li key={system} className="flex items-center justify-between gap-3">
                    <span className="text-[0.83rem] text-slate-600">{system}</span>
                    <Badge tone="success" size="sm" dot>
                      Operational
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>
      </div>

      <Modal
        open={reporting}
        onClose={() => setReporting(false)}
        title="Report an issue"
        description="Tell us what happened and we will look into it."
        footer={
          <>
            <Button as="button" variant="ghost" size="sm" onClick={() => setReporting(false)}>
              Cancel
            </Button>
            <Button as="button" size="sm" loading={sending} onClick={submit}>
              <Send className="h-3.5 w-3.5" aria-hidden="true" />
              Send report
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Select
            label="Area"
            options={['AI training', 'Voice', 'WhatsApp', 'Instagram', 'Conversations', 'Billing', 'Something else']}
            value={issue.area}
            onChange={(e) => setIssue((i) => ({ ...i, area: e.target.value }))}
          />
          <Input label="Subject" value={issue.subject} onChange={(e) => setIssue((i) => ({ ...i, subject: e.target.value }))} required />
          <Textarea
            label="What happened?"
            rows={5}
            value={issue.details}
            onChange={(e) => setIssue((i) => ({ ...i, details: e.target.value }))}
            help="Include what you expected and what happened instead."
          />
        </div>
      </Modal>
    </>
  )
}
