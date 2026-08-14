import { useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'
import AppSidebar from './AppSidebar'

export default function MobileSidebar({ open, onClose }) {
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
        // Must be a keyed motion element: AnimatePresence only unmounts children
        // it can track, and a plain <div> would be left behind covering the page.
        <motion.div
          key="mobile-drawer"
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
            className="absolute inset-0 h-full w-full cursor-default bg-ink-950/50 backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: reduceMotion ? 0 : '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: reduceMotion ? 0 : '-100%' }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-full w-[17.5rem] max-w-[86vw] border-r border-slate-200 bg-white shadow-panel"
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
            <AppSidebar onNavigate={onClose} />
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
