import { Suspense, useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useAuth } from '../../context/AuthContext'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import { NoPermission } from '../ui/States'

function PageFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-live="polite">
      <span className="flex items-center gap-3 text-slate-500">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-primary-400" />
        <span className="text-sm">Loading…</span>
      </span>
    </div>
  )
}

function MobileDrawer({ open, onClose }) {
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!open) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        // Keyed motion wrapper — AnimatePresence cannot unmount a plain div,
        // which would leave an invisible overlay blocking every click.
        <motion.div
          key="admin-drawer"
          className="fixed inset-0 z-[70] lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={onClose}
            className="absolute inset-0 h-full w-full cursor-default bg-ink-950/55 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: reduceMotion ? 0 : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: reduceMotion ? 0 : '-100%' }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-full w-[17.5rem] max-w-[86vw] border-r border-line bg-surface shadow-panel"
            aria-label="Navigation"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-3 top-4 z-10 grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:text-ink-900"
              aria-label="Close navigation"
            >
              <X className="h-4 w-4" />
            </button>
            <AdminSidebar onNavigate={onClose} />
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('devmark.admin.sidebar') === 'collapsed'
    } catch {
      return false
    }
  })
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname])

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem('devmark.admin.sidebar', next ? 'collapsed' : 'expanded')
      } catch {
        /* ignore */
      }
      return next
    })
  }

  return (
    <div className="min-h-screen bg-canvas">
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[80] focus:rounded-lg focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-30 hidden border-r border-line transition-[width] duration-200 lg:block',
          collapsed ? 'w-[4.5rem]' : 'w-[16.5rem]',
        )}
      >
        <AdminSidebar collapsed={collapsed} onToggleCollapse={toggleCollapse} />
      </aside>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className={cn('transition-[padding] duration-200', collapsed ? 'lg:pl-[4.5rem]' : 'lg:pl-[16.5rem]')}>
        <AdminHeader onOpenSidebar={() => setDrawerOpen(true)} />
        <main id="admin-main" className="px-4 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto w-full max-w-[92rem]">
            <Suspense fallback={<PageFallback />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  )
}

/** Route guard — mock session only, no tokens are stored. */
export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children
}

/** Wraps a page so a role without the permission sees an explanation, not a blank. */
export function RequirePermission({ permission, children }) {
  const { can } = useAuth()
  if (!can(permission)) return <NoPermission permission={permission} />
  return children
}
