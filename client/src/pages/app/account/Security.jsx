import { useState } from 'react'
import { Link } from 'react-router-dom'
import { History, KeyRound, LogOut, Radio, ShieldCheck, Smartphone } from 'lucide-react'
import PageHeader from '../../../components/layout/PageHeader'
import { Card, CardBody, CardHeader } from '../../../components/ui/Card'
import Badge, { StatusBadge } from '../../../components/ui/Badge'
import Button from '../../../components/ui/Button'
import Toggle from '../../../components/ui/Toggle'
import Modal from '../../../components/ui/Modal'
import { Input } from '../../../components/ui/Field'
import { ErrorState } from '../../../components/ui/States'
import useAsync from '../../../hooks/useAsync'
import { useToast } from '../../../context/ToastContext'
import authService from '../../../services/authService'
import businessService from '../../../services/businessService'
import channelService from '../../../services/channelService'
import { formatDateTime } from '../../../lib/format'

export default function Security() {
  const toast = useToast()
  const profile = useAsync(() => businessService.getProfile(), [])
  const sessions = useAsync(() => authService.getSessions(), [])
  const history = useAsync(() => authService.getLoginHistory(), [])
  const channels = useAsync(() => channelService.list(), [])
  const [otpOpen, setOtpOpen] = useState(false)
  const [disableOpen, setDisableOpen] = useState(false)
  const [challenge, setChallenge] = useState(null)
  const [code, setCode] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)

  if (profile.error) {
    return (
      <Card>
        <ErrorState onRetry={profile.reload} />
      </Card>
    )
  }

  return (
    <>
      <PageHeader title="Security" description="Protect your account and see exactly what is connected to it." />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <Card>
            <CardHeader icon={KeyRound} title="Password" description="Last changed 3 months ago." />
            <CardBody>
              <p className="text-[0.85rem] leading-relaxed text-slate-600">
                Use a unique password of at least 12 characters. Changing it signs out every other device.
              </p>
              <Button as={Link} to="/app/settings/profile" variant="secondary" size="sm" className="mt-4">
                Change password
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardHeader icon={Smartphone} title="Two-factor authentication" description="An extra email code at every sign-in." />
            <CardBody>
              {profile.data && (
                <Toggle
                  checked={Boolean(profile.data.twoFactor)}
                  onChange={async (v) => {
                    if (v) {
                      setBusy(true)
                      try {
                        const next = await authService.startTwoFactor()
                        setChallenge(next)
                        setCode('')
                        setOtpOpen(true)
                        toast.info(`A verification code was sent to ${next.emailHint}.`)
                      } catch (error) {
                        toast.error(error.message || 'Could not send the verification code.')
                      } finally {
                        setBusy(false)
                      }
                      return
                    }
                    setPassword('')
                    setDisableOpen(true)
                  }}
                  label={profile.data.twoFactor ? 'Two-factor authentication is on' : 'Two-factor authentication is off'}
                  description="A 6-digit code is emailed to your account address at every sign-in."
                />
              )}
              {profile.data && !profile.data.twoFactor && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50/70 p-4">
                  <p className="text-[0.82rem] leading-relaxed text-amber-900">
                    Your account is protected by a password only. Turning on two-factor authentication is
                    the single biggest improvement you can make.
                  </p>
                </div>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader icon={History} title="Login history" description="Recent sign-in attempts on your account." />
            <CardBody className="p-0 sm:p-0">
              <ul className="divide-y divide-slate-100">
                {(history.data || []).map((entry) => (
                  <li key={entry.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
                    <div className="min-w-0">
                      <p className="text-[0.83rem] font-semibold text-ink-900">{entry.device}</p>
                      <p className="text-[0.75rem] text-slate-500">
                        {entry.location} · {formatDateTime(entry.at)}
                      </p>
                    </div>
                    <StatusBadge status={entry.result} size="sm" />
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader icon={ShieldCheck} title="Active sessions" />
            <CardBody className="space-y-3">
              {(sessions.data || []).map((s) => (
                <div key={s.id} className="rounded-xl border border-slate-200 p-3.5">
                  <p className="flex items-center gap-2 text-[0.83rem] font-semibold text-ink-900">
                    {s.device}
                    {s.current && <Badge tone="success" size="sm">This device</Badge>}
                  </p>
                  <p className="mt-0.5 text-[0.75rem] text-slate-500">{s.location}</p>
                  <p className="text-[0.72rem] text-slate-400">Last active {formatDateTime(s.lastActive)}</p>
                </div>
              ))}
              <Button
                as="button"
                variant="outline"
                size="sm"
                className="w-full"
                onClick={async () => {
                  sessions.setData(await authService.revokeAllSessions())
                  toast.success('All other sessions signed out.')
                }}
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                Log out all other sessions
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardHeader icon={Radio} title="Connected channels" description="Third-party accounts linked to this business." />
            <CardBody>
              <ul className="space-y-2.5">
                {(channels.data || []).map((c) => (
                  <li key={c.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3">
                    <div className="min-w-0">
                      <p className="text-[0.83rem] font-semibold text-ink-900">{c.name}</p>
                      <p className="truncate text-[0.72rem] text-slate-500">{c.provider}</p>
                    </div>
                    <Badge tone={c.connected ? 'success' : 'neutral'} size="sm" dot>
                      {c.connected ? 'Connected' : 'Not connected'}
                    </Badge>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Credentials and secrets" />
            <CardBody>
              <p className="text-[0.82rem] leading-relaxed text-slate-600">
                Provider secrets — Twilio tokens, Meta app secrets and access tokens — are stored by your
                backend and never displayed in full again. This portal only ever shows a masked preview,
                and never writes them to browser storage.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>

      <Modal
        open={otpOpen}
        onClose={() => setOtpOpen(false)}
        title="Confirm two-factor authentication"
        description={challenge ? `Enter the code sent to ${challenge.emailHint}.` : 'Enter the email code.'}
        footer={
          <Button
            as="button"
            size="sm"
            loading={busy}
            onClick={async () => {
              if (!/^\d{6}$/.test(code.trim())) {
                toast.error('Enter the 6-digit code.')
                return
              }
              setBusy(true)
              try {
                profile.setData(await authService.confirmTwoFactor({ challengeId: challenge.challengeId, code: code.trim() }))
                setOtpOpen(false)
                toast.success('Two-factor authentication is on. The next sign-in will ask for an email code.')
              } catch (error) {
                toast.error(error.message || 'That code is invalid or has expired.')
              } finally {
                setBusy(false)
              }
            }}
          >
            Enable two-factor
          </Button>
        }
      >
        <Input
          label="Verification code"
          inputMode="numeric"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
        />
      </Modal>

      <Modal
        open={disableOpen}
        onClose={() => setDisableOpen(false)}
        title="Turn off two-factor authentication"
        description="Enter your current password to confirm."
        footer={
          <Button
            as="button"
            size="sm"
            loading={busy}
            onClick={async () => {
              if (!password) {
                toast.error('Enter your current password.')
                return
              }
              setBusy(true)
              try {
                profile.setData(await authService.disableTwoFactor({ password }))
                setDisableOpen(false)
                toast.success('Two-factor authentication is off.')
              } catch (error) {
                toast.error(error.message || 'Could not turn off two-factor authentication.')
              } finally {
                setBusy(false)
              }
            }}
          >
            Turn off
          </Button>
        }
      >
        <Input label="Current password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </Modal>
    </>
  )
}
