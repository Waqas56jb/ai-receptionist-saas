import { useMemo, useState } from 'react'
import { CalendarDays, CalendarRange, List, Plus, Search, Trash2 } from 'lucide-react'
import cn from '../../../lib/cn'
import PageHeader from '../../../components/layout/PageHeader'
import DataTable from '../../../components/ui/DataTable'
import { Card, CardBody, CardHeader } from '../../../components/ui/Card'
import Badge from '../../../components/ui/Badge'
import Avatar from '../../../components/ui/Avatar'
import Button from '../../../components/ui/Button'
import Modal, { ConfirmDialog } from '../../../components/ui/Modal'
import { Input, Select, Textarea } from '../../../components/ui/Field'
import Tabs from '../../../components/ui/Tabs'
import { EmptyState } from '../../../components/ui/States'
import useAsync from '../../../hooks/useAsync'
import { useToast } from '../../../context/ToastContext'
import crmService from '../../../services/crmService'
import businessService from '../../../services/businessService'
import { bookingStatuses } from '../../../data/mock/crm'
import { formatCurrency, formatDate } from '../../../lib/format'

const TODAY = '2026-08-15'

const statusTone = { Confirmed: 'success', Pending: 'warning', Completed: 'neutral', Cancelled: 'danger' }

const emptyBooking = { customer: '', service: '', date: TODAY, time: '15:00', guests: 1, nights: 1, status: 'Pending', source: 'web', value: 0, notes: '' }

