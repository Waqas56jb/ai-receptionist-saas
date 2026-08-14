import { useState } from 'react'
import { CalendarCheck, CalendarClock, Link2, Unplug } from 'lucide-react'
import PageHeader from '../../../components/layout/PageHeader'
import { Card, CardBody, CardHeader } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Badge from '../../../components/ui/Badge'
import Toggle from '../../../components/ui/Toggle'
import { Select } from '../../../components/ui/Field'
import { EmptyState } from '../../../components/ui/States'
import { useToast } from '../../../context/ToastContext'

const providers = [
  { id: 'google', name: 'Google Calendar', description: 'Two-way sync with a Google Workspace or personal calendar.' },
  { id: 'outlook', name: 'Microsoft Outlook', description: 'Sync bookings with an Outlook or Microsoft 365 calendar.' },
  { id: 'ical', name: 'iCal feed', description: 'Publish bookings as a read-only calendar subscription.' },
]

export default function CalendarIntegration() {
  const toast = useToast()
  const [connected, setConnected] = useState(null)
  const [connecting, setConnecting] = useState(null)
  const [writeBack, setWriteBack] = useState(true)
  const [buffer, setBuffer] = useState('15 minutes')

  const connect = (id) => {
    setConnecting(id)
    setTimeout(() => {
      setConnected(id)
      setConnecting(null)
      toast.success('Calendar connected.')
    }, 900)
  }

  const active = providers.find((p) => p.id === connected)

  return (
    <>
      <PageHeader
        title="Calendar"
        description="Let the AI check availability and write confirmed bookings straight into your calendar."
        badge={<Badge tone={connected ? 'success' : 'neutral'} dot>{connected ? 'Connected' : 'Not connected'}</Badge>}
      />

      {!connected ? (
        <Card>
          <CardHeader icon={CalendarClock} title="Choose a calendar" description="Connect one calendar for now — more can be added later." />
          <CardBody>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {providers.map((provider) => (
                <div key={provider.id} className="rounded-xl border border-slate-200 bg-white p-5">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-500">
                    <CalendarClock className="h-[1.1rem] w-[1.1rem]" aria-hidden="true" />
                  </span>
                  <p className="mt-4 text-[0.9rem] font-semibold text-ink-900">{provider.name}</p>
                  <p className="mt-1 text-[0.8rem] leading-relaxed text-slate-500">{provider.description}</p>
                  <Button
                    as="button"
                    size="sm"
                    variant="secondary"
                    className="mt-4"
                    loading={connecting === provider.id}
                    onClick={() => connect(provider.id)}
                  >
                    <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
                    Connect
                  </Button>
                </div>
              ))}
            </div>

            <EmptyState
              compact
              className="mt-2"
              icon={CalendarCheck}
              title="No calendar connected yet"
              description="Until a calendar is connected, the AI records bookings inside the portal only."
            />
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <Card>
            <CardHeader
              icon={CalendarCheck}
              title={active.name}
              description="Connected and syncing bookings."
              action={
                <Button
                  as="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setConnected(null)
                    toast.info('Calendar disconnected.')
                  }}
                >
                  <Unplug className="h-3.5 w-3.5" aria-hidden="true" />
                  Disconnect
                </Button>
              }
            />
            <CardBody className="space-y-4">
              <Toggle
                checked={writeBack}
                onChange={setWriteBack}
                label="Write bookings to the calendar"
                description="Confirmed bookings appear as events with the customer's details."
              />
              <Toggle checked onChange={() => {}} label="Read availability" description="The AI avoids offering slots that are already busy." />
              <Select
                label="Buffer between bookings"
                options={['None', '15 minutes', '30 minutes', '1 hour']}
                value={buffer}
                onChange={(e) => setBuffer(e.target.value)}
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Sync status" />
            <CardBody>
              <ul className="space-y-2.5 text-[0.82rem]">
                <li className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">Last sync</span>
                  <span className="font-semibold text-ink-900">a few seconds ago</span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">Events written</span>
                  <span className="font-semibold text-ink-900">24</span>
                </li>
                <li className="flex items-center justify-between gap-3">
                  <span className="text-slate-500">Conflicts avoided</span>
                  <span className="font-semibold text-ink-900">6</span>
                </li>
              </ul>
            </CardBody>
          </Card>
        </div>
      )}
    </>
  )
}
