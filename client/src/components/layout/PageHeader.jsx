import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import cn from '../../lib/cn'

export default function PageHeader({ title, description, actions, breadcrumbs, badge, className = '' }) {
  return (
    <div className={cn('mb-6 flex flex-wrap items-start justify-between gap-4', className)}>
      <div className="min-w-0">
        {breadcrumbs?.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-2">
            <ol className="flex flex-wrap items-center gap-1 text-[0.75rem] text-slate-500">
              {breadcrumbs.map((crumb, i) => (
                <li key={crumb.label} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="h-3 w-3 text-slate-300" aria-hidden="true" />}
                  {crumb.to ? (
                    <Link to={crumb.to} className="hover:text-ink-900">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-slate-400">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-[1.35rem] font-bold tracking-tight text-ink-900 sm:text-[1.6rem]">{title}</h1>
          {badge}
        </div>
        {description && <p className="mt-1.5 max-w-2xl text-[0.9rem] leading-relaxed text-slate-500">{description}</p>}
      </div>

      {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
    </div>
  )
}
