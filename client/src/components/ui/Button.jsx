import { Loader2 } from 'lucide-react'
import cn from '../../lib/cn'

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none whitespace-nowrap'

const variants = {
  primary:
    'rounded-lg bg-primary-400 text-primary-950 shadow-lg shadow-primary-500/30 hover:bg-primary-300 hover:-translate-y-0.5 active:translate-y-0',
  secondary:
    'rounded-lg bg-surface text-ink border border-line hover:border-line-strong hover:bg-surface-2 hover:-translate-y-0.5 active:translate-y-0',
  outline: 'rounded-lg border border-line bg-surface text-muted hover:border-line-strong hover:bg-surface-2 hover:text-ink',
  subtle: 'rounded-lg bg-surface-2 text-muted hover:bg-line hover:text-ink',
  ghost: 'text-muted hover:text-ink hover:bg-surface-2',
  danger: 'rounded-lg bg-rose-600 text-white hover:bg-rose-700',
  dangerGhost: 'text-rose-500 hover:bg-rose-50',
  onDark:
    'rounded-lg bg-primary-400 text-primary-950 hover:bg-primary-300 hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-primary-500/30',
  outlineDark:
    'rounded-lg border border-line-strong text-ink hover:bg-surface-2 hover:border-primary-400 hover:-translate-y-0.5 active:translate-y-0',
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
