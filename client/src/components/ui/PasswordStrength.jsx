import cn from '../../lib/cn'

const levels = [
  { label: 'Too weak', tone: 'bg-rose-500', text: 'text-rose-600' },
  { label: 'Weak', tone: 'bg-amber-500', text: 'text-amber-600' },
  { label: 'Fair', tone: 'bg-amber-400', text: 'text-amber-600' },
  { label: 'Strong', tone: 'bg-primary-500', text: 'text-primary-500' },
  { label: 'Very strong', tone: 'bg-ember-500', text: 'text-ember-500' },
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
          <span key={i} className={cn('h-1 flex-1 rounded-full transition-colors', i <= score - 1 ? level.tone : 'bg-slate-200')} />
        ))}
      </div>
      <p className={cn('mt-1.5 text-[0.72rem] font-semibold', level.text)}>
        Password strength: {level.label}
      </p>
    </div>
  )
}
