import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Lock, Mail, ShieldCheck } from 'lucide-react'
import AuthLayout from '../../components/layout/AuthLayout'
import Button from '../../components/ui/Button'
import { Checkbox, Input } from '../../components/ui/Field'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { authErrorMessage } from '../../config/api'
import { emailError } from '../../lib/email'

export default function Login() {
  const { login, verifyLoginOtp } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ email: '', password: '', remember: true })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [challenge, setChallenge] = useState(null)
  const [otp, setOtp] = useState('')

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const validate = () => {
    const next = {}
    const mail = emailError(form.email)
    if (mail) next.email = mail
    if (!form.password) next.password = 'Enter your password.'
    else if (form.password.length < 6) next.password = 'Passwords are at least 6 characters.'
    setErrors(next)
    if (Object.keys(next).length) {
      toast.error(Object.values(next)[0])
      return false
    }
    return true
  }

  const finish = (session) => {
    toast.success(`Welcome back${session?.user?.name ? `, ${session.user.name}` : ''}.`)
    navigate(location.state?.from || '/app/dashboard', { replace: true })
    return session
  }

  const submit = async (e) => {
    e.preventDefault()
    if (challenge) {
      if (!/^\d{6}$/.test(otp.trim())) {
        toast.error('Enter the 6-digit code sent to your email.')
        return
      }
      setLoading(true)
      try {
        finish(await verifyLoginOtp({ challengeId: challenge.challengeId, code: otp.trim() }))
      } catch (error) {
        toast.error(authErrorMessage(error, 'That code is invalid or has expired.'))
      } finally {
        setLoading(false)
      }
      return
    }
    if (!validate()) return
    setLoading(true)
    try {
      const result = await login({ email: form.email.trim(), password: form.password })
      if (result.requiresOtp) {
        setChallenge(result)
        toast.info(`A sign-in code was sent to ${result.emailHint}.`)
        return
      }
      finish(result)
    } catch (error) {
      toast.error(authErrorMessage(error, 'We could not sign you in. Check your details and try again.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title={challenge ? 'Check your email' : 'Sign in to your portal'}
      description={
        challenge
          ? `Enter the 6-digit code we sent to ${challenge.emailHint}.`
          : 'Manage your AI receptionist, conversations and customers.'
      }
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
        {challenge ? (
          <Input
            label="Verification code"
            inputMode="numeric"
            autoComplete="one-time-code"
            icon={ShieldCheck}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
            help="The code expires in 10 minutes."
            required
          />
        ) : (
          <>
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
          </>
        )}

        <Button as="button" type="submit" size="md" loading={loading} className="w-full">
          {loading ? (challenge ? 'Verifying…' : 'Signing in…') : challenge ? 'Verify and sign in' : 'Sign in'}
          {!loading && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
        </Button>

        {challenge && (
          <button
            type="button"
            className="w-full text-center text-[0.8rem] font-semibold text-brand-600 hover:underline"
            onClick={() => {
              setChallenge(null)
              setOtp('')
            }}
          >
            Use a different account
          </button>
        )}
      </form>
    </AuthLayout>
  )
}
