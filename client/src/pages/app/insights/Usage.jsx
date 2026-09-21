import { Link } from 'react-router-dom'
import { Gauge, Info, TrendingUp } from 'lucide-react'
import PageHeader from '../../../components/layout/PageHeader'
import { Card, CardBody, CardHeader } from '../../../components/ui/Card'
import ProgressBar from '../../../components/ui/ProgressBar'
import Badge from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import { ErrorState } from '../../../components/ui/States'
import useAsync from '../../../hooks/useAsync'
import analyticsService from '../../../services/analyticsService'
import { formatDate } from '../../../lib/format'

export default function Usage() {
  const usage = useAsync(() => analyticsService.getUsage(), [])

  if (usage.error) {
    return (
      <Card>
        <ErrorState onRetry={usage.reload} />
      </Card>
    )
  }

  const data = usage.data
  const nearLimit = (data?.metrics || []).filter((m) => m.limit > 0 && m.used / m.limit >= 0.75)

  return (
    <>
      <PageHeader
        title="Usage"
        description="What you have used this billing period, and how much of your plan is left."
        badge={data && <Badge tone="brand">{data.planName} plan</Badge>}
        actions={
          <Button as={Link} to="/app/subscription" size="sm">
            Manage subscription
          </Button>
        }
      />

      {usage.loading && <div className="h-72 animate-pulse rounded-2xl bg-slate-100" />}

      {data && (
        <>
          {nearLimit.length > 0 && (
            <div className="mb-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4">
              <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
              <p className="text-[0.85rem] leading-relaxed text-amber-900">
                You have used more than 75% of your {nearLimit.map((m) => m.label.toLowerCase()).join(' and ')} allowance
                this period. Consider upgrading before you reach the limit.
              </p>
            </div>
          )}

          <Card>
            <CardHeader
              icon={Gauge}
              title="This billing period"
              description={`${formatDate(data.cycleStart)} — ${formatDate(data.cycleEnd)}`}
            />
            <CardBody className="space-y-6">
              {data.metrics.length === 0 && (
                <p className="text-sm text-slate-500">No usage recorded yet. Numbers appear when customers message you on WhatsApp or the website widget.</p>
              )}
              {data.metrics.map((metric) => (
                <ProgressBar
                  key={metric.key}
                  label={`${metric.label} (${metric.unit})`}
                  value={metric.used}
                  max={metric.limit || Math.max(metric.used, 1)}
                  hint={metric.limit ? `${Math.max(0, metric.limit - metric.used)} ${metric.unit} remaining` : `${metric.used} ${metric.unit} used`}
                />
              ))}
            </CardBody>
          </Card>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data.metrics.slice(0, 3).map((metric) => (
              <Card key={metric.key}>
                <CardBody>
                  <p className="text-[0.72rem] font-bold uppercase tracking-wider text-slate-500">{metric.label}</p>
                  <p className="mt-2 font-display text-2xl font-bold tabular-nums text-ink-900">
                    {metric.used}
                    {metric.limit > 0 && <span className="text-base font-semibold text-slate-400"> / {metric.limit}</span>}
                  </p>
                  <p className="mt-1 text-[0.75rem] text-slate-500">
                    {metric.limit > 0
                      ? `${Math.round((metric.used / metric.limit) * 100)}% of your ${metric.unit} allowance`
                      : `Live ${metric.unit} from WhatsApp and the website widget`}
                  </p>
                </CardBody>
              </Card>
            ))}
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" aria-hidden="true" />
            <p className="text-[0.83rem] leading-relaxed text-slate-600">
              Usage is counted from live WhatsApp and website conversations. Plan limits will be
              enforced by the backend once billing is connected.
            </p>
          </div>
        </>
      )}
    </>
  )
}
