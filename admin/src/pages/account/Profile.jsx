import { useState } from 'react'
import { Link } from 'react-router-dom'
import { KeyRound, Save, ShieldCheck, UserRound } from 'lucide-react'
import { formatDateTime } from '../../lib/utils'
import PageHeader from '../../components/layout/PageHeader'
import { Card, CardBody, CardFooter, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge, { StatusBadge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Field'
import PasswordStrength, { scorePassword } from '../../components/ui/PasswordStrength'
import { Avatar } from '../../components/ui/Misc'
import PermissionMatrix from '../../components/security/PermissionMatrix'
import { useAsync } from '../../hooks'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import authService from '../../services/authService'
import adminService from '../../services/adminService'

export default function Profile() {
  const toast = useToast()
  const { admin, role, setAdmin } = useAuth()
  const sessions = useAsync(() => adminService.getSessions(admin?.id), [admin?.id])

  const [form, setForm] = useState({ name: admin?.name || '', email: admin?.email || '' })
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  const changePassword = async () => {
    const next = {}
    if (!passwords.current) next.current = 'Enter your current password.'
    if (!passwords.next) next.next = 'Choose a new password.'
    else if (passwords.next.length < 12) next.next = 'Admin passwords must be at least 12 characters.'
    else if (scorePassword(passwords.next) < 3) next.next = 'Add uppercase, numbers and symbols.'
    if (passwords.confirm !== passwords.next) next.confirm = 'Passwords do not match.'
    setErrors(next)
    if (Object.keys(next).length) return

    setBusy(true)
    try {
      await authService.changePassword(passwords)
      setPasswords({ current: '', next: '', confirm: '' })
      toast.success('Password changed. Other sessions were signed out.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Your profile"
        description="Your administrator account and what it can reach."
        badge={<Badge tone="brand"><ShieldCheck className="h-3 w-3" aria-hidden="true" />{role?.name}</Badge>}
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <Card>
            <CardHeader icon={UserRound} title="Details" />
            <CardBody>
              <div className="flex items-center gap-3.5">
                <Avatar name={admin?.name} size="lg" />
                <div className="min-w-0">
                  <h2 className="truncate font-display text-[1.05rem] font-semibold text-ink-900">{admin?.name}</h2>
                  <p className="truncate text-[0.8rem] text-slate-500">{role?.name}</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Full name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                <Input label="Email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
              </div>
            </CardBody>
            <CardFooter>
              <Button
                size="sm"
                onClick={() => {
                  setAdmin(form)
                  toast.success('Profile updated.')
                }}
              >
                <Save className="h-3.5 w-3.5" aria-hidden="true" />
                Save profile
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader icon={KeyRound} title="Change password" description="Admin passwords must be at least 12 characters." />
            <CardBody className="space-y-4">
              <Input label="Current password" type="password" autoComplete="current-password" value={passwords.current} onChange={(e) => setPasswords((p) => ({ ...p, current: e.target.value }))} error={errors.current} />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Input label="New password" type="password" autoComplete="new-password" value={passwords.next} onChange={(e) => setPasswords((p) => ({ ...p, next: e.target.value }))} error={errors.next} />
                  <PasswordStrength value={passwords.next} className="mt-2" />
                </div>
                <Input label="Confirm new password" type="password" autoComplete="new-password" value={passwords.confirm} onChange={(e) => setPasswords((p) => ({ ...p, confirm: e.target.value }))} error={errors.confirm} />
              </div>
            </CardBody>
            <CardFooter>
              <Button size="sm" loading={busy} onClick={changePassword}>
                Change password
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader icon={ShieldCheck} title="Your permissions" description="What your role allows you to do." />
            <CardBody>
              <PermissionMatrix value={admin?.permissions || []} readOnly />
            </CardBody>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Account" />
            <CardBody className="divide-y divide-slate-100 py-0">
              {[
                ['Role', role?.name],
                ['Status', <StatusBadge key="s" status={admin?.status} />],
                ['Two-factor', <Badge key="t" tone={admin?.twoFactor ? 'success' : 'warning'} size="sm">{admin?.twoFactor ? 'Enabled' : 'Disabled'}</Badge>],
                ['Permissions', admin?.permissions?.length || 0],
                ['Last login', admin?.lastLogin ? formatDateTime(admin.lastLogin) : '—'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between gap-4 py-2.5">
                  <span className="text-[0.82rem] text-slate-500">{label}</span>
                  <span className="text-[0.84rem] font-medium text-ink-900">{value}</span>
                </div>
              ))}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Your sessions" />
            <CardBody className="p-0">
              <ul className="divide-y divide-slate-100">
                {(sessions.data || []).map((s) => (
                  <li key={s.id} className="px-5 py-3">
                    <p className="flex items-center gap-2 text-[0.83rem] font-semibold text-ink-900">
                      {s.device}
                      {s.current && <Badge tone="success" size="sm">This device</Badge>}
                    </p>
                    <p className="text-[0.73rem] text-slate-500">{s.location} · {formatDateTime(s.lastActive)}</p>
                  </li>
                ))}
                {sessions.data?.length === 0 && <li className="px-5 py-6 text-center text-[0.82rem] text-slate-500">No other sessions.</li>}
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <p className="text-[0.83rem] leading-relaxed text-slate-600">
                Need broader access? Only a Super Admin can change your role or permissions.
              </p>
              <Button as={Link} to="/security" variant="outline" size="sm" className="mt-4 w-full">
                Open security centre
              </Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  )
}
