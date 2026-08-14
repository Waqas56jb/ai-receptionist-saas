import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle2, Lock } from 'lucide-react'
import AuthLayout from '../../components/layout/AuthLayout'
import Button from '../../components/ui/Button'
import { Input } from '../../components/ui/Field'
import PasswordStrength, { scorePassword } from '../../components/ui/PasswordStrength'
import authService from '../../services/authService'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const set = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const submit = async (e) => {
    e.preventDefault()
    const next = {}
    if (!form.password) next.password = 'Choose a new password.'
    else if (form.password.length < 12) next.password = 'Admin passwords must be at least 12 characters.'
    else if (scorePassword(form.password) < 3) next.password = 'Add uppercase, numbers and symbols.'
    if (form.confirm !== form.password) next.confirm = 'Passwords do not match.'
    setErrors(next)
    if (Object.keys(next).length) return

    setLoading(true)
    try {
      await authService.resetPassword(form)
      setDone(true)
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <AuthLayout title="Password updated" description="You can now sign in with your new password.">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-5">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="mt-4 text-[0.85rem] leading-relaxed text-emerald-900">
            Every other admin session has been signed out and the change was written to the audit log.
          </p>
        </div>
        <Button size="md" className="mt-5 w-full" onClick={() => navigate('/login')}>
          Go to sign in
        </Button>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Choose a new password"
      description="Admin accounts require at least 12 characters with mixed case, numbers and symbols."
      footer={
        <Link to="/login" className="font-semibold text-brand-300 underline-offset-4 hover:underline">
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={submit} noValidate className="space-y-4">
        <div>
          <Input label="New password" type="password" icon={Lock} autoComplete="new-password" value={form.password} onChange={set('password')} error={errors.password} required />
          <PasswordStrength value={form.password} className="mt-2" />
        </div>
        <Input label="Confirm new password" type="password" icon={Lock} autoComplete="new-password" value={form.confirm} onChange={set('confirm')} error={errors.confirm} required />
        <Button type="submit" size="md" loading={loading} className="w-full">
          {loading ? 'Updating…' : 'Update password'}
        </Button>
      </form>
    </AuthLayout>
  )
}
