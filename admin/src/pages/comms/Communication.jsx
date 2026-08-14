import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bot, FileText, MessagesSquare, Phone, PlayCircle, Send, UserCheck } from 'lucide-react'
import { channelLabel, cn, exportCsv, formatDate, formatDateTime, formatDuration, formatTime } from '../../lib/utils'
import PageHeader from '../../components/layout/PageHeader'
import { Card, CardBody } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge, { StatusBadge } from '../../components/ui/Badge'
import DataTable from '../../components/ui/DataTable'
import FilterBar from '../../components/ui/FilterBar'
import Modal from '../../components/ui/Modal'
import { EmptyState, ErrorState } from '../../components/ui/States'
import { Avatar } from '../../components/ui/Misc'
import { Input } from '../../components/ui/Field'
import { useAsync, useTable } from '../../hooks'
import { useToast } from '../../context/ToastContext'
import { conversationService } from '../../services/aiService'
import businessService from '../../services/businessService'

/* --------------------------------------------------------- Conversations --- */

export function Conversations() {
  const conversations = useAsync(() => conversationService.listConversations(), [])
  const businesses = useAsync(() => businessService.list(), [])

  const table = useTable(conversations.data || [], {
    pageSize: 10,
    initialSort: { key: 'at', direction: 'desc' },
    searchFields: ['business', 'customer', 'lastMessage'],
  })

  const columns = [
    {
      key: 'business',
      header: 'Business',
      sortable: true,
      primary: true,
      render: (row) => (
        <Link to={`/businesses/${row.businessId}`} onClick={(e) => e.stopPropagation()} className="font-semibold text-ink-900 hover:text-brand-600">
          {row.business}
        </Link>
      ),
    },
    {
      key: 'customer',
      header: 'Customer',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.customer} size="xs" tone="muted" />
          <span className="truncate">{row.customer}</span>
        </div>
      ),
    },
    { key: 'channel', header: 'Channel', sortable: true, render: (row) => <Badge tone="neutral" size="sm">{channelLabel(row.channel)}</Badge> },
    { key: 'handledBy', header: 'AI / Human', sortable: true, render: (row) => <Badge tone={row.handledBy === 'AI' ? 'brand' : 'info'} size="sm">{row.handledBy === 'AI' ? <Bot className="h-3 w-3" aria-hidden="true" /> : <UserCheck className="h-3 w-3" aria-hidden="true" />}{row.handledBy}</Badge> },
    { key: 'lastMessage', header: 'Last message', hideOnMobile: true, render: (row) => <p className="line-clamp-1 max-w-xs text-slate-600">{row.lastMessage}</p> },
    { key: 'status', header: 'Status', sortable: true, render: (row) => <StatusBadge status={row.status} /> },
    { key: 'outcome', header: 'Outcome', sortable: true, hideOnMobile: true },
    { key: 'at', header: 'Date', sortable: true, render: (row) => formatDateTime(row.at) },
  ]

  return (
    <>
      <PageHeader title="Conversations" description="Every conversation across every business and channel." badge={conversations.data && <Badge tone="brand">{conversations.data.length} total</Badge>} />

      <FilterBar
        table={table}
        searchPlaceholder="Search business, customer or message…"
        filters={[
          { key: 'business', label: 'Businesses', options: (businesses.data || []).map((b) => b.name) },
          { key: 'channel', label: 'Channels', options: ['voice', 'whatsapp', 'instagram', 'web'] },
          { key: 'status', label: 'Statuses', options: ['Open', 'Resolved', 'Escalated'] },
          { key: 'handledBy', label: 'Handled by', options: ['AI', 'Human'] },
        ]}
        onExport={() =>
          exportCsv('conversations.csv', table.filteredRows, [
            { header: 'Business', value: (r) => r.business },
            { header: 'Customer', value: (r) => r.customer },
            { header: 'Channel', value: (r) => r.channel },
            { header: 'Status', value: (r) => r.status },
            { header: 'Outcome', value: (r) => r.outcome },
            { header: 'Date', value: (r) => formatDateTime(r.at) },
          ])
        }
      />

      <DataTable
        columns={columns}
        table={table}
        loading={conversations.loading}
        error={conversations.error}
        onRetry={conversations.reload}
        empty={<EmptyState icon={MessagesSquare} title="No conversations found" description="Nothing matches the current filters." />}
      />
    </>
  )
}

/* ------------------------------------------------------------------ Calls --- */

