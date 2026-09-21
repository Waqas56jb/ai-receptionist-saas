import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, MailCheck, Mail } from 'lucide-react'
import AuthLayout from '../../components/layout/AuthLayout'
import Button from '../../components/ui/Button'
import { Input } from '../../components/ui/Field'
import { useToast } from '../../context/ToastContext'
import authService from '../../services/authService'
import { authErrorMessage } from '../../config/api'
import { emailError } from '../../lib/email'

export default function ForgotPassword() {
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    const mail = emailError(email)
    if (mail) {
      setError(mail)
      toast.error(mail)
      return
    }
    setError('')
    setLoading(true)
    try {
      await authService.requestPasswordReset({ email })
      setSent(true)
      toast.success('If that account exists, a reset link is on its way.')
    } catch (err) {
      const message = authErrorMessage(err, 'We could not send the reset link. Please try again.')
      setError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <AuthLayout title="Check your inbox" description={`If an account exists for ${email}, a reset link is on its way.`}>
        <div className="rounded-2xl border border-ember-400/30 bg-ember-500/10 p-5">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-ember-500 text-white">
            <MailCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="mt-4 text-[0.875rem] leading-relaxed text-ink">
            The link expires in 30 minutes. If it does not arrive, check your spam folder or try a
            different address.
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-2.5">
          <Button as={Link} to="/login" size="md" className="w-full">
            Back to sign in
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
