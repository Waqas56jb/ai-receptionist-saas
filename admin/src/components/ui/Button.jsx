import { Loader2 } from 'lucide-react'
import { cn } from '../../lib/utils'

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none whitespace-nowrap'

const variants = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700 shadow-[0_8px_20px_-8px_rgba(47,78,219,0.6)]',
  secondary: 'bg-white text-ink-900 border border-slate-200 hover:border-slate-300 hover:bg-slate-50',
  outline: 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-ink-900',
  subtle: 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-ink-900',
  ghost: 'text-slate-600 hover:text-ink-900 hover:bg-slate-100',
  danger: 'bg-rose-600 text-white hover:bg-rose-700',
  dangerGhost: 'text-rose-600 hover:bg-rose-50',
  onDark: 'bg-white text-ink-900 hover:bg-brand-50',
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