export function Calls() {
  const toast = useToast()
  const calls = useAsync(() => conversationService.listCalls(), [])
  const transcripts = useAsync(() => conversationService.listTranscripts(), [])
  const businesses = useAsync(() => businessService.list(), [])
  const [viewing, setViewing] = useState(null)

  const table = useTable(calls.data || [], {
    pageSize: 10,
    initialSort: { key: 'at', direction: 'desc' },
    searchFields: ['business', 'customer', 'phone'],
  })

  const columns = [
    {
      key: 'business',
      header: 'Business',
      sortable: true,
      primary: true,
      render: (row) => (
        <Link to={`/businesses/${row.businessId}`} onClick={(e) => e.stopPropagation()} className="font-semibold text-ink-900 hover:text-brand-600">
          {row.business}
        </Link>
      ),
    },
    { key: 'customer', header: 'Customer', sortable: true, render: (row) => <span className="truncate">{row.customer}</span> },
    { key: 'phone', header: 'Phone', hideOnMobile: true },
    { key: 'duration', header: 'Duration', sortable: true, render: (row) => formatDuration(row.duration) },
    {
      key: 'aiHandled',
      header: 'Handling',
      render: (row) =>
        row.transferred ? <Badge tone="info" size="sm">Transferred</Badge> : row.aiHandled ? <Badge tone="brand" size="sm">AI handled</Badge> : <Badge tone="neutral" size="sm">Not answered</Badge>,
    },
    { key: 'status', header: 'Status', sortable: true, render: (row) => <StatusBadge status={row.status} /> },
    { key: 'at', header: 'Date', sortable: true, render: (row) => formatDateTime(row.at) },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            disabled={!row.recording}
            onClick={() => toast.info('Recording playback requires the backend media service.')}
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-ink-900 disabled:opacity-30"
            aria-label={`Play recording for ${row.customer}`}
          >
            <PlayCircle className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={!row.transcriptId}
            onClick={() => setViewing((transcripts.data || []).find((t) => t.id === row.transcriptId))}
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-ink-900 disabled:opacity-30"
            aria-label={`View transcript for ${row.customer}`}
          >
            <FileText className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <>
      <PageHeader title="Calls" description="Every call handled by the platform." badge={calls.data && <Badge tone="brand">{calls.data.length} calls</Badge>} />

      <FilterBar
        table={table}
        searchPlaceholder="Search business, customer or number…"
        filters={[
          { key: 'business', label: 'Businesses', options: (businesses.data || []).map((b) => b.name) },
          { key: 'status', label: 'Statuses', options: ['Completed', 'Missed', 'Voicemail'] },
        ]}
        onExport={() =>
          exportCsv('calls.csv', table.filteredRows, [
            { header: 'Business', value: (r) => r.business },
            { header: 'Customer', value: (r) => r.customer },
            { header: 'Phone', value: (r) => r.phone },
            { header: 'Duration', value: (r) => r.duration },
            { header: 'Status', value: (r) => r.status },
            { header: 'Date', value: (r) => formatDateTime(r.at) },
          ])
        }
      />

      <DataTable
        columns={columns}
        table={table}
        loading={calls.loading}
        error={calls.error}
        onRetry={calls.reload}
        empty={<EmptyState icon={Phone} title="No calls found" description="Nothing matches the current filters." />}
      />

      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} title={`Call with ${viewing?.customer}`} description={viewing?.business} size="lg">
        {viewing && <TranscriptBody transcript={viewing} />}
      </Modal>
    </>
  )
}

/* --------------------------------------------------------------- Messages --- */

export function Messages() {
  const messages = useAsync(() => conversationService.listMessages(), [])
  const businesses = useAsync(() => businessService.list(), [])

  const table = useTable(messages.data || [], {
    pageSize: 10,
    initialSort: { key: 'at', direction: 'desc' },
    searchFields: ['business', 'customer', 'text'],
  })

  const columns = [
    {
      key: 'business',
      header: 'Business',
      sortable: true,
      primary: true,
      render: (row) => (
        <Link to={`/businesses/${row.businessId}`} onClick={(e) => e.stopPropagation()} className="font-semibold text-ink-900 hover:text-brand-600">
          {row.business}
        </Link>
      ),
    },
    { key: 'customer', header: 'Customer', sortable: true },
    { key: 'channel', header: 'Channel', sortable: true, render: (row) => <Badge tone="neutral" size="sm">{channelLabel(row.channel)}</Badge> },
    { key: 'text', header: 'Message', render: (row) => <p className="line-clamp-2 max-w-xs text-slate-600">{row.text}</p> },
    { key: 'aiResponse', header: 'AI response', hideOnMobile: true, render: (row) => <p className="line-clamp-2 max-w-xs text-slate-500">{row.aiResponse}</p> },
    { key: 'status', header: 'Status', sortable: true, render: (row) => <StatusBadge status={row.status} dot={false} /> },
    { key: 'at', header: 'Date', sortable: true, render: (row) => formatDateTime(row.at) },
  ]

  return (
    <>
      <PageHeader title="Messages" description="Every message the platform has answered." badge={messages.data && <Badge tone="brand">{messages.data.length} messages</Badge>} />

      <FilterBar
        table={table}
        searchPlaceholder="Search business, customer or message…"
        filters={[
          { key: 'business', label: 'Businesses', options: (businesses.data || []).map((b) => b.name) },
          { key: 'channel', label: 'Channels', options: ['whatsapp', 'instagram', 'web'] },
        ]}
        onExport={() =>
          exportCsv('messages.csv', table.filteredRows, [
            { header: 'Business', value: (r) => r.business },
            { header: 'Customer', value: (r) => r.customer },
            { header: 'Channel', value: (r) => r.channel },
            { header: 'Message', value: (r) => r.text },
            { header: 'Date', value: (r) => formatDateTime(r.at) },
          ])
        }
      />

      <DataTable
        columns={columns}
        table={table}
        loading={messages.loading}
        error={messages.error}
        onRetry={messages.reload}
        empty={<EmptyState icon={Send} title="No messages found" description="Nothing matches the current filters." />}
      />
    </>
  )
}

