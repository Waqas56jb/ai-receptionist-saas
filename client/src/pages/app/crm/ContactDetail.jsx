import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  CalendarDays,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  Send,
  StickyNote,
  Tag,
  Target,
  Users,
} from 'lucide-react'
import PageHeader from '../../../components/layout/PageHeader'
import { Card, CardBody, CardHeader } from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import Avatar from '../../../components/ui/Avatar'
import Button from '../../../components/ui/Button'
import { Input, Select } from '../../../components/ui/Field'
import { EmptyState, ErrorState } from '../../../components/ui/States'
import useAsync from '../../../hooks/useAsync'
import { useToast } from '../../../context/ToastContext'
import { useAuth } from '../../../context/AuthContext'
import crmService from '../../../services/crmService'
import conversationService from '../../../services/conversationService'
import { leadStatuses } from '../../../data/mock/crm'
import { formatDate, formatDateTime, formatDuration, timeAgo } from '../../../lib/format'
import { channelLabel } from '../../../lib/channels'

export default function ContactDetail() {
  const { id } = useParams()
  const toast = useToast()
  const { user } = useAuth()

  const contact = useAsync(() => crmService.getContact(id), [id])
  const conversations = useAsync(() => conversationService.list(), [])
  const calls = useAsync(() => conversationService.listCalls(), [])
  const bookings = useAsync(() => crmService.listBookings(), [])

  const [note, setNote] = useState('')
  const [tag, setTag] = useState('')

  if (contact.error) {
    return (
      <Card>
        <ErrorState onRetry={contact.reload} />
      </Card>
    )
  }

  if (contact.loading) {
    return <div className="h-96 animate-pulse rounded-2xl bg-slate-100" />
  }

  if (!contact.data) {
    return (
      <Card>
        <EmptyState
          icon={Users}
          title="Contact not found"
          description="This contact may have been deleted."
          action={
            <Button as={Link} to="/app/contacts" size="sm">
              Back to contacts
            </Button>
          }
        />
      </Card>
    )
  }

  const c = contact.data
  const theirConversations = (conversations.data || []).filter((x) => x.contactId === c.id)
  const theirCalls = (calls.data || []).filter((x) => x.contactId === c.id)
  const theirBookings = (bookings.data || []).filter((x) => x.contactId === c.id)

  const addNote = async () => {
    if (!note.trim()) return
    contact.setData(await crmService.addContactNote(c.id, note.trim(), user?.name))
    setNote('')
    toast.success('Note added.')
  }

  const addTag = async () => {
    if (!tag.trim()) return
    contact.setData(await crmService.updateContact(c.id, { tags: [...(c.tags || []), tag.trim()] }))
    setTag('')
    toast.success('Tag added.')
  }

  return (
    <>
      <PageHeader
        title={c.name}
        breadcrumbs={[{ label: 'Contacts', to: '/app/contacts' }, { label: c.name }]}
        badge={<Badge tone={c.leadStatus === 'Converted' ? 'success' : c.leadStatus === 'Lost' ? 'danger' : 'brand'}>{c.leadStatus}</Badge>}
        actions={
          <>
            <Button as="a" href={`tel:${c.phone}`} variant="secondary" size="sm">
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              Call
            </Button>
            <Button as="a" href={`mailto:${c.email}`} size="sm">
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              Email
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
        {/* Profile */}
        <div className="space-y-4">
          <Card>
            <CardBody>
              <div className="flex items-center gap-3.5">
                <Avatar name={c.name} size="lg" />
                <div className="min-w-0">
                  <h2 className="truncate font-display text-[1.05rem] font-semibold text-ink-900">{c.name}</h2>
                  <p className="truncate text-[0.8rem] text-slate-500">{c.company || 'Individual customer'}</p>
                </div>
              </div>

              <dl className="mt-5 space-y-3 text-[0.83rem]">
                <div className="flex items-center justify-between gap-3">
                  <dt className="flex items-center gap-2 text-slate-500">
                    <Mail className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                    Email
                  </dt>
                  <dd className="truncate font-medium text-ink-900">{c.email || '—'}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="flex items-center gap-2 text-slate-500">
                    <Phone className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                    Phone
                  </dt>
                  <dd className="truncate font-medium text-ink-900">{c.phone || '—'}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="flex items-center gap-2 text-slate-500">
                    <MessageSquare className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                    First channel
                  </dt>
                  <dd className="font-medium text-ink-900">{channelLabel(c.channel)}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="flex items-center gap-2 text-slate-500">
                    <CalendarDays className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                    Created
                  </dt>
                  <dd className="font-medium text-ink-900">{formatDate(c.createdAt)}</dd>
                </div>
              </dl>

              <div className="mt-5">
                <Select
                  label="Lead status"
                  options={leadStatuses}
                  value={c.leadStatus}
                  onChange={async (e) => {
                    contact.setData(await crmService.updateContact(c.id, { leadStatus: e.target.value }))
                    toast.success('Lead status updated.')
                  }}
                />
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader icon={Tag} title="Tags" />
            <CardBody>
              <div className="flex flex-wrap gap-2">
                {(c.tags || []).map((t) => (
                  <Badge key={t} tone="neutral">
                    {t}
                  </Badge>
                ))}
                {!c.tags?.length && <p className="text-[0.8rem] text-slate-500">No tags yet.</p>}
              </div>
              <div className="mt-3 flex gap-2">
                <Input value={tag} onChange={(e) => setTag(e.target.value)} placeholder="Add a tag" aria-label="New tag" className="flex-1" />
                <Button as="button" variant="secondary" size="md" onClick={addTag}>
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader icon={StickyNote} title="Notes" description="Only your team can see these." />
            <CardBody>
              <ul className="space-y-3">
                {(c.notes || []).map((n) => (
                  <li key={n.id} className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
                    <p className="text-[0.83rem] leading-relaxed text-slate-700">{n.text}</p>
                    <p className="mt-1.5 text-[0.7rem] text-slate-400">
                      {n.author} · {timeAgo(n.at)}
                    </p>
                  </li>
                ))}
                {!c.notes?.length && <p className="text-[0.8rem] text-slate-500">No notes yet.</p>}
              </ul>

              <div className="mt-3 flex gap-2">
                <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a note" aria-label="New note" className="flex-1" />
                <Button as="button" variant="secondary" size="md" onClick={addNote}>
                  <Send className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* History */}
        <div className="space-y-4">
          <Card>
            <CardHeader icon={MessageSquare} title="Conversation history" />
            <CardBody className="p-0 sm:p-0">
              {theirConversations.length === 0 ? (
                <EmptyState compact icon={MessageSquare} title="No conversations yet" description="Conversations with this contact will appear here." />
              ) : (
                <ul className="divide-y divide-slate-100">
                  {theirConversations.map((conv) => (
                    <li key={conv.id}>
                      <Link to={`/app/conversations?id=${conv.id}`} className="flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-slate-50">
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="text-[0.83rem] font-semibold text-ink-900">{channelLabel(conv.channel)}</span>
                            <Badge tone={conv.status === 'resolved' ? 'neutral' : 'brand'} size="sm">
                              {conv.status}
                            </Badge>
                          </span>
                          <span className="mt-0.5 block truncate text-[0.78rem] text-slate-500">{conv.preview}</span>
                        </span>
                        <span className="shrink-0 text-[0.7rem] text-slate-400">{timeAgo(conv.lastMessageAt)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader icon={Phone} title="Calls" />
            <CardBody className="p-0 sm:p-0">
              {theirCalls.length === 0 ? (
                <EmptyState compact icon={Phone} title="No calls yet" description="Calls from this contact will be listed here." />
              ) : (
                <ul className="divide-y divide-slate-100">
                  {theirCalls.map((call) => (
                    <li key={call.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                      <div className="min-w-0">
                        <p className="text-[0.83rem] font-semibold text-ink-900">{call.outcome}</p>
                        <p className="text-[0.75rem] text-slate-500">
                          {formatDateTime(call.at)} · {formatDuration(call.duration)}
                        </p>
                      </div>
                      <Badge tone={call.transferred ? 'info' : 'brand'} size="sm">
                        {call.transferred ? 'Transferred' : 'AI handled'}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader icon={CalendarDays} title="Bookings" />
            <CardBody className="p-0 sm:p-0">
              {theirBookings.length === 0 ? (
                <EmptyState compact icon={CalendarDays} title="No bookings yet" description="Bookings made by this contact will appear here." />
              ) : (
                <ul className="divide-y divide-slate-100">
                  {theirBookings.map((b) => (
                    <li key={b.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                      <div className="min-w-0">
                        <p className="truncate text-[0.83rem] font-semibold text-ink-900">{b.service}</p>
                        <p className="text-[0.75rem] text-slate-500">
                          {formatDate(b.date)} · {b.time} · {b.guests} guest{b.guests > 1 ? 's' : ''}
                        </p>
                      </div>
                      <Badge tone={b.status === 'Cancelled' ? 'danger' : b.status === 'Pending' ? 'warning' : 'success'} size="sm">
                        {b.status}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader icon={Target} title="Lead activity" />
            <CardBody>
              <p className="text-[0.83rem] leading-relaxed text-slate-600">
                Last interaction {timeAgo(c.lastInteraction)} · first seen {formatDate(c.createdAt)} via{' '}
                {channelLabel(c.channel)}.
              </p>
              <Button as={Link} to="/app/leads" variant="outline" size="sm" className="mt-4">
                View in pipeline
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  )
}
