import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle2, Lock } from 'lucide-react'
import AuthLayout from '../../components/layout/AuthLayout'
import Button from '../../components/ui/Button'
import { Input } from '../../components/ui/Field'
import PasswordStrength, { scorePassword } from '../../components/ui/PasswordStrength'
import { useToast } from '../../context/ToastContext'
import authService from '../../services/authService'
import { authErrorMessage } from '../../config/api'

export default function ResetPassword() {
  const toast = useToast()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const token = params.get('token') || ''
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
    if (!token) next.token = 'Open the reset link from your email.'
    if (!form.password) next.password = 'Choose a new password.'
    else if (form.password.length < 12) next.password = 'Admin passwords must be at least 12 characters.'
    else if (scorePassword(form.password) < 3) next.password = 'Add uppercase, numbers and symbols.'
    if (form.confirm !== form.password) next.confirm = 'Passwords do not match.'
    setErrors(next)
    if (Object.keys(next).length) {
      toast.error(next.token || next.password || next.confirm)
      return
    }

    setLoading(true)
    try {
      await authService.resetPassword({ password: form.password, token })
      setDone(true)
      toast.success('Password updated. You can sign in now.')
    } catch (error) {
      toast.error(authErrorMessage(error, 'This reset link is invalid or has expired.'))
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <AuthLayout title="Password updated" description="You can now sign in with your new password.">
        <div className="rounded-xl border border-ember-400/30 bg-ember-500/10 p-5">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-ember-500 text-white">
            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="mt-4 text-[0.85rem] leading-relaxed text-ink">
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
        {!token && (
          <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[0.82rem] text-amber-900">
            Open the reset link from your email. This page needs the token from that link.
          </p>
        )}
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