export default function Bookings() {
  const toast = useToast()
  const bookings = useAsync(() => crmService.listBookings(), [])
  const services = useAsync(() => businessService.list('services'), [])

  const [tab, setTab] = useState('upcoming')
  const [view, setView] = useState('list')
  const [query, setQuery] = useState('')
  const [creating, setCreating] = useState(false)
  const [draft, setDraft] = useState(emptyBooking)
  const [deleting, setDeleting] = useState(null)
  const [busy, setBusy] = useState(false)

  const rows = bookings.data || []

  const tabs = useMemo(
    () => [
      { id: 'upcoming', label: 'Upcoming', count: rows.filter((b) => b.date >= TODAY && b.status !== 'Cancelled').length },
      { id: 'past', label: 'Past', count: rows.filter((b) => b.date < TODAY || b.status === 'Completed').length },
      { id: 'pending', label: 'Pending', count: rows.filter((b) => b.status === 'Pending').length },
      { id: 'cancelled', label: 'Cancelled', count: rows.filter((b) => b.status === 'Cancelled').length },
    ],
    [rows],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return rows
      .filter((b) => {
        if (tab === 'upcoming') return b.date >= TODAY && b.status !== 'Cancelled' && b.status !== 'Completed'
        if (tab === 'past') return b.date < TODAY || b.status === 'Completed'
        if (tab === 'pending') return b.status === 'Pending'
        return b.status === 'Cancelled'
      })
      .filter((b) => !q || b.customer.toLowerCase().includes(q) || b.service.toLowerCase().includes(q))
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [rows, tab, query])

  const create = async () => {
    if (!draft.customer.trim() || !draft.service.trim()) return
    setBusy(true)
    try {
      bookings.setData(await crmService.createBooking(draft))
      setCreating(false)
      setDraft(emptyBooking)
      toast.success('Booking created.')
    } finally {
      setBusy(false)
    }
  }

  const columns = [
    {
      key: 'customer',
      header: 'Customer',
      primary: true,
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={row.customer} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-semibold text-ink-900">{row.customer}</p>
            <p className="truncate text-[0.75rem] text-slate-500">{row.service}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      render: (row) => (
        <div>
          <p className="whitespace-nowrap text-slate-700">{formatDate(row.date)}</p>
          <p className="text-[0.75rem] text-slate-400">{row.time}</p>
        </div>
      ),
    },
    { key: 'guests', header: 'Guests', render: (row) => row.guests },
    { key: 'value', header: 'Value', render: (row) => formatCurrency(row.value, 'EUR') },
    { key: 'source', header: 'Source', render: (row) => <span className="capitalize text-slate-500">{row.source}</span>, hideOnMobile: true },
    {
      key: 'status',
      header: 'Status',
      render: (row) => (
        <Select
          options={bookingStatuses}
          value={row.status}
          onChange={async (e) => {
            bookings.setData(await crmService.updateBooking(row.id, { status: e.target.value }))
            toast.success('Booking updated.')
          }}
          aria-label={`Status for ${row.customer}`}
          className="w-36"
        />
      ),
    },
    { key: 'notes', header: 'Notes', render: (row) => <span className="text-slate-500">{row.notes || '—'}</span>, hideOnMobile: true },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (row) => (
        <button
          type="button"
          onClick={() => setDeleting(row)}
          className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
          aria-label={`Delete booking for ${row.customer}`}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      ),
    },
  ]

  // Simple month grid for the calendar view.
  const calendarDays = useMemo(() => {
    const days = []
    for (let d = 1; d <= 31; d++) {
      const date = `2026-08-${String(d).padStart(2, '0')}`
      days.push({ date, day: d, items: rows.filter((b) => b.date === date) })
    }
    return days
  }, [rows])

  return (
    <>
      <PageHeader
        title="Bookings"
        description="Everything the AI has booked, plus anything your team adds by hand."
        badge={<Badge tone="brand">{rows.filter((b) => b.status === 'Confirmed').length} confirmed</Badge>}
        actions={
          <>
            <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1">
              <button
                type="button"
                onClick={() => setView('list')}
                aria-pressed={view === 'list'}
                className={cn('inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[0.78rem] font-semibold transition-colors', view === 'list' ? 'bg-brand-600 text-white' : 'text-slate-500 hover:text-ink-900')}
              >
                <List className="h-3.5 w-3.5" aria-hidden="true" />
                List
              </button>
              <button
                type="button"
                onClick={() => setView('calendar')}
                aria-pressed={view === 'calendar'}
                className={cn('inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[0.78rem] font-semibold transition-colors', view === 'calendar' ? 'bg-brand-600 text-white' : 'text-slate-500 hover:text-ink-900')}
              >
                <CalendarRange className="h-3.5 w-3.5" aria-hidden="true" />
                Calendar
              </button>
            </div>
            <Button as="button" size="sm" onClick={() => setCreating(true)}>
              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              Create Booking
            </Button>
          </>
        }
      />

      {view === 'list' ? (
        <>
          <Tabs tabs={tabs} value={tab} onChange={setTab} className="mb-4" />

          <div className="mb-4 max-w-sm">
            <Input icon={Search} type="search" placeholder="Search bookings…" value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Search bookings" />
          </div>

          <DataTable
            columns={columns}
            rows={filtered}
            loading={bookings.loading}
            error={bookings.error}
            onRetry={bookings.reload}
            empty={
              <EmptyState
                icon={CalendarDays}
                title={rows.length ? 'Nothing in this view' : 'No bookings yet'}
                description={
                  rows.length
                    ? 'Try a different tab or clear your search.'
                    : 'When the AI confirms a booking it will appear here automatically.'
                }
                action={
                  <Button as="button" size="sm" onClick={() => setCreating(true)}>
                    <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                    Create Booking
                  </Button>
                }
              />
            }
            footer={`${filtered.length} of ${rows.length} bookings`}
          />
        </>
      ) : (
        <Card>
          <CardHeader icon={CalendarRange} title="August 2026" description="Bookings by day." />
          <CardBody>
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
                <p key={d} className="pb-1 text-[0.68rem] font-bold uppercase tracking-wider text-slate-400">
                  {d}
                </p>
              ))}
              {/* 1 August 2026 is a Saturday — pad the first row. */}
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={`pad-${i}`} />
              ))}
              {calendarDays.map((day) => (
                <div
                  key={day.date}
                  className={cn(
                    'min-h-[4.5rem] rounded-lg border p-1.5 text-left',
                    day.date === TODAY ? 'border-brand-400 bg-brand-50/60' : 'border-slate-200 bg-white',
                  )}
                >
                  <p className={cn('text-[0.7rem] font-bold', day.date === TODAY ? 'text-brand-700' : 'text-slate-400')}>{day.day}</p>
                  <ul className="mt-1 space-y-1">
                    {day.items.slice(0, 2).map((item) => (
                      <li
                        key={item.id}
                        className="truncate rounded bg-brand-600/10 px-1 py-0.5 text-[0.62rem] font-semibold text-brand-800"
                        title={`${item.customer} · ${item.service}`}
                      >
                        {item.customer.split(' ')[0]}
                      </li>
                    ))}
                    {day.items.length > 2 && <li className="text-[0.6rem] text-slate-400">+{day.items.length - 2}</li>}
                  </ul>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      <Modal
        open={creating}
        onClose={() => setCreating(false)}
        title="Create booking"
        footer={
          <>
            <Button as="button" variant="ghost" size="sm" onClick={() => setCreating(false)}>
              Cancel
            </Button>
            <Button as="button" size="sm" loading={busy} onClick={create}>
              Create booking
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input label="Customer" value={draft.customer} onChange={(e) => setDraft((d) => ({ ...d, customer: e.target.value }))} required />
          <Select
            label="Service"
            value={draft.service}
            onChange={(e) => setDraft((d) => ({ ...d, service: e.target.value }))}
            options={['', ...(services.data || []).map((s) => s.name)]}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input label="Date" type="date" value={draft.date} onChange={(e) => setDraft((d) => ({ ...d, date: e.target.value }))} />
            <Input label="Time" type="time" value={draft.time} onChange={(e) => setDraft((d) => ({ ...d, time: e.target.value }))} />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Input label="Guests" type="number" min="1" value={draft.guests} onChange={(e) => setDraft((d) => ({ ...d, guests: Number(e.target.value) }))} />
            <Input label="Nights" type="number" min="0" value={draft.nights} onChange={(e) => setDraft((d) => ({ ...d, nights: Number(e.target.value) }))} />
            <Input label="Value (€)" type="number" min="0" value={draft.value} onChange={(e) => setDraft((d) => ({ ...d, value: Number(e.target.value) }))} />
          </div>
          <Select label="Status" options={bookingStatuses} value={draft.status} onChange={(e) => setDraft((d) => ({ ...d, status: e.target.value }))} />
          <Textarea label="Notes" rows={3} value={draft.notes} onChange={(e) => setDraft((d) => ({ ...d, notes: e.target.value }))} />
        </div>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          bookings.setData(await crmService.deleteBooking(deleting.id))
          setDeleting(null)
          toast.success('Booking deleted.')
        }}
        title="Delete this booking?"
        description={`The booking for ${deleting?.customer} on ${formatDate(deleting?.date)} will be removed.`}
        confirmLabel="Delete"
      />
    </>
  )
}
