import cn from '../../lib/cn'

export function Card({ className = '', children, as: Tag = 'div', ...props }) {
  return (
    <Tag
      className={cn('rounded-2xl border border-slate-200/80 bg-white shadow-subtle', className)}
      {...props}
    >
      {children}
    </Tag>
  )
}

export function CardHeader({ title, description, action, icon: Icon, className = '', children }) {
  return (
    <div className={cn('flex flex-wrap items-start justify-between gap-3 border-b border-slate-200/80 px-5 py-4 sm:px-6', className)}>
      <div className="flex min-w-0 items-start gap-3">
        {Icon && (
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
            <Icon className="h-[1.05rem] w-[1.05rem]" aria-hidden="true" />
          </span>
        )}
        <div className="min-w-0">
          {title && <h3 className="font-display text-[0.975rem] font-semibold text-ink-900">{title}</h3>}
          {description && <p className="mt-1 text-[0.85rem] leading-relaxed text-slate-500">{description}</p>}
          {children}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export function CardBody({ className = '', children }) {
  return <div className={cn('px-5 py-5 sm:px-6', className)}>{children}</div>
}

export function CardFooter({ className = '', children }) {
  return (
    <div className={cn('flex flex-wrap items-center justify-end gap-3 border-t border-slate-200/80 bg-slate-50/60 px-5 py-4 sm:px-6', className)}>
      {children}
    </div>
  )
}

export default Card
