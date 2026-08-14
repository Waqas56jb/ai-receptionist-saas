import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AlertTriangle, ArrowRight, Lock, Mail } from 'lucide-react'
import AuthLayout from '../../components/layout/AuthLayout'
import Button from '../../components/ui/Button'
import { Checkbox, Input } from '../../components/ui/Field'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ email: 'camille@harbourview.example.com', password: 'demo1234', remember: true })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.email.trim()) next.email = 'Enter your email address.'
    else if (!emailPattern.test(form.email)) next.email = 'That does not look like a valid email.'
    if (!form.password) next.password = 'Enter your password.'
    else if (form.password.length < 6) next.password = 'Passwords are at least 6 characters.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!validate()) return
    setLoading(true)
    try {
      await login({ email: form.email })
      toast.success('Welcome back!')
      navigate(location.state?.from || '/app/dashboard', { replace: true })
    } catch {
      setFormError('We could not sign you in. Please check your details and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Sign in to your portal"
      description="Manage your AI receptionist, conversations and customers."
      footer={
        <>
          New here?{' '}
          <Link to="/signup" className="font-semibold text-brand-600 underline-offset-4 hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="space-y-4">
        {formError && (
          <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5" role="alert">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" aria-hidden="true" />
            <p className="text-[0.82rem] leading-relaxed text-rose-700">{formError}</p>
          </div>
        )}

        <Input
          label="Email address"
          type="email"
          autoComplete="email"
          icon={Mail}
          value={form.email}
          onChange={set('email')}
          error={errors.email}
          required
        />

        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          icon={Lock}
          value={form.password}
          onChange={set('password')}
          error={errors.password}
          required
        />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <Checkbox label="Remember me" checked={form.remember} onChange={set('remember')} />
          <Link to="/forgot-password" className="text-[0.8rem] font-semibold text-brand-600 underline-offset-4 hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button as="button" type="submit" size="md" loading={loading} className="w-full">
          {loading ? 'Signing in…' : 'Sign in'}
          {!loading && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
        </Button>

        <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center text-[0.75rem] leading-relaxed text-slate-500">
          Demo build — the fields are pre-filled and any credentials will sign you in. No real
          authentication runs until the backend milestone.
        </p>
      </form>
    </AuthLayout>
  )
}
