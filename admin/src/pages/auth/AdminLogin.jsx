import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AlertTriangle, ArrowRight, Lock, Mail } from 'lucide-react'
import AuthLayout from '../../components/layout/AuthLayout'
import Button from '../../components/ui/Button'
import { Checkbox, Input } from '../../components/ui/Field'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function AdminLogin() {
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ email: 'admin@gmail.com', password: 'admin@123!', remember: true })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setFormError('')

    const next = {}
    if (!form.email.trim()) next.email = 'Enter your admin email.'
    else if (!emailPattern.test(form.email)) next.email = 'That does not look like a valid email.'
    if (!form.password) next.password = 'Enter your password.'
    setErrors(next)
    if (Object.keys(next).length) return

    setLoading(true)
    try {
      const session = await login({ email: form.email, password: form.password })
      toast.success(`Signed in as ${session.admin.role}.`)
      navigate(location.state?.from || '/dashboard', { replace: true })
    } catch {
      setFormError('Sign-in failed. Check your credentials and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title="Admin sign in"
      description="Private control centre for the AI receptionist platform."
      footer="Access is restricted to invited administrators — there is no public signup."
    >
      <form onSubmit={submit} noValidate className="space-y-4">
        {formError && (
          <div className="flex items-start gap-2.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5" role="alert">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" aria-hidden="true" />
            <p className="text-[0.82rem] leading-relaxed text-rose-700">{formError}</p>
          </div>
        )}

        <Input label="Admin email" type="email" autoComplete="email" icon={Mail} value={form.email} onChange={set('email')} error={errors.email} required />
        <Input label="Password" type="password" autoComplete="current-password" icon={Lock} value={form.password} onChange={set('password')} error={errors.password} required />

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <Checkbox label="Remember this device" checked={form.remember} onChange={set('remember')} />
          <Link to="/forgot-password" className="text-[0.8rem] font-semibold text-brand-600 underline-offset-4 hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="md" loading={loading} className="w-full">
          {loading ? 'Signing in…' : 'Sign in'}
          {!loading && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
        </Button>

        <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center text-[0.74rem] leading-relaxed text-slate-500">
          Demo login: <span className="font-semibold text-ink-900">admin@gmail.com</span> /{' '}
          <span className="font-semibold text-ink-900">admin@123!</span>
        </p>
      </form>
    </AuthLayout>
  )
}
