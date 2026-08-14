import { Bell, Mail, MonitorSmartphone } from 'lucide-react'
import PageHeader from '../../../components/layout/PageHeader'
import { Card, CardBody, CardHeader } from '../../../components/ui/Card'
import Toggle from '../../../components/ui/Toggle'
import { ErrorState } from '../../../components/ui/States'
import useAsync from '../../../hooks/useAsync'
import { useToast } from '../../../context/ToastContext'
import notificationService from '../../../services/notificationService'
import { notificationLabels } from '../../../data/mock/platform'

export default function NotificationSettings() {
  const toast = useToast()
  const preferences = useAsync(() => notificationService.getPreferences(), [])

  const update = async (group, key, value) => {
    preferences.setData(await notificationService.updatePreferences(group, key, value))
    toast.success('Notification preferences updated.')
  }

  if (preferences.error) {
    return (
      <Card>
        <ErrorState onRetry={preferences.reload} />
      </Card>
    )
  }

  const prefs = preferences.data

  return (
    <>
      <PageHeader
        title="Notifications"
        description="Choose what you want to hear about, and where."
      />

      {preferences.loading && <div className="h-72 animate-pulse rounded-2xl bg-slate-100" />}

      {prefs && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <Card>
            <CardHeader icon={Mail} title="Email notifications" description="Sent to your account email address." />
            <CardBody className="space-y-5">
              {Object.entries(prefs.email).map(([key, value]) => (
                <Toggle
                  key={key}
                  checked={value}
                  onChange={(v) => update('email', key, v)}
                  label={notificationLabels[key]?.title || key}
                  description={notificationLabels[key]?.description}
                />
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader icon={MonitorSmartphone} title="In-app notifications" description="Shown in the bell menu inside the portal." />
            <CardBody className="space-y-5">
              {Object.entries(prefs.inApp).map(([key, value]) => (
                <Toggle
                  key={key}
                  checked={value}
                  onChange={(v) => update('inApp', key, v)}
                  label={notificationLabels[key]?.title || key}
                  description={notificationLabels[key]?.description}
                />
              ))}
            </CardBody>
          </Card>

          <Card className="xl:col-span-2">
            <CardHeader icon={Bell} title="Quiet hours" description="Notifications are still recorded — they simply do not interrupt you." />
            <CardBody>
              <p className="text-[0.85rem] leading-relaxed text-slate-600">
                Quiet hours follow your business hours. Anything urgent — a human escalation or an AI
                error — is always delivered immediately.
              </p>
            </CardBody>
          </Card>
        </div>
      )}
    </>
  )
}
