import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ImageIcon, LogOut, Save, Shield, UserRound } from 'lucide-react'
import PageHeader from '../../../components/layout/PageHeader'
import { Card, CardBody, CardFooter, CardHeader } from '../../../components/ui/Card'
import Button from '../../../components/ui/Button'
import Avatar from '../../../components/ui/Avatar'
import Badge from '../../../components/ui/Badge'
import { Input } from '../../../components/ui/Field'
import PasswordStrength, { scorePassword } from '../../../components/ui/PasswordStrength'
import { ErrorState } from '../../../components/ui/States'
import useAsync from '../../../hooks/useAsync'
import { useToast } from '../../../context/ToastContext'
import { useAuth } from '../../../context/AuthContext'
import businessService from '../../../services/businessService'
import authService from '../../../services/authService'
import { formatDateTime } from '../../../lib/format'
import { emailError } from '../../../lib/email'

export default function ProfileSettings() {
  const toast = useToast()
  const { updateUser } = useAuth()
  const profile = useAsync(() => businessService.getProfile(), [])
  const sessions = useAsync(() => authService.getSessions(), [])

  const [saving, setSaving] = useState(false)
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [changing, setChanging] = useState(false)

  const setField = (key) => (e) => profile.setData((prev) => ({ ...prev, [key]: e.target.value }))

  const save = async () => {
    const mail = emailError(profile.data?.email)
    if (mail) {
      toast.error(mail)
      return
    }
    if (!String(profile.data?.name || '').trim()) {
      toast.error('Enter your full name.')
      return
    }
    setSaving(true)
    try {
      const next = await businessService.updateProfile(profile.data)
      profile.setData(next)
      updateUser({ name: next.name, email: next.email, phone: next.phone })
      toast.success('Profile updated.')
    } catch (error) {
      toast.error(error.message || 'Could not save your profile.')
    } finally {
      setSaving(false)
    }
  }

  const changePassword = async () => {
    const next = {}
    if (!passwords.current) next.current = 'Enter your current password.'
    if (!passwords.next) next.next = 'Choose a new password.'
    else if (passwords.next.length < 8) next.next = 'Use at least 8 characters.'
    else if (scorePassword(passwords.next) < 2) next.next = 'Add numbers or symbols to strengthen it.'
    if (passwords.confirm !== passwords.next) next.confirm = 'Passwords do not match.'
    setErrors(next)
    if (Object.keys(next).length) return

    setChanging(true)
    try {
      await authService.changePassword(passwords)
      setPasswords({ current: '', next: '', confirm: '' })
      toast.success('Password changed.')
    } catch (error) {
      toast.error(error.message || 'Could not change your password.')
    } finally {
      setChanging(false)
    }
  }

  if (profile.error) {
    return (
      <Card>
        <ErrorState onRetry={profile.reload} />
      </Card>
    )
  }

  return (
    <>
      <PageHeader title="Profile" description="Your personal details and sign-in security." />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <Card>
            <CardHeader icon={UserRound} title="Personal details" />
            <CardBody className="space-y-4">
              {profile.loading ? (
                <div className="h-40 animate-pulse rounded-xl bg-slate-100" />
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                    <Avatar name={profile.data?.name || ''} size="lg" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[0.85rem] font-semibold text-ink-900">Profile image</p>
                      <p className="mt-0.5 text-[0.78rem] text-slate-500">JPG or PNG, at least 200×200.</p>
                    </div>
                    <Button as="button" variant="outline" size="sm" onClick={() => toast.info('Image upload arrives with the storage backend.')}>
                      <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
                      Upload
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Input label="Full name" value={profile.data?.name || ''} onChange={setField('name')} />
                    <Input label="Email" type="email" value={profile.data?.email || ''} onChange={setField('email')} />
                    <Input label="Phone" value={profile.data?.phone || ''} onChange={setField('phone')} />
                    <div>
                      <p className="mb-1.5 text-[0.8rem] font-semibold text-ink-900">Role</p>
                      <Badge tone="brand">{profile.data?.role || 'Owner'}</Badge>
                    </div>
                  </div>
                </>
              )}
            </CardBody>
            <CardFooter>
              <Button as="button" size="sm" loading={saving} onClick={save}>
                <Save className="h-3.5 w-3.5" aria-hidden="true" />
                Save profile
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader icon={Shield} title="Change password" description="You will stay signed in on this device." />
            <CardBody className="space-y-4">
              <Input
                label="Current password"
                type="password"
                autoComplete="current-password"
                value={passwords.current}
                onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))}
                error={errors.current}
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Input
                    label="New password"
                    type="password"
                    autoComplete="new-password"
                    value={passwords.next}
                    onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))}
                    error={errors.next}
                  />
                  <PasswordStrength value={passwords.next} className="mt-2" />
                </div>
                <Input
                  label="Confirm new password"
                  type="password"
                  autoComplete="new-password"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))}
                  error={errors.confirm}
                />
              </div>
            </CardBody>
            <CardFooter>
              <Button as="button" size="sm" loading={changing} onClick={changePassword}>
                Change password
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Active sessions" description="Devices currently signed in to your account." />
            <CardBody className="space-y-3">
              {(sessions.data || []).map((s) => (
                <div key={s.id} className="flex items-start justify-between gap-3 rounded-xl border border-slate-200 p-3.5">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-[0.83rem] font-semibold text-ink-900">
                      {s.device}
                      {s.current && <Badge tone="success" size="sm">This device</Badge>}
                    </p>
                    <p className="mt-0.5 text-[0.75rem] text-slate-500">
                      {s.location} · {s.ip}
                    </p>
                    <p className="text-[0.72rem] text-slate-400">Last active {formatDateTime(s.lastActive)}</p>
                  </div>
                  {!s.current && (
                    <button
                      type="button"
                      onClick={async () => {
                        sessions.setData(await authService.revokeSession(s.id))
                        toast.success('Session revoked.')
                      }}
                      className="shrink-0 text-[0.75rem] font-semibold text-rose-600 hover:underline"
                    >
                      Revoke
                    </button>
                  )}
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
            <CardHeader title="Security" />
            <CardBody>
              <p className="text-[0.83rem] leading-relaxed text-slate-600">
                Two-factor authentication, login history and connected channels live on the security page.
              </p>
              <Button as={Link} to="/app/settings/security" variant="outline" size="sm" className="mt-4 w-full">
                Open security settings
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  )
}
