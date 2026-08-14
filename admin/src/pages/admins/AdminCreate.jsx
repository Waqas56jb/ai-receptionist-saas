import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, ShieldCheck, UserPlus } from 'lucide-react'
import { cn } from '../../lib/utils'
import PageHeader from '../../components/layout/PageHeader'
import { Card, CardBody, CardFooter, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import Badge from '../../components/ui/Badge'
import { Input, Select } from '../../components/ui/Field'
import PermissionMatrix from '../../components/security/PermissionMatrix'
import { useToast } from '../../context/ToastContext'
import { useAuth } from '../../context/AuthContext'
import adminService from '../../services/adminService'
import { roles, roleById } from '../../config/permissions'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function AdminCreate() {
  const toast = useToast()
  const navigate = useNavigate()
  const { admin } = useAuth()

  const [form, setForm] = useState({ name: '', email: '', roleId: 'operations-admin', status: 'Invited' })
  const [permissions, setPermissions] = useState(roleById('operations-admin').permissions)
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  const selectedRole = roleById(form.roleId)
  const isCustom = form.roleId === 'custom'

  const pickRole = (roleId) => {
    setForm((f) => ({ ...f, roleId }))
    setPermissions(roleById(roleId).permissions)
  }

  const submit = async () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Enter a full name.'
    if (!form.email.trim()) next.email = 'Enter an email address.'
    else if (!emailPattern.test(form.email)) next.email = 'That does not look like a valid email.'
    if (isCustom && permissions.length === 0) next.permissions = 'Select at least one permission.'
    setErrors(next)
    if (Object.keys(next).length) return

    setBusy(true)
    try {
      await adminService.create({ ...form, permissions }, admin?.name)
      toast.success(`Invitation sent to ${form.email}.`)
      navigate('/admins')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <PageHeader
        title="Create administrator"
        breadcrumbs={[{ label: 'Admins', to: '/admins' }, { label: 'Create' }]}
        description="Invite a sub-admin and decide exactly what they can reach."
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          <Card>
            <CardHeader icon={UserPlus} title="Details" />
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Full name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} error={errors.name} required />
                <Input label="Email" type="email" icon={Mail} value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} error={errors.email} required />
              </div>
              <Select
                label="Initial status"
                options={['Invited', 'Active']}
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                help="Invited sends an email; Active grants access immediately."
              />
            </CardBody>
          </Card>

          <Card>
            <CardHeader icon={ShieldCheck} title="Role" description="Pick a preset, or choose Custom Admin and build the permission set yourself." />
            <CardBody>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {roles.map((role) => {
                  const active = form.roleId === role.id
                  return (
                    <label
                      key={role.id}
                      className={cn(
                        'flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-all duration-200',
                        active ? 'border-brand-400 bg-brand-50/60 ring-1 ring-brand-400/40' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50',
                      )}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={role.id}
                        checked={active}
                        onChange={() => pickRole(role.id)}
                        className="mt-0.5 h-4 w-4 shrink-0 border-slate-300 text-brand-600 focus:ring-brand-500/40"
                      />
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="text-[0.86rem] font-semibold text-ink-900">{role.name}</span>
                          <Badge tone={role.id === 'super-admin' ? 'danger' : 'neutral'} size="sm">
                            {role.id === 'custom' ? 'Choose permissions' : `${role.permissions.length} permissions`}
                          </Badge>
                        </span>
                        <span className="mt-1 block text-[0.79rem] leading-relaxed text-slate-500">{role.description}</span>
                      </span>
                    </label>
                  )
                })}
              </div>

              {form.roleId === 'super-admin' && (
                <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-[0.82rem] leading-relaxed text-amber-900">
                  Super Admins can do everything, including creating and removing other admins and
                  enabling maintenance mode. Grant this role sparingly.
                </p>
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Permissions"
              description={isCustom ? 'Select exactly what this admin may do.' : `Preset from the ${selectedRole.name} role — switch to Custom Admin to change it.`}
              action={<Badge tone="brand" size="sm">{permissions.length} selected</Badge>}
            />
            <CardBody>
              {errors.permissions && <p className="mb-3 text-[0.78rem] font-medium text-rose-600">{errors.permissions}</p>}
              <PermissionMatrix value={permissions} onChange={setPermissions} readOnly={!isCustom} />
            </CardBody>
            <CardFooter>
              <Button variant="ghost" size="sm" onClick={() => navigate('/admins')}>
                Cancel
              </Button>
              <Button size="sm" loading={busy} onClick={submit}>
                <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />
                Create admin
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader title="Summary" />
            <CardBody className="space-y-3 text-[0.84rem]">
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Name</span>
                <span className="font-medium text-ink-900">{form.name || '—'}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Email</span>
                <span className="truncate font-medium text-ink-900">{form.email || '—'}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Role</span>
                <span className="font-medium text-ink-900">{selectedRole.name}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Permissions</span>
                <span className="font-medium text-ink-900">{permissions.length}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Status</span>
                <Badge tone={form.status === 'Active' ? 'success' : 'warning'} size="sm">{form.status}</Badge>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="How access works" />
            <CardBody className="space-y-2.5 text-[0.82rem] leading-relaxed text-slate-600">
              <p>Permissions hide what an admin cannot use, and the backend will enforce the same rules on every request.</p>
              <p>Every change to an admin's role or permissions is written to the audit log with your name against it.</p>
            </CardBody>
          </Card>
        </div>
      </div>
    </>
  )
}
