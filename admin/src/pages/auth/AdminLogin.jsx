import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Lock, Mail } from 'lucide-react'
import AuthLayout from '../../components/layout/AuthLayout'
import Button from '../../components/ui/Button'
import { Checkbox, Input } from '../../components/ui/Field'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { authErrorMessage } from '../../config/api'

const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

export default function AdminLogin() {
  const { login } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ email: '', password: '', remember: true })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const submit = async (e) => {
    e.preventDefault()

    const next = {}
    if (!form.email.trim()) next.email = 'Enter your admin email.'
    else if (!EMAIL_RE.test(form.email.trim().toLowerCase())) next.email = 'Enter a valid email, for example name@business.com.'
    if (!form.password) next.password = 'Enter your password.'
    setErrors(next)
    if (Object.keys(next).length) {
      toast.error(Object.values(next)[0])
      return
    }

    setLoading(true)
    try {
      const session = await login({ email: form.email.trim(), password: form.password })
      toast.success(`Signed in as ${session.admin?.role || 'administrator'}.`)
      navigate(location.state?.from || '/dashboard', { replace: true })
    } catch (error) {
      toast.error(authErrorMessage(error, 'Sign-in failed. Check your credentials and try again.'))
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
        <Input
          label="Admin email"
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
          <Checkbox label="Remember this device" checked={form.remember} onChange={set('remember')} />
          <Link to="/forgot-password" className="text-[0.8rem] font-semibold text-brand-600 underline-offset-4 hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="md" loading={loading} className="w-full">
          {loading ? 'Signing in…' : 'Sign in'}
          {!loading && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
        </Button>
      </form>
    </AuthLayout>
  )
}
