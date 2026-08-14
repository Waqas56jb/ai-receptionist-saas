import { useMemo, useState } from 'react'
import { Bot, FileText, Phone, PlayCircle, Search, UserCheck } from 'lucide-react'
import PageHeader from '../../../components/layout/PageHeader'
import DataTable from '../../../components/ui/DataTable'
import Badge, { StatusBadge } from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import Modal from '../../../components/ui/Modal'
import { Input, Select } from '../../../components/ui/Field'
import { EmptyState } from '../../../components/ui/States'
import Avatar from '../../../components/ui/Avatar'
import TranscriptViewer from '../../../components/comms/TranscriptViewer'
import useAsync from '../../../hooks/useAsync'
import conversationService from '../../../services/conversationService'
import { formatDate, formatDuration, formatTime } from '../../../lib/format'
import { useToast } from '../../../context/ToastContext'

export default function Calls() {
  const toast = useToast()
  const calls = useAsync(() => conversationService.listCalls(), [])
  const transcripts = useAsync(() => conversationService.listTranscripts(), [])

  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All statuses')
  const [handling, setHandling] = useState('All calls')
  const [duration, setDuration] = useState('Any duration')
  const [viewing, setViewing] = useState(null)

  const rows = calls.data || []

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((row) => {
      const bySearch = !q || row.customer.toLowerCase().includes(q) || row.phone.includes(q)
      const byStatus = status === 'All statuses' || row.status === status
      const byHandling =
        handling === 'All calls' ||
        (handling === 'AI handled' && row.aiHandled && !row.transferred) ||
        (handling === 'Human transferred' && row.transferred)
      const byDuration =
        duration === 'Any duration' ||
        (duration === 'Under 1 min' && row.duration < 60) ||
        (duration === '1–5 min' && row.duration >= 60 && row.duration <= 300) ||
        (duration === 'Over 5 min' && row.duration > 300)
      return bySearch && byStatus && byHandling && byDuration
    })
  }, [rows, query, status, handling, duration])

  const openTranscript = (call) => {
    const transcript = (transcripts.data || []).find((t) => t.id === call.transcriptId)
    if (!transcript) {
      toast.info('No transcript was recorded for this call.')
      return
    }
    setViewing(transcript)
  }

  const columns = [
    {
      key: 'customer',
      header: 'Customer',
      primary: true,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.customer} size="sm" tone={row.contactId ? 'brand' : 'muted'} />
          <div className="min-w-0">
            <p className="truncate font-semibold text-ink-900">{row.customer}</p>
            <p className="truncate text-[0.75rem] text-slate-500">{row.phone}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'at',
      header: 'Date',
      render: (row) => (
        <div>
          <p className="text-slate-700">{formatDate(row.at)}</p>
          <p className="text-[0.75rem] text-slate-400">{formatTime(row.at)}</p>
        </div>
      ),
    },
    { key: 'duration', header: 'Duration', render: (row) => formatDuration(row.duration) },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} size="sm" /> },
    {
      key: 'handling',
      header: 'Handling',
      render: (row) =>
        row.transferred ? (
          <Badge tone="info" size="sm">
            <UserCheck className="h-3 w-3" aria-hidden="true" />
            Transferred
          </Badge>
        ) : row.aiHandled ? (
          <Badge tone="brand" size="sm">
            <Bot className="h-3 w-3" aria-hidden="true" />
            AI handled
          </Badge>
        ) : (
          <Badge tone="neutral" size="sm">
            Not answered
          </Badge>
        ),
    },
    { key: 'outcome', header: 'Outcome', render: (row) => <span className="text-slate-500">{row.outcome}</span>, hideOnMobile: true },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            disabled={!row.recording}
            onClick={() => toast.info('Recording playback arrives with the backend milestone.')}
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-ink-900 disabled:opacity-30"
            aria-label={`Play recording for ${row.customer}`}
          >
            <PlayCircle className="h-4 w-4" />
          </button>
          <button
            type="button"
            disabled={!row.transcriptId}
            onClick={() => openTranscript(row)}
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
      <PageHeader
        title="Calls"
        description="Every inbound call, how it was handled and what came of it."
        badge={<Badge tone="brand">{rows.length} calls</Badge>}
      />

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Input icon={Search} type="search" placeholder="Search name or number…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search calls" />
        <Select options={['All statuses', 'Completed', 'Missed', 'Voicemail']} value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status" />
        <Select options={['All calls', 'AI handled', 'Human transferred']} value={handling} onChange={(e) => setHandling(e.target.value)} aria-label="Filter by handling" />
        <Select options={['Any duration', 'Under 1 min', '1–5 min', 'Over 5 min']} value={duration} onChange={(e) => setDuration(e.target.value)} aria-label="Filter by duration" />
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        loading={calls.loading}
        error={calls.error}
        onRetry={calls.reload}
        empty={
          <EmptyState
            icon={Phone}
            title={rows.length ? 'No calls match those filters' : 'No calls yet'}
            description={
              rows.length
                ? 'Try widening your search or clearing a filter.'
                : 'Connect your phone number and the AI will start answering calls.'
            }
            action={!rows.length ? <Button as="a" href="/app/voice-agent" size="sm">Configure Voice</Button> : undefined}
          />
        }
        footer={`${filtered.length} of ${rows.length} calls`}
      />

      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} title={`Call with ${viewing?.customer}`} size="lg">
        {viewing && <TranscriptViewer transcript={viewing} />}
      </Modal>
    </>
  )
}
