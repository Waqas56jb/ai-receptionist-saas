import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { cn } from '../../lib/utils'
import navigation from '../../config/navigation'
import { useAuth } from '../../context/AuthContext'
import Logo from '../ui/Logo'
import logoIcon from '../../assets/logo-icon.png'

export default function AdminSidebar({ onNavigate, collapsed = false, onToggleCollapse, className = '' }) {
  const [closedGroups, setClosedGroups] = useState({})
  const { can, role } = useAuth()
  const navRef = useRef(null)
  const { pathname } = useLocation()

  useEffect(() => {
    navRef.current?.querySelector('a[aria-current="page"]')?.scrollIntoView({ block: 'nearest' })
  }, [pathname])

  const toggle = (id) => setClosedGroups((prev) => ({ ...prev, [id]: !prev[id] }))

  // Groups whose items the current role cannot see are dropped entirely.
  const visibleGroups = navigation
    .map((group) => ({ ...group, items: group.items.filter((item) => can(item.permission)) }))
    .filter((group) => group.items.length > 0)

  return (
    <div className={cn('flex h-full flex-col bg-surface', className)}>
      <div className="brand-bar h-1 w-full shrink-0" aria-hidden="true" />
      <div className={cn('flex h-[4.25rem] shrink-0 items-center border-b border-line', collapsed ? 'justify-center px-2' : 'justify-between px-4')}>
        {collapsed ? (
          <img src={logoIcon} alt="DEVMARK admin" className="h-8 w-8 rounded-lg" />
        ) : (
          <NavLink to="/dashboard" onClick={onNavigate} className="rounded-lg" aria-label="Go to dashboard">
            <Logo size="sm" />
          </NavLink>
        )}
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="hidden h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-ink-900 lg:grid"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
        )}
      </div>

      <nav ref={navRef} className={cn('min-h-0 flex-1 overflow-y-auto py-4', collapsed ? 'px-2' : 'px-3')} aria-label="Admin">
        <div className="space-y-4">
          {visibleGroups.map((group) => {
            const isClosed = closedGroups[group.id]
            return (
              <div key={group.id}>
                {!collapsed && (
                  <button
                    type="button"
                    onClick={() => toggle(group.id)}
                    aria-expanded={!isClosed}
                    className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-1.5 text-[0.64rem] font-bold uppercase tracking-[0.12em] text-slate-400 transition-colors hover:text-slate-600"
                  >
                    {group.label}
                    <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-200', isClosed && '-rotate-90')} aria-hidden="true" />
                  </button>
                )}

                {(!isClosed || collapsed) && (
                  <div className="mt-1 space-y-0.5">
                    {group.items.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/dashboard'}
                        onClick={onNavigate}
                        title={collapsed ? item.label : undefined}
                        className={({ isActive }) =>
                          cn(
                            'group flex items-center gap-2.5 rounded-lg py-2 text-[0.82rem] font-medium transition-colors',
                            collapsed ? 'justify-center px-2' : 'px-3',
                            isActive
                              ? 'bg-[#0066FF] text-white shadow-lg shadow-[#0066FF]/25'
                              : 'text-slate-600 hover:bg-[#FF7A00] hover:text-white',
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <item.icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-white' : 'text-slate-400 group-hover:text-white')} aria-hidden="true" />
                            {!collapsed && <span className="min-w-0 flex-1 truncate">{item.label}</span>}
                          </>
                        )}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </nav>

      {!collapsed && (
        <div className="shrink-0 border-t border-line p-3">
          <div className="rounded-xl border border-line bg-canvas-soft p-3.5">
            <p className="text-[0.64rem] font-bold uppercase tracking-wider text-slate-400">Signed in as</p>
            <p className="mt-1 text-[0.82rem] font-semibold text-ink">{role?.name || 'Admin'}</p>
            <p className="mt-1 text-[0.72rem] leading-relaxed text-slate-500">
              {role?.id === 'super-admin' ? 'Full platform access.' : `${role?.permissions.length || 0} permissions granted.`}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
