import { cn } from '../../lib/utils'

const levels = [
  { label: 'Too weak', bar: 'bg-rose-500', text: 'text-rose-600' },
  { label: 'Weak', bar: 'bg-amber-500', text: 'text-amber-600' },
  { label: 'Fair', bar: 'bg-amber-400', text: 'text-amber-600' },
  { label: 'Strong', bar: 'bg-emerald-500', text: 'text-emerald-600' },
  { label: 'Very strong', bar: 'bg-emerald-600', text: 'text-emerald-700' },
]

export function scorePassword(value = '') {
  let score = 0
  if (value.length >= 8) score += 1
  if (value.length >= 12) score += 1
  if (/[A-Z]/.test(value) && /[a-z]/.test(value)) score += 1
  if (/\d/.test(value)) score += 1
  if (/[^A-Za-z0-9]/.test(value)) score += 1
  return Math.min(score, 4)
}

export default function PasswordStrength({ value = '', className = '' }) {
  if (!value) return null
  const score = scorePassword(value)
  const level = levels[score]

  return (
    <div className={className}>
      <div className="flex gap-1.5" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={cn('h-1 flex-1 rounded-full transition-colors', i <= score - 1 ? level.bar : 'bg-slate-200')} />
        ))}
      </div>
      <p className={cn('mt-1.5 text-[0.72rem] font-semibold', level.text)}>Password strength: {level.label}</p>
    </div>
  )
}
