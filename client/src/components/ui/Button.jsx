const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none whitespace-nowrap'

const variants = {
  primary:
    'bg-brand-600 text-white shadow-[0_8px_20px_-8px_rgba(47,78,219,0.6)] hover:bg-brand-700 hover:shadow-[0_12px_28px_-8px_rgba(47,78,219,0.55)] hover:-translate-y-0.5 active:translate-y-0',
  secondary:
    'bg-white text-ink-900 border border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:-translate-y-0.5 active:translate-y-0',
  ghost: 'text-slate-600 hover:text-ink-900 hover:bg-slate-100',
  onDark:
    'bg-white text-ink-900 hover:bg-brand-50 hover:-translate-y-0.5 active:translate-y-0 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.5)]',
  outlineDark:
    'border border-white/20 text-white hover:bg-white/10 hover:border-white/30 hover:-translate-y-0.5 active:translate-y-0',
}

const sizes = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-[0.95rem] sm:h-[3.25rem] sm:px-7 sm:text-base',
}

export default function Button({
  as = 'a',
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}) {
  const Tag = as
  return (
    <Tag className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </Tag>
  )
}
