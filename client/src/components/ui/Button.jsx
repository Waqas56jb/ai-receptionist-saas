import { Loader2 } from 'lucide-react'
import cn from '../../lib/cn'

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none whitespace-nowrap'

const variants = {
  primary:
    'rounded-lg bg-[#0066FF] text-white shadow-lg shadow-[#0066FF]/30 hover:bg-[#FF7A00] hover:-translate-y-0.5 active:translate-y-0',
  secondary:
    'rounded-lg bg-surface text-ink border border-line hover:border-[#FF7A00] hover:bg-[#FF7A00] hover:text-white hover:-translate-y-0.5 active:translate-y-0',
  outline: 'rounded-lg border border-line bg-surface text-muted hover:border-[#FF7A00] hover:bg-[#FF7A00] hover:text-white',
  subtle: 'rounded-lg bg-surface-2 text-muted hover:bg-[#FF7A00] hover:text-white',
  ghost: 'text-muted hover:text-white hover:bg-[#FF7A00]',
  danger: 'rounded-lg bg-rose-600 text-white hover:bg-rose-700',
  dangerGhost: 'text-rose-500 hover:bg-rose-50',
  accent:
    'rounded-lg bg-ember-500 text-white shadow-lg shadow-ember-500/30 hover:bg-ember-400 hover:-translate-y-0.5 active:translate-y-0',
  onDark:
    'rounded-lg bg-ember-500 text-white hover:bg-ember-400 hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-ember-500/30',
  outlineDark:
    'rounded-lg border border-line-strong text-ink hover:bg-[#FF7A00] hover:border-[#FF7A00] hover:text-white hover:-translate-y-0.5 active:translate-y-0',
}

const sizes = {
  xs: 'h-8 px-3 text-[0.8rem]',
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-[0.95rem] sm:h-[3.25rem] sm:px-7 sm:text-base',
}

export default function Button({
  as = 'a',
  type,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  children,
  ...props
}) {
  const Tag = as
  const isButton = Tag === 'button'

  return (
    <Tag
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={isButton ? disabled || loading : undefined}
      type={isButton ? type || 'button' : undefined}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </Tag>
  )
}
