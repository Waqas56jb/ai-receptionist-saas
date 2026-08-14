import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react'

const ToastContext = createContext(null)

const icons = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
}

const styles = {
  success: 'border-emerald-200 bg-white text-emerald-700',
  error: 'border-rose-200 bg-white text-rose-700',
  info: 'border-slate-200 bg-white text-slate-700',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const idRef = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (message, { type = 'success', duration = 3600 } = {}) => {
      idRef.current += 1
      const id = idRef.current
      setToasts((prev) => [...prev, { id, message, type }])
      if (duration) setTimeout(() => dismiss(id), duration)
      return id
    },
    [dismiss],
  )

  const value = useMemo(
    () => ({
      toast: push,
      success: (m, o) => push(m, { ...o, type: 'success' }),
      error: (m, o) => push(m, { ...o, type: 'error' }),
      info: (m, o) => push(m, { ...o, type: 'info' }),
      dismiss,
    }),
    [push, dismiss],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 p-4 sm:bottom-auto sm:right-0 sm:top-0 sm:items-end sm:p-6"
        role="status"
        aria-live="polite"
      >
        <AnimatePresence initial={false}>
          {toasts.map((t) => {
            const Icon = icons[t.type] || Info
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 12, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-lift ${styles[t.type]}`}
              >
                <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <p className="flex-1 text-[0.85rem] font-medium leading-relaxed text-ink-900">{t.message}</p>
                <button
                  type="button"
                  onClick={() => dismiss(t.id)}
                  className="rounded-md p-0.5 text-slate-400 transition-colors hover:text-ink-900"
                  aria-label="Dismiss notification"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}

export default ToastContext
