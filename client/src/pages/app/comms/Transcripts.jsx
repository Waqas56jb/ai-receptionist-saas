import { useMemo, useState } from 'react'
import { FileText, Phone, Search } from 'lucide-react'
import cn from '../../../lib/cn'
import PageHeader from '../../../components/layout/PageHeader'
import { Card } from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import Avatar from '../../../components/ui/Avatar'
import Button from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Field'
import { EmptyState, ErrorState } from '../../../components/ui/States'
import TranscriptViewer from '../../../components/comms/TranscriptViewer'
import useAsync from '../../../hooks/useAsync'
import conversationService from '../../../services/conversationService'
import { formatDate, formatDuration } from '../../../lib/format'

export default function Transcripts() {
  const transcripts = useAsync(() => conversationService.listTranscripts(), [])
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  const rows = transcripts.data || []

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(
      (t) => t.customer.toLowerCase().includes(q) || t.lines.some((l) => l.text.toLowerCase().includes(q)),
    )
  }, [rows, query])

  const selected = rows.find((t) => t.id === selectedId) || filtered[0] || null

  if (transcripts.error) {
    return (
      <Card>
        <ErrorState onRetry={transcripts.reload} />
      </Card>
    )
  }

  return (
    <>
      <PageHeader
        title="Transcripts"
        description="Word-for-word records of every conversation the AI has handled."
        badge={<Badge tone="brand">{rows.length} transcripts</Badge>}
      />

      {transcripts.loading ? (
        <div className="h-96 animate-pulse rounded-2xl bg-slate-100" />
      ) : rows.length === 0 ? (
        <Card>
          <EmptyState
            icon={FileText}
            title="No transcripts yet"
            description="Transcripts appear automatically once your AI starts handling calls."
            action={
              <Button as="a" href="/app/voice-agent" size="sm">
                Configure Voice
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
            <div className="border-b border-slate-200/80 p-4">
              <Input
                icon={Search}
                type="search"
                placeholder="Search transcripts…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search transcripts"
              />
            </div>

            {!filtered.length ? (
              <EmptyState compact icon={Search} title="No matches" description="Try a different word or name." />
            ) : (
              <ul className="max-h-[40rem] divide-y divide-slate-100 overflow-y-auto">
                {filtered.map((t) => (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(t.id)}
                      className={cn(
                        'flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors',
                        selected?.id === t.id ? 'bg-brand-50/70' : 'hover:bg-slate-50',
                      )}
                    >
                      <Avatar name={t.customer} size="sm" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[0.85rem] font-semibold text-ink-900">{t.customer}</span>
                        <span className="mt-0.5 block truncate text-[0.75rem] text-slate-500">
                          {formatDate(t.at)} · {formatDuration(t.duration)}
                        </span>
                        <span className="mt-1.5 flex items-center gap-1.5">
                          <Badge tone="neutral" size="sm">
                            <Phone className="h-3 w-3" aria-hidden="true" />
                            {t.channel}
                          </Badge>
                          <Badge tone={t.outcome.includes('Booking') ? 'success' : 'brand'} size="sm">
                            {t.outcome}
                          </Badge>
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Card className="p-5 sm:p-6">
            {selected ? (
              <>
                <div className="flex items-center gap-3">
                  <Avatar name={selected.customer} size="md" />
                  <div>
                    <h2 className="font-display text-[1.05rem] font-semibold text-ink-900">{selected.customer}</h2>
                    <p className="text-[0.78rem] text-slate-500">Transcript · {selected.id}</p>
                  </div>
                </div>
                <TranscriptViewer transcript={selected} className="mt-5" />
              </>
            ) : (
              <EmptyState icon={FileText} title="Select a transcript" description="Choose a conversation on the left to read it in full." />
            )}
          </Card>
        </div>
      )}
    </>
  )
}
