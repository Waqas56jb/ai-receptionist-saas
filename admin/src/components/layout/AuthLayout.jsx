import { motion, useReducedMotion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'
import Logo from '../ui/Logo'
import ThemeToggle from '../ui/ThemeToggle'
import LanguageToggle from '../ui/LanguageToggle'

/** Private console shell — deliberately sober, with a visible security notice. */
export default function AuthLayout({ title, description, children, footer }) {
  const reduceMotion = useReducedMotion()

  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas">
      <div className="brand-bar pointer-events-none absolute inset-x-0 top-0 z-20 h-1" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 bg-aurora" />
        <div className="absolute inset-0 bg-grid [background-size:56px_56px] opacity-50" />
      </div>

      <div className="absolute end-5 top-5 z-10 flex items-center gap-2">
        <LanguageToggle compact />
        <ThemeToggle />
      </div>

      <div className="relative flex min-h-screen flex-col items-center justify-center px-5 py-10">
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-sm"
        >
          <div className="mb-8 flex justify-center">
            <Logo size="lg" />
          </div>

          <div className="rounded-2xl border border-line bg-surface p-6 shadow-panel sm:p-7">
            <h1 className="font-display text-[1.35rem] font-bold tracking-tight text-ink">{title}</h1>
            {description && <p className="mt-2 text-[0.85rem] leading-relaxed text-slate-500">{description}</p>}
            <div className="mt-6">{children}</div>
          </div>

          <p className="mt-6 flex items-center justify-center gap-2 text-center text-[0.75rem] text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-brand-300" aria-hidden="true" />
            Authorized administrators only. All access is logged.
          </p>

          {footer && <div className="mt-4 text-center text-[0.8rem] text-slate-400">{footer}</div>}
        </motion.div>
      </div>
    </div>
  )
}
