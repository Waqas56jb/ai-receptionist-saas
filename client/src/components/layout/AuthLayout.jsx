import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'
import Logo from '../ui/Logo'
import ThemeToggle from '../ui/ThemeToggle'

const highlights = [
  'Answer every call and message 24/7',
  'Trained on your own business information',
  'Voice, WhatsApp, Instagram and web in one inbox',
  'Leads and bookings captured automatically',
]

export default function AuthLayout({ title, description, children, footer, wide = false }) {
  const reduceMotion = useReducedMotion()

  return (
    <div className="relative min-h-screen bg-canvas lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      <div className="pointer-events-none absolute inset-0 bg-aurora lg:hidden" aria-hidden="true" />
      {/* Form side */}
      <div className="relative flex min-h-screen flex-col px-5 py-8 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="rounded-lg" aria-label="Back to the website">
            <Logo size="md" />
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/" className="text-[0.8rem] font-semibold text-muted transition-colors hover:text-ink">
              Back to website
            </Link>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center py-10">
          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={wide ? 'w-full max-w-xl' : 'w-full max-w-sm'}
          >
            <h1 className="font-display text-[1.7rem] font-bold tracking-tight text-ink sm:text-[1.9rem]">{title}</h1>
            {description && <p className="mt-2.5 text-[0.9rem] leading-relaxed text-slate-500">{description}</p>}
            <div className="mt-8">{children}</div>
          </motion.div>
        </div>

        {footer && <div className="text-center text-[0.82rem] text-slate-500">{footer}</div>}
      </div>

      {/* Brand side */}
      <div className="relative hidden overflow-hidden bg-ink-950 lg:block">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-aurora" />
          <div className="absolute inset-0 bg-grid [background-size:56px_56px] opacity-50" />
        </div>

        <div className="relative flex h-full flex-col justify-center px-12 xl:px-16">
          <span className="eyebrow">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Business portal
          </span>

          <h2 className="mt-6 max-w-md font-display text-[2.1rem] font-bold leading-[1.15] tracking-tight text-white">
            Everything you need to run your AI receptionist.
          </h2>
          <p className="mt-4 max-w-md text-[0.95rem] leading-relaxed text-slate-300">
            Train it on your business, connect your channels and follow every conversation from a
            single place.
          </p>

          <ul className="mt-9 space-y-3.5">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-500/20 text-brand-300">
                  <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
                </span>
                <span className="text-[0.9rem] text-slate-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
