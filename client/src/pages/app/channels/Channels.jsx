import { Radio } from 'lucide-react'
import PageHeader from '../../../components/layout/PageHeader'
import { Card, CardBody, CardHeader } from '../../../components/ui/Card'
import { SkeletonCard } from '../../../components/ui/Skeleton'
import { ErrorState } from '../../../components/ui/States'
import ChannelConfigCard from '../../../components/ai/ChannelConfigCard'
import Badge from '../../../components/ui/Badge'
import useAsync from '../../../hooks/useAsync'
import { useToast } from '../../../context/ToastContext'
import channelService from '../../../services/channelService'
import { formatDate } from '../../../lib/format'

export default function Channels() {
  const toast = useToast()
  const channels = useAsync(() => channelService.list(), [])

  const toggle = async (id, enabled) => {
    channels.setData(await channelService.update(id, { enabled }))
    toast.success(`Channel ${enabled ? 'enabled' : 'disabled'}.`)
  }

  const connected = (channels.data || []).filter((c) => c.connected).length

  return (
    <>
      <PageHeader
        title="Channels"
        description="Every way your customers can reach you, and the state of each connection."
        badge={
          channels.data && (
            <Badge tone="brand">
              {connected} of {channels.data.length} connected
            </Badge>
          )
        }
      />

      {channels.loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {channels.error && (
        <Card>
          <ErrorState onRetry={channels.reload} />
        </Card>
      )}

      {channels.data && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {channels.data.map((channel) => (
              <ChannelConfigCard key={channel.id} channel={channel} onToggle={toggle} />
            ))}
          </div>

          <Card className="mt-4">
            <CardHeader icon={Radio} title="Connection history" description="When each channel was last connected or verified." />
            <CardBody>
              <ul className="divide-y divide-slate-100">
                {channels.data.map((channel) => (
                  <li key={channel.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="text-[0.85rem] font-semibold text-ink-900">{channel.name}</p>
                      <p className="text-[0.75rem] text-slate-500">{channel.provider}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[0.78rem] text-slate-500">
                        {channel.lastConnectedAt ? formatDate(channel.lastConnectedAt) : 'Never connected'}
                      </span>
                      <Badge tone={channel.connected ? 'success' : 'neutral'} size="sm" dot>
                        {channel.connected ? 'Connected' : 'Not connected'}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </>
      )}
    </>
  )
}
