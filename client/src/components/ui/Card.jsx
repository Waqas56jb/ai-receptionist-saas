import cn from '../../lib/cn'

export function Card({ className = '', children, as: Tag = 'div', ...props }) {
  return (
    <Tag
      className={cn('rounded-2xl border border-line bg-surface shadow-subtle', className)}
      {...props}
    >
      {children}
    </Tag>
  )
}

export function CardHeader({ title, description, action, icon: Icon, className = '', children }) {
  return (
    <div className={cn('flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4 sm:px-6', className)}>
      <div className="flex min-w-0 items-start gap-3">
        {Icon && (
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#0066FF]/15 text-[#3D82FF]">
            <Icon className="h-[1.05rem] w-[1.05rem]" aria-hidden="true" />
          </span>
        )}
        <div className="min-w-0">
          {title && <h3 className="font-display text-[0.975rem] font-semibold text-ink">{title}</h3>}
          {description && <p className="mt-1 text-[0.85rem] leading-relaxed text-muted">{description}</p>}
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
    <div className={cn('flex flex-wrap items-center justify-end gap-3 border-t border-line bg-canvas-soft/80 px-5 py-4 sm:px-6', className)}>
      {children}
    </div>
  )
}

export default Card
