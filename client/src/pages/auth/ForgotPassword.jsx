import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, MailCheck, Mail } from 'lucide-react'
import AuthLayout from '../../components/layout/AuthLayout'
import Button from '../../components/ui/Button'
import { Input } from '../../components/ui/Field'
import authService from '../../services/authService'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!email.trim()) return setError('Enter your email address.')
    if (!emailPattern.test(email)) return setError('That does not look like a valid email.')
    setError('')
    setLoading(true)
    try {
      await authService.requestPasswordReset({ email })
      setSent(true)
    } catch {
      setError('We could not send the reset link. Please try again.')
    } finally {
      setLoading(false)
    }
    return undefined
  }

  if (sent) {
    return (
      <AuthLayout title="Check your inbox" description={`If an account exists for ${email}, a reset link is on its way.`}>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-5">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
            <MailCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="mt-4 text-[0.875rem] leading-relaxed text-emerald-900">
            The link expires in 30 minutes. If it does not arrive, check your spam folder or try a
            different address.
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-2.5">
          <Button as={Link} to="/reset-password" size="md" className="w-full">
            Open reset page
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button as="button" variant="ghost" size="md" className="w-full" onClick={() => setSent(false)}>
            Use a different email
          </Button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Reset your password"
      description="Enter the email you use to sign in and we will send you a reset link."
      footer={
        <Link to="/login" className="inline-flex items-center gap-1.5 font-semibold text-brand-600 underline-offset-4 hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={submit} noValidate className="space-y-4">
        <Input
          label="Email address"
          type="email"
          icon={Mail}
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setError('')
          }}
          error={error}
          required
        />
        <Button as="button" type="submit" size="md" loading={loading} className="w-full">
          {loading ? 'Sending…' : 'Send Reset Link'}
        </Button>
      </form>
    </AuthLayout>
  )
}
