import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Building2, Globe, Lock, Mail, Phone, UserRound } from 'lucide-react'
import AuthLayout from '../../components/layout/AuthLayout'
import Button from '../../components/ui/Button'
import { Input, Select } from '../../components/ui/Field'
import PasswordStrength from '../../components/ui/PasswordStrength'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import businessService from '../../services/businessService'
import { emailError } from '../../lib/email'

const initial = {
  fullName: '',
  businessName: '',
  email: '',
  password: '',
  confirmPassword: '',
  businessType: '',
  country: '',
  phone: '',
  website: '',
}

export default function Signup() {
  const { signup } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [reference, setReference] = useState({ businessTypes: [], countries: [] })

  useEffect(() => {
    businessService.getReferenceData().then((data) => {
      setReference(data)
      setForm((prev) => ({
        ...prev,
        businessType: prev.businessType || data.businessTypes[0],
        country: prev.country || data.countries[0],
      }))
    })
  }, [])

  const set = (key) => (e) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!form.fullName.trim()) next.fullName = 'Enter your full name.'
    if (!form.businessName.trim()) next.businessName = 'Enter your business name.'
    const mail = emailError(form.email)
    if (mail) next.email = mail
    if (!form.password) next.password = 'Choose a password.'
    else if (form.password.length < 8) next.password = 'Use at least 8 characters.'
    if (form.confirmPassword !== form.password) next.confirmPassword = 'Passwords do not match.'
    if (!form.phone.trim()) next.phone = 'Enter a contact number.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!validate()) {
      toast.error('Please fix the highlighted fields.')
      return
    }
    setLoading(true)
    try {
      await signup(form)
      toast.success('Account created — a congratulations email is on its way.')
      navigate('/onboarding', { replace: true })
    } catch (error) {
      toast.error(error.message || 'We could not create your account. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      wide
      title="Create your business account"
      description="Set up your AI receptionist in a few minutes — no card required."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-600 underline-offset-4 hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} noValidate className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Full name" icon={UserRound} value={form.fullName} onChange={set('fullName')} error={errors.fullName} autoComplete="name" required />
          <Input label="Business name" icon={Building2} value={form.businessName} onChange={set('businessName')} error={errors.businessName} autoComplete="organization" required />
        </div>

        <Input label="Work email" type="email" icon={Mail} value={form.email} onChange={set('email')} error={errors.email} autoComplete="email" required />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Input label="Password" type="password" icon={Lock} value={form.password} onChange={set('password')} error={errors.password} autoComplete="new-password" required />
            <PasswordStrength value={form.password} className="mt-2" />
          </div>
          <Input label="Confirm password" type="password" icon={Lock} value={form.confirmPassword} onChange={set('confirmPassword')} error={errors.confirmPassword} autoComplete="new-password" required />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select label="Business type" options={reference.businessTypes} value={form.businessType} onChange={set('businessType')} required />
          <Select label="Country" options={reference.countries} value={form.country} onChange={set('country')} required />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input label="Phone number" icon={Phone} value={form.phone} onChange={set('phone')} error={errors.phone} autoComplete="tel" placeholder="+33 4 91 22 18 40" required />
          <Input label="Company website" icon={Globe} value={form.website} onChange={set('website')} hint="Optional" placeholder="https://" />
        </div>

        <Button as="button" type="submit" size="md" loading={loading} className="w-full">
          {loading ? 'Creating account…' : 'Create Account'}
          {!loading && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
        </Button>

        <p className="text-center text-[0.75rem] leading-relaxed text-slate-500">
          By creating an account you agree to the{' '}
          <Link to="/terms" className="font-semibold text-brand-600 underline-offset-4 hover:underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="font-semibold text-brand-600 underline-offset-4 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </AuthLayout>
  )
}
