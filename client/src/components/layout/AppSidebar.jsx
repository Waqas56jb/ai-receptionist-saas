import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, Sparkles } from 'lucide-react'
import cn from '../../lib/cn'
import navigation from '../../config/navigation'
import Logo from '../ui/Logo'

function NavItem({ item, onNavigate }) {
  return (
    <NavLink
      to={item.to}
      end={item.end}
      onClick={onNavigate}
      className={({ isActive }) =>
        cn(
          'group flex items-center gap-2.5 rounded-lg px-3 py-2 text-[0.83rem] font-medium transition-colors',
          isActive ? 'bg-primary-400 text-primary-950 shadow-lg shadow-primary-500/20' : 'text-slate-600 hover:bg-surface-2 hover:text-ink',
        )
      }
    >
      {({ isActive }) => (
        <>
          <item.icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-primary-950' : 'text-slate-400 group-hover:text-slate-600')} aria-hidden="true" />
          <span className="min-w-0 flex-1 truncate">{item.label}</span>
        </>
      )}
    </NavLink>
  )
}

export default function AppSidebar({ onNavigate, className = '' }) {
  const [collapsed, setCollapsed] = useState({})
  const navRef = useRef(null)
  const { pathname } = useLocation()

  const toggle = (id) => setCollapsed((prev) => ({ ...prev, [id]: !prev[id] }))

  // Keep the current page visible in the scrollable nav after a route change.
  useEffect(() => {
    const active = navRef.current?.querySelector('a[aria-current="page"]')
    active?.scrollIntoView({ block: 'nearest' })
  }, [pathname])

  return (
    <div className={cn('flex h-full flex-col bg-surface', className)}>
      <div className="flex h-[4.25rem] shrink-0 items-center border-b border-line px-5">
        <NavLink to="/app/dashboard" onClick={onNavigate} className="rounded-lg" aria-label="Go to dashboard">
          <Logo size="sm" />
        </NavLink>
      </div>

      <nav ref={navRef} className="min-h-0 flex-1 space-y-5 overflow-y-auto px-3 py-5" aria-label="Portal">
        {navigation.map((group) => {
          const isCollapsed = collapsed[group.id]
          return (
            <div key={group.id}>
              <button
                type="button"
                onClick={() => toggle(group.id)}
                aria-expanded={!isCollapsed}
                className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-[0.66rem] font-bold uppercase tracking-[0.12em] text-slate-400 transition-colors hover:text-slate-600"
              >
                {group.label}
                <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', isCollapsed && '-rotate-90')} aria-hidden="true" />
              </button>

              {!isCollapsed && (
                <div className="mt-1 space-y-0.5">
                  {group.items.map((item) => (
                    <NavItem key={item.to} item={item} onNavigate={onNavigate} />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className="shrink-0 border-t border-line p-3">
        <div className="rounded-xl border border-brand-200/70 bg-brand-50/70 p-3.5">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary-400 text-primary-950">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
            <p className="text-[0.78rem] font-semibold text-ink">Professional plan</p>
          </div>
          <p className="mt-2 text-[0.72rem] leading-relaxed text-slate-600">
            342 of 500 calls used this month.
          </p>
          <NavLink
            to="/app/usage"
            onClick={onNavigate}
            className="mt-3 inline-flex text-[0.75rem] font-semibold text-brand-700 underline-offset-4 hover:underline"
          >
            View usage
          </NavLink>
        </div>
      </div>
    </div>
  )
}
