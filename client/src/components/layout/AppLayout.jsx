import { Suspense, useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AppSidebar from './AppSidebar'
import AppHeader from './AppHeader'
import MobileSidebar from './MobileSidebar'

/** Shown while a lazily-loaded page chunk arrives — the shell stays put. */
function PageFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-live="polite">
      <span className="flex items-center gap-3 text-slate-500">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-brand-600" />
        <span className="text-sm">Loading…</span>
      </span>
    </div>
  )
}

export default function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const location = useLocation()

  // Scroll back to the top whenever the route changes.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-slate-50/70">
      <a
        href="#app-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[80] focus:rounded-lg focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      {/* Persistent sidebar from lg up */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[16.5rem] border-r border-slate-200/80 lg:block">
        <AppSidebar />
      </aside>

      <MobileSidebar open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="lg:pl-[16.5rem]">
        <AppHeader onOpenSidebar={() => setDrawerOpen(true)} />
        <main id="app-main" className="px-4 py-6 sm:px-6 sm:py-8">
          {/* Scoped to the content area so a page chunk loading never tears down
              the sidebar, header or an in-flight drawer animation. */}
          <div className="mx-auto w-full max-w-[86rem]">
            <Suspense fallback={<PageFallback />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  )
}
