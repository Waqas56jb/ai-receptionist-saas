import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

const base =
  'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none whitespace-nowrap'

const variants = {
  primary:
    'bg-primary-400 text-primary-950 shadow-lg shadow-primary-500/30 hover:bg-primary-300 hover:-translate-y-0.5',
  secondary: 'bg-surface text-ink border border-line hover:border-line-strong hover:bg-surface-2',
  outline: 'border border-line bg-surface text-muted hover:border-line-strong hover:bg-surface-2 hover:text-ink',
  subtle: 'bg-surface-2 text-muted hover:bg-line hover:text-ink',
  ghost: 'text-muted hover:text-ink hover:bg-surface-2',
  danger: 'bg-rose-600 text-white hover:bg-rose-700',
  dangerGhost: 'text-rose-500 hover:bg-rose-50',
  onDark: 'bg-primary-400 text-primary-950 hover:bg-primary-300 shadow-lg shadow-primary-500/30',
}

const sizes = {
  xs: 'h-8 px-3 text-[0.78rem]',
  sm: 'h-9 px-4 text-[0.83rem]',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-[0.95rem]',
}

export default function Button({
  as = 'button',
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
