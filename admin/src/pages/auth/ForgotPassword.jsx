import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Mail, MailCheck } from 'lucide-react'
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
    if (!email.trim()) return setError('Enter your admin email.')
    if (!emailPattern.test(email)) return setError('That does not look like a valid email.')
    setError('')
    setLoading(true)
    try {
      await authService.requestPasswordReset({ email })
      setSent(true)
    } finally {
      setLoading(false)
    }
    return undefined
  }

  if (sent) {
    return (
      <AuthLayout title="Check your inbox" description={`If an admin account exists for ${email}, a reset link is on its way.`}>
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-5">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
            <MailCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="mt-4 text-[0.85rem] leading-relaxed text-emerald-900">
            The link expires in 30 minutes. Password resets on admin accounts are recorded in the audit log.
          </p>
        </div>
        <div className="mt-5 flex flex-col gap-2.5">
          <Button as={Link} to="/reset-password" size="md" className="w-full">
            Open reset page
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="md" className="w-full" onClick={() => setSent(false)}>
            Use a different email
          </Button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Reset admin password"
      description="We will email a reset link to the address on your admin account."
      footer={
        <Link to="/login" className="inline-flex items-center gap-1.5 font-semibold text-brand-300 underline-offset-4 hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Back to sign in
        </Link>
      }
    >
      <form onSubmit={submit} noValidate className="space-y-4">
        <Input
          label="Admin email"
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
        <Button type="submit" size="md" loading={loading} className="w-full">
          {loading ? 'Sending…' : 'Send Reset Link'}
        </Button>
      </form>
    </AuthLayout>
  )
}