/* ------------------------------------------------------------ Transcripts --- */

function TranscriptBody({ transcript }) {
  const speaker = {
    ai: { label: 'AI receptionist', className: 'bg-brand-50 text-brand-700' },
    customer: { label: 'Customer', className: 'bg-slate-100 text-slate-600' },
    human: { label: 'Team', className: 'bg-ink-900 text-white' },
  }

  return (
    <div>
      <dl className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-4 sm:grid-cols-4">
        {[
          ['Channel', transcript.channel],
          ['Duration', formatDuration(transcript.duration)],
          ['Language', transcript.language],
          ['Outcome', transcript.outcome],
        ].map(([label, value]) => (
          <div key={label}>
            <dt className="text-[0.64rem] font-bold uppercase tracking-wider text-slate-400">{label}</dt>
            <dd className="mt-1 text-[0.8rem] font-semibold capitalize text-ink-900">{value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-3 text-[0.76rem] text-slate-500">{formatDateTime(transcript.at)}</p>

      <ol className="mt-4 space-y-3">
        {transcript.lines.map((line, i) => {
          const meta = speaker[line.from] || speaker.customer
          return (
            <li key={i} className="flex gap-3">
              <span className="w-10 shrink-0 pt-1 text-right font-mono text-[0.68rem] tabular-nums text-slate-400">
                {String(Math.floor(line.at / 60)).padStart(2, '0')}:{String(line.at % 60).padStart(2, '0')}
              </span>
              <div className="min-w-0 flex-1">
                <span className={cn('inline-block rounded-md px-1.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider', meta.className)}>{meta.label}</span>
                <p className="mt-1 text-[0.84rem] leading-relaxed text-slate-700">{line.text}</p>
              </div>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export function Transcripts() {
  const transcripts = useAsync(() => conversationService.listTranscripts(), [])
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState(null)

  const rows = transcripts.data || []
  const q = query.trim().toLowerCase()
  const filtered = !q
    ? rows
    : rows.filter((t) => t.customer.toLowerCase().includes(q) || t.business.toLowerCase().includes(q) || t.lines.some((l) => l.text.toLowerCase().includes(q)))

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
      <PageHeader title="Transcripts" description="Word-for-word records of AI conversations across the platform." badge={<Badge tone="brand">{rows.length} transcripts</Badge>} />

      {transcripts.loading ? (
        <div className="h-96 animate-pulse rounded-2xl bg-slate-100" />
      ) : rows.length === 0 ? (
        <Card>
          <EmptyState icon={FileText} title="No transcripts yet" description="Transcripts appear once businesses start handling calls." />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)]">
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
            <div className="border-b border-slate-200/80 p-4">
              <Input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search transcripts…" aria-label="Search transcripts" />
            </div>
            {!filtered.length ? (
              <EmptyState compact icon={FileText} title="No matches" description="Try a different word or name." />
            ) : (
              <ul className="max-h-[38rem] divide-y divide-slate-100 overflow-y-auto">
                {filtered.map((t) => (
                  <li key={t.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(t.id)}
                      className={cn('flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors', selected?.id === t.id ? 'bg-brand-50/70' : 'hover:bg-slate-50')}
                    >
                      <Avatar name={t.customer} size="sm" tone="muted" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[0.84rem] font-semibold text-ink-900">{t.customer}</span>
                        <span className="block truncate text-[0.74rem] text-slate-500">{t.business}</span>
                        <span className="mt-1 block text-[0.7rem] text-slate-400">{formatDate(t.at)} · {formatDuration(t.duration)}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Card>
            <CardBody>
              {selected ? (
                <>
                  <div className="flex items-center gap-3">
                    <Avatar name={selected.customer} size="md" />
                    <div className="min-w-0">
                      <h2 className="truncate font-display text-[1.02rem] font-semibold text-ink-900">{selected.customer}</h2>
                      <Link to={`/businesses/${selected.businessId}`} className="text-[0.78rem] text-brand-600 hover:underline">
                        {selected.business}
                      </Link>
                    </div>
                  </div>
                  <div className="mt-5">
                    <TranscriptBody transcript={selected} />
                  </div>
                </>
              ) : (
                <EmptyState icon={FileText} title="Select a transcript" description="Choose a conversation to read it in full." />
              )}
            </CardBody>
          </Card>
        </div>
      )}
    </>
  )
}
