import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  Bot,
  CheckCheck,
  Instagram,
  MessageSquare,
  MessagesSquare,
  Phone,
  Radio,
  Search,
  Send,
  StickyNote,
  Target,
  UserRound,
  UserCheck,
} from 'lucide-react'
import cn from '../../../lib/cn'
import PageHeader from '../../../components/layout/PageHeader'
import Avatar from '../../../components/ui/Avatar'
import Badge from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Field'
import { FilterPills } from '../../../components/ui/Tabs'
import { EmptyState, ErrorState } from '../../../components/ui/States'
import { useToast } from '../../../context/ToastContext'
import { useAuth } from '../../../context/AuthContext'
import useAsync from '../../../hooks/useAsync'
import conversationService from '../../../services/conversationService'
import { formatTime, timeAgo } from '../../../lib/format'
import { channelLabel } from '../../../lib/channels'

const channelIcon = { voice: Phone, whatsapp: MessageSquare, instagram: Instagram, web: Radio }

const filters = [
  { id: 'all', label: 'All' },
  { id: 'voice', label: 'Voice' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'unread', label: 'Unread' },
  { id: 'leads', label: 'Leads' },
  { id: 'resolved', label: 'Resolved' },
]

export default function Conversations() {
  const toast = useToast()
  const { user } = useAuth()
  const [params, setParams] = useSearchParams()
  const conversations = useAsync(() => conversationService.list(), [])

  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [reply, setReply] = useState('')
  const [note, setNote] = useState('')
  const [sending, setSending] = useState(false)

  const rows = conversations.data || []
  const selectedId = params.get('id')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows.filter((c) => {
      const byFilter =
        filter === 'all' ||
        (filter === 'unread' && c.unread) ||
        (filter === 'leads' && ['Qualified', 'Interested', 'Converted'].includes(c.lead)) ||
        (filter === 'resolved' && c.status === 'resolved') ||
        c.channel === filter
      const bySearch = !q || c.customer.toLowerCase().includes(q) || c.preview.toLowerCase().includes(q)
      return byFilter && bySearch
    })
  }, [rows, filter, query])

  const selected = rows.find((c) => c.id === selectedId) || null

  // Pick the first conversation on desktop so the pane is never empty.
  useEffect(() => {
    if (!selectedId && filtered.length && window.innerWidth >= 1024) {
      setParams({ id: filtered[0].id }, { replace: true })
    }
  }, [filtered, selectedId, setParams])

  const select = (id) => setParams({ id })

  const send = async () => {
    if (!reply.trim() || !selected) return
    setSending(true)
    try {
      const updated = await conversationService.sendReply(selected.id, reply.trim(), user?.name)
      conversations.setData(rows.map((c) => (c.id === updated.id ? updated : c)))
      setReply('')
      toast.success('Reply sent — the AI has stepped back on this conversation.')
    } finally {
      setSending(false)
    }
  }

  const addNote = async () => {
    if (!note.trim() || !selected) return
    const updated = await conversationService.addNote(selected.id, note.trim(), user?.name)
    conversations.setData(rows.map((c) => (c.id === updated.id ? updated : c)))
    setNote('')
    toast.success('Note added.')
  }

  const patch = async (changes, message) => {
    const updated = await conversationService.update(selected.id, changes)
    conversations.setData(rows.map((c) => (c.id === updated.id ? updated : c)))
    toast.success(message)
  }

  if (conversations.error) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white">
        <ErrorState onRetry={conversations.reload} />
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title="Conversations"
        description="Every call, message and chat in one inbox."
        badge={<Badge tone="brand">{rows.filter((c) => c.unread).length} unread</Badge>}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        {/* List */}
        <div className={cn('overflow-hidden rounded-2xl border border-slate-200/80 bg-white', selected && 'hidden lg:block')}>
          <div className="space-y-3 border-b border-slate-200/80 p-4">
            <Input
              icon={Search}
              type="search"
              placeholder="Search conversations…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search conversations"
            />
            <FilterPills options={filters} value={filter} onChange={setFilter} />
          </div>

          {conversations.loading && (
            <div className="space-y-3 p-4">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-100" />
              ))}
            </div>
          )}

          {!conversations.loading && !filtered.length && (
            <EmptyState
              compact
              icon={MessagesSquare}
              title="No conversations yet"
              description="Connect a channel and your customers' calls and messages will land here."
              action={
                <Button as={Link} to="/app/channels" size="sm">
                  Connect Channel
                </Button>
              }
            />
          )}

          <ul className="max-h-[34rem] divide-y divide-slate-100 overflow-y-auto lg:max-h-[46rem]">
            {filtered.map((c) => {
              const Icon = channelIcon[c.channel] || MessagesSquare
              const active = c.id === selectedId
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => select(c.id)}
                    className={cn(
                      'flex w-full items-start gap-3 px-4 py-3.5 text-left transition-colors',
                      active ? 'bg-brand-50/70' : 'hover:bg-slate-50',
                    )}
                  >
                    <Avatar name={c.customer} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-[0.85rem] font-semibold text-ink-900">{c.customer}</span>
                        <Icon className="h-3 w-3 shrink-0 text-slate-400" aria-hidden="true" />
                        {c.unread && <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-label="Unread" />}
                      </span>
                      <span className="mt-0.5 block truncate text-[0.78rem] text-slate-500">{c.preview}</span>
                      <span className="mt-1.5 flex items-center gap-2">
                        <Badge tone={c.status === 'escalated' ? 'warning' : c.status === 'resolved' ? 'neutral' : 'brand'} size="sm">
                          {c.status}
                        </Badge>
                        <span className="text-[0.68rem] text-slate-400">{timeAgo(c.lastMessageAt)}</span>
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Detail */}
        <div className={cn('overflow-hidden rounded-2xl border border-slate-200/80 bg-white', !selected && 'hidden lg:block')}>
          {!selected ? (
            <EmptyState icon={MessagesSquare} title="Select a conversation" description="Choose a conversation on the left to read the full thread." />
          ) : (
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200/80 p-4 sm:px-5">
                <div className="flex min-w-0 items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setParams({})}
                    className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-slate-200 text-slate-500 lg:hidden"
                    aria-label="Back to list"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <Avatar name={selected.customer} size="md" />
                  <div className="min-w-0">
                    <p className="truncate font-display text-[0.95rem] font-semibold text-ink-900">{selected.customer}</p>
                    <p className="truncate text-[0.75rem] text-slate-500">
                      {channelLabel(selected.channel)} · {selected.language} · started {timeAgo(selected.startedAt)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={selected.handledBy === 'ai' ? 'brand' : 'info'} size="sm">
                    {selected.handledBy === 'ai' ? (
                      <>
                        <Bot className="h-3 w-3" aria-hidden="true" /> AI
                      </>
                    ) : (
                      <>
                        <UserRound className="h-3 w-3" aria-hidden="true" /> Human
                      </>
                    )}
                  </Badge>
                  <Badge tone="neutral" size="sm">
                    <Target className="h-3 w-3" aria-hidden="true" />
                    {selected.lead}
                  </Badge>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 border-b border-slate-200/80 bg-slate-50/60 px-4 py-2.5 sm:px-5">
                <Button as="button" variant="outline" size="xs" onClick={() => patch({ handledBy: 'human' }, 'You have taken over this conversation.')}>
                  <UserCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Human takeover
                </Button>
                <Button as="button" variant="outline" size="xs" onClick={() => patch({ lead: 'Qualified' }, 'Marked as a qualified lead.')}>
                  <Target className="h-3.5 w-3.5" aria-hidden="true" />
                  Mark as lead
                </Button>
                <Button as="button" variant="outline" size="xs" onClick={() => patch({ status: 'resolved', unread: false }, 'Conversation resolved.')}>
                  <CheckCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Resolve
                </Button>
                <Button as="button" variant="outline" size="xs" onClick={() => patch({ assignee: 'Marc Dubois' }, 'Assigned to Marc Dubois.')}>
                  Assign
                </Button>
              </div>

              {/* Thread */}
              <div className="min-h-[18rem] flex-1 space-y-3.5 overflow-y-auto p-4 sm:p-5">
                {selected.messages.map((m) => {
                  const outgoing = m.from !== 'customer'
                  return (
                    <div key={m.id} className={cn('flex gap-2.5', outgoing && 'justify-end')}>
                      {!outgoing && (
                        <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-500">
                          <UserRound className="h-3.5 w-3.5" aria-hidden="true" />
                        </span>
                      )}
                      <div className={cn('max-w-[80%]', outgoing && 'text-right')}>
                        <p
                          className={cn(
                            'inline-block text-left text-[0.85rem] leading-relaxed',
                            m.from === 'customer' && 'rounded-2xl rounded-tl-sm bg-slate-100 px-3.5 py-2.5 text-slate-700',
                            m.from === 'ai' && 'rounded-2xl rounded-tr-sm bg-brand-600 px-3.5 py-2.5 text-white',
                            m.from === 'human' && 'rounded-2xl rounded-tr-sm bg-ink-900 px-3.5 py-2.5 text-white',
                          )}
                        >
                          {m.text}
                        </p>
                        <p className="mt-1 text-[0.65rem] text-slate-400">
                          {m.from === 'ai' ? 'AI receptionist' : m.from === 'human' ? m.author || 'Team' : 'Customer'} · {formatTime(m.at)}
                        </p>
                      </div>
                      {outgoing && (
                        <span
                          className={cn(
                            'mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full',
                            m.from === 'ai' ? 'bg-brand-50 text-brand-600' : 'bg-ink-900 text-white',
                          )}
                        >
                          {m.from === 'ai' ? <Bot className="h-3.5 w-3.5" aria-hidden="true" /> : <UserRound className="h-3.5 w-3.5" aria-hidden="true" />}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* Notes */}
              {selected.notes?.length > 0 && (
                <div className="border-t border-slate-200/80 bg-amber-50/50 px-4 py-3 sm:px-5">
                  <p className="flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-wider text-amber-700">
                    <StickyNote className="h-3 w-3" aria-hidden="true" />
                    Internal notes
                  </p>
                  <ul className="mt-2 space-y-1.5">
                    {selected.notes.map((n) => (
                      <li key={n.id} className="text-[0.8rem] text-amber-900">
                        {n.text}
                        <span className="ml-2 text-[0.68rem] text-amber-700/70">
                          {n.author} · {timeAgo(n.at)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Composer */}
              <div className="border-t border-slate-200/80 p-4 sm:p-5">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    send()
                  }}
                  className="flex items-center gap-2"
                >
                  <label htmlFor="reply" className="sr-only">
                    Reply to {selected.customer}
                  </label>
                  <input
                    id="reply"
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Write a reply as your team…"
                    className="h-11 flex-1 rounded-xl border border-slate-200 bg-white px-3.5 text-[0.88rem] text-ink-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/25"
                  />
                  <button
                    type="submit"
                    disabled={!reply.trim() || sending}
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-600 text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
                    aria-label="Send reply"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>

                <div className="mt-2.5 flex items-center gap-2">
                  <label htmlFor="note" className="sr-only">
                    Add an internal note
                  </label>
                  <input
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Add an internal note (only your team sees this)…"
                    className="h-9 flex-1 rounded-lg border border-slate-200 bg-slate-50/70 px-3 text-[0.8rem] text-ink-900 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/25"
                  />
                  <Button as="button" variant="outline" size="xs" onClick={addNote} disabled={!note.trim()}>
                    <StickyNote className="h-3.5 w-3.5" aria-hidden="true" />
                    Add note
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
