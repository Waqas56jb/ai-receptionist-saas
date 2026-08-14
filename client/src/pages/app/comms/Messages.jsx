import { useMemo, useState } from 'react'
import { Instagram, MessageSquare, Radio, Search, Send } from 'lucide-react'
import PageHeader from '../../../components/layout/PageHeader'
import DataTable from '../../../components/ui/DataTable'
import Badge, { StatusBadge } from '../../../components/ui/Badge'
import Avatar from '../../../components/ui/Avatar'
import Button from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Field'
import { FilterPills } from '../../../components/ui/Tabs'
import { EmptyState } from '../../../components/ui/States'
import useAsync from '../../../hooks/useAsync'
import conversationService from '../../../services/conversationService'
import { formatDate, formatTime } from '../../../lib/format'
import { channelLabel } from '../../../lib/channels'

const channelIcon = { whatsapp: MessageSquare, instagram: Instagram, web: Radio }

const filters = [
  { id: 'all', label: 'All' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'web', label: 'Website' },
]

export default function Messages() {
  const messages = useAsync(() => conversationService.listMessages(), [])
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')

  const rows = messages.data || []

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((row) => {
      const byChannel = filter === 'all' || row.channel === filter
      const bySearch = !q || row.customer.toLowerCase().includes(q) || row.text.toLowerCase().includes(q)
      return byChannel && bySearch
    })
  }, [rows, filter, query])

  const columns = [
    {
      key: 'customer',
      header: 'Customer',
      primary: true,
      render: (row) => {
        const Icon = channelIcon[row.channel] || Radio
        return (
          <div className="flex items-center gap-2.5">
            <Avatar name={row.customer} size="sm" />
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 truncate font-semibold text-ink-900">
                {row.customer}
                <Icon className="h-3 w-3 shrink-0 text-slate-400" aria-hidden="true" />
              </p>
              <p className="truncate text-[0.75rem] text-slate-500">{channelLabel(row.channel)}</p>
            </div>
          </div>
        )
      },
    },
    {
      key: 'text',
      header: 'Message',
      render: (row) => <p className="line-clamp-2 max-w-xs text-slate-700">{row.text}</p>,
    },
    {
      key: 'aiResponse',
      header: 'AI response',
      render: (row) => <p className="line-clamp-2 max-w-xs text-slate-500">{row.aiResponse}</p>,
      hideOnMobile: true,
    },
    { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} size="sm" /> },
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
  ]

  return (
    <>
      <PageHeader
        title="Messages"
        description="Every message the AI has answered across WhatsApp, Instagram and your website."
        badge={<Badge tone="brand">{rows.length} messages</Badge>}
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <FilterPills options={filters} value={filter} onChange={setFilter} />
        <div className="w-full max-w-xs">
          <Input icon={Search} type="search" placeholder="Search messages…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search messages" />
        </div>
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        loading={messages.loading}
        error={messages.error}
        onRetry={messages.reload}
        empty={
          <EmptyState
            icon={Send}
            title={rows.length ? 'No messages match those filters' : 'No messages yet'}
            description={
              rows.length
                ? 'Try another channel or clear your search.'
                : 'Connect WhatsApp to start receiving messages.'
            }
            action={!rows.length ? <Button as="a" href="/app/whatsapp-agent" size="sm">Connect WhatsApp</Button> : undefined}
          />
        }
        footer={`${filtered.length} of ${rows.length} messages`}
      />
    </>
  )
}
