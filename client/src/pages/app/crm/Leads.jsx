import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { LayoutGrid, List, Search, Target } from 'lucide-react'
import cn from '../../../lib/cn'
import PageHeader from '../../../components/layout/PageHeader'
import DataTable from '../../../components/ui/DataTable'
import { Card } from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import Avatar from '../../../components/ui/Avatar'
import Button from '../../../components/ui/Button'
import { Input, Select } from '../../../components/ui/Field'
import { EmptyState } from '../../../components/ui/States'
import useAsync from '../../../hooks/useAsync'
import { useToast } from '../../../context/ToastContext'
import crmService from '../../../services/crmService'
import { leadStatuses } from '../../../data/mock/crm'
import { formatCurrency, formatDate, timeAgo } from '../../../lib/format'
import { channelLabel } from '../../../lib/channels'

const tone = { New: 'brand', Contacted: 'info', Qualified: 'success', Interested: 'info', Converted: 'success', Lost: 'danger' }

function ScoreBar({ score }) {
  const colour = score >= 75 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-slate-300'
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-14 overflow-hidden rounded-full bg-slate-100">
        <div className={cn('h-full rounded-full', colour)} style={{ width: `${score}%` }} />
      </div>
      <span className="text-[0.75rem] font-semibold tabular-nums text-slate-600">{score}</span>
    </div>
  )
}

export default function Leads() {
  const toast = useToast()
  const leads = useAsync(() => crmService.listLeads(), [])
  const [view, setView] = useState('pipeline')
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All statuses')

  const rows = leads.data || []

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((row) => {
      const bySearch = !q || row.name.toLowerCase().includes(q) || row.note.toLowerCase().includes(q)
      const byStatus = status === 'All statuses' || row.status === status
      return bySearch && byStatus
    })
  }, [rows, query, status])

  const move = async (lead, nextStatus) => {
    leads.setData(await crmService.updateLead(lead.id, { status: nextStatus }))
    toast.success(`${lead.name} moved to ${nextStatus}.`)
  }

  const columns = [
    {
      key: 'name',
      header: 'Lead',
      primary: true,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.name} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-semibold text-ink-900">{row.name}</p>
            <p className="truncate text-[0.75rem] text-slate-500">{row.note}</p>
          </div>
        </div>
      ),
    },
    { key: 'source', header: 'Source', render: (row) => row.source },
    { key: 'channel', header: 'Channel', render: (row) => channelLabel(row.channel), hideOnMobile: true },
    { key: 'score', header: 'Score', render: (row) => <ScoreBar score={row.score} /> },
    { key: 'value', header: 'Value', render: (row) => formatCurrency(row.value, 'EUR') },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Select
          options={leadStatuses}
          value={row.status}
          onChange={(e) => move(row, e.target.value)}
          aria-label={`Status for ${row.name}`}
          className="w-36"
        />
      ),
    },
    { key: 'createdAt', header: 'Created', render: (row) => formatDate(row.createdAt), hideOnMobile: true },
    { key: 'lastActivity', header: 'Last activity', render: (row) => timeAgo(row.lastActivity) },
  ]

  const totalValue = filtered.reduce((sum, l) => sum + (l.value || 0), 0)

  return (
    <>
      <PageHeader
        title="Leads"
        description="Every opportunity your AI receptionist has captured, from first contact to won."
        badge={<Badge tone="brand">{formatCurrency(totalValue, 'EUR')} in pipeline</Badge>}
        actions={
          <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
            <button
              type="button"
              onClick={() => setView('pipeline')}
              aria-pressed={view === 'pipeline'}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[0.78rem] font-semibold transition-colors',
                view === 'pipeline' ? 'bg-brand-600 text-white' : 'text-slate-500 hover:text-ink-900',
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
              Pipeline
            </button>
            <button
              type="button"
              onClick={() => setView('table')}
              aria-pressed={view === 'table'}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[0.78rem] font-semibold transition-colors',
                view === 'table' ? 'bg-brand-600 text-white' : 'text-slate-500 hover:text-ink-900',
              )}
            >
              <List className="h-3.5 w-3.5" aria-hidden="true" />
              Table
            </button>
          </div>
        }
      />

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]">
        <Input icon={Search} type="search" placeholder="Search leads…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search leads" />
        <Select options={['All statuses', ...leadStatuses]} value={status} onChange={(e) => setStatus(e.target.value)} aria-label="Filter by status" />
      </div>

      {leads.loading && <div className="h-96 animate-pulse rounded-2xl bg-slate-100" />}

      {!leads.loading && !filtered.length && (
        <Card>
          <EmptyState
            icon={Target}
            title={rows.length ? 'No leads match those filters' : 'No leads yet'}
            description={
              rows.length
                ? 'Try a different search or status.'
                : 'When the AI captures contact details and intent, the lead appears here.'
            }
            action={
              !rows.length ? (
                <Button as={Link} to="/app/ai-training/prompts" size="sm">
                  Set lead questions
                </Button>
              ) : undefined
            }
          />
        </Card>
      )}

      {!leads.loading && filtered.length > 0 && view === 'pipeline' && (
        <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          <div className="grid min-w-[62rem] grid-cols-6 gap-3">
            {leadStatuses.map((stage) => {
              const stageLeads = filtered.filter((l) => l.status === stage)
              const stageValue = stageLeads.reduce((sum, l) => sum + (l.value || 0), 0)
              return (
                <div key={stage} className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3">
                  <div className="flex items-center justify-between gap-2 px-1">
                    <p className="text-[0.78rem] font-bold text-ink-900">{stage}</p>
                    <span className="rounded-full bg-white px-1.5 py-0.5 text-[0.68rem] font-bold text-slate-500">{stageLeads.length}</span>
                  </div>
                  <p className="mt-0.5 px-1 text-[0.7rem] text-slate-500">{formatCurrency(stageValue, 'EUR')}</p>

                  <ul className="mt-3 space-y-2">
                    {stageLeads.map((lead) => (
                      <li key={lead.id} className="rounded-xl border border-slate-200 bg-white p-3">
                        <div className="flex items-center gap-2">
                          <Avatar name={lead.name} size="xs" />
                          <p className="min-w-0 flex-1 truncate text-[0.8rem] font-semibold text-ink-900">{lead.name}</p>
                        </div>
                        <p className="mt-1.5 line-clamp-2 text-[0.72rem] leading-relaxed text-slate-500">{lead.note}</p>
                        <div className="mt-2.5 flex items-center justify-between gap-2">
                          <ScoreBar score={lead.score} />
                          <span className="text-[0.72rem] font-semibold text-ink-900">{formatCurrency(lead.value, 'EUR')}</span>
                        </div>
                        <Select
                          options={leadStatuses}
                          value={lead.status}
                          onChange={(e) => move(lead, e.target.value)}
                          aria-label={`Move ${lead.name}`}
                          className="mt-2.5"
                        />
                      </li>
                    ))}
                    {!stageLeads.length && (
                      <li className="rounded-xl border border-dashed border-slate-200 px-3 py-6 text-center text-[0.72rem] text-slate-400">
                        No leads
                      </li>
                    )}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {!leads.loading && filtered.length > 0 && view === 'table' && (
        <DataTable columns={columns} rows={filtered} footer={`${filtered.length} of ${rows.length} leads`} />
      )}
    </>
  )
}
