import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Menu, X, ChevronDown, Moon, Sun } from 'lucide-react'
import Logo from '../ui/Logo'
import { megaNav } from '../../data/landing'
import { brand } from '../../config/brand'
import { useSiteTheme } from '../../context/SiteThemeContext'
import LanguageToggle from '../ui/LanguageToggle'

const menus = [
  { id: 'product', label: 'Product' },
  { id: 'solutions', label: 'Solutions' },
  { id: 'resources', label: 'Resources' },
]

function MegaItem({ item, onClick }) {
  return (
    <li>
      <a
        href={item.href}
        onClick={onClick}
        className="group flex items-start gap-3.5 rounded-xl p-2.5 transition hover:bg-surface"
      >
        <span
          className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line transition"
          style={{ backgroundColor: item.bg, color: item.color }}
        >
          <item.icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-semibold text-ink">{item.title}</span>
          <span className="mt-0.5 block text-xs leading-relaxed text-muted">{item.hint}</span>
        </span>
      </a>
    </li>
  )
}

function MegaPanel({ data, onClose }) {
  return (
    <div className="mx-auto grid w-full max-w-site gap-10 px-5 py-10 sm:px-8 lg:grid-cols-12">
      {data.columns.map((column) => (
        <div key={column.title} className="lg:col-span-4">
          <p className="mb-5 text-xxs font-semibold uppercase tracking-[0.2em] text-subtle">
            {column.title}
          </p>
          <ul className="space-y-1">
            {column.items.map((item) => (
              <MegaItem key={item.title} item={item} onClick={onClose} />
            ))}
          </ul>
        </div>
      ))}
      <div className="lg:col-span-4">
        <a
          href={data.featured.href}
          onClick={onClose}
          className="group block overflow-hidden rounded-2xl border border-line bg-surface transition hover:border-line-strong"
        >
          <div className="aspect-[16/9] overflow-hidden bg-canvas">
            <div className="flex h-full items-end bg-gradient-to-br from-primary-500/20 via-surface to-canvas p-6">
              <p className="font-display text-sm font-semibold text-ink">{data.featured.eyebrow}</p>
            </div>
          </div>
          <div className="p-5">
            <p className="font-display text-base font-bold leading-snug text-ink">{data.featured.title}</p>
            <span className="mt-3 inline-flex text-sm font-semibold text-primary-500 transition group-hover:gap-2">
              {data.featured.cta}
            </span>
          </div>
        </a>
      </div>
    </div>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [open, setOpen] = useState(null)
  const [mobile, setMobile] = useState(false)
  const reduceMotion = useReducedMotion()
  const { toggle } = useSiteTheme()

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 8)
      const height = document.documentElement.scrollHeight - window.innerHeight
      setProgress(height > 0 ? Math.min(y / height, 1) : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobile ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobile])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(null)
        setMobile(false)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const closeAll = () => {
    setOpen(null)
    setMobile(false)
  }

  return (
    <div className="sticky top-0 z-50">
      <div className="brand-bar h-1 w-full" aria-hidden="true" />
      <header
        onMouseLeave={() => setOpen(null)}
        className={`relative border-b bg-canvas/90 backdrop-blur-xl transition-all duration-300 ${
          scrolled || open || mobile
            ? 'border-line shadow-[0_10px_30px_-24px_rgba(8,9,11,0.5)]'
            : 'border-transparent'
        }`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-primary-500 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>

        <div className="mx-auto flex h-16 w-full max-w-site items-center gap-6 px-5 sm:px-8 lg:h-[4.5rem]">
          <a href="#top" className="shrink-0 rounded-lg" aria-label={`${brand.name} home`}>
            <Logo size="sm" />
          </a>

          <nav className="hidden flex-1 items-center gap-1 lg:flex" aria-label="Main">
            {menus.map((menu) => (
              <button
                key={menu.id}
                type="button"
                onMouseEnter={() => setOpen(menu.id)}
                onClick={() => setOpen((current) => (current === menu.id ? null : menu.id))}
                aria-expanded={open === menu.id}
                className={`group inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition hover:text-ink ${
                  open === menu.id ? 'text-ink' : 'text-muted'
                }`}
              >
                {menu.label}
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform duration-200 ${
                    open === menu.id ? 'rotate-180 text-primary-500' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
            ))}
            <a
              href="#pricing"
              onMouseEnter={() => setOpen(null)}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted transition hover:text-ink"
            >
              Pricing
            </a>
          </nav>

          <div className="ms-auto flex items-center gap-2">
            <LanguageToggle compact />
            <button
              type="button"
              onClick={toggle}
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
              className="relative hidden h-9 w-9 items-center justify-center rounded-full border border-line bg-surface-2/70 text-muted transition hover:border-line-strong hover:text-ink sm:inline-flex"
            >
              <Sun className="theme-icon-sun h-4 w-4" aria-hidden="true" />
              <Moon className="theme-icon-moon h-4 w-4" aria-hidden="true" />
            </button>
            <Link
              to="/login"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted transition hover:text-ink md:inline-block"
            >
              Sign in
            </Link>
            <Link to="/signup" className="btn-mint hidden !px-5 sm:inline-flex">
              Start for Free
            </Link>
            <button
              type="button"
              onClick={() => setMobile((v) => !v)}
              aria-expanded={mobile}
              aria-label={mobile ? 'Close menu' : 'Open menu'}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink transition hover:border-line-strong lg:hidden"
            >
              {mobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-px overflow-hidden">
          <div
            className="h-full origin-left bg-gradient-to-r from-primary-500 via-secondary-400 to-primary-400 transition-transform duration-150 ease-out"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>

        <AnimatePresence>
          {open && megaNav[open] && (
            <motion.div
              key={open}
              initial={{ opacity: 0, y: reduceMotion ? 0 : -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduceMotion ? 0 : -4 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-x-0 top-full hidden border-b border-line bg-canvas shadow-2xl shadow-black/20 lg:block"
            >
              <MegaPanel data={megaNav[open]} onClose={() => setOpen(null)} />
              <div className="border-t border-line bg-canvas-soft">
                <div className="mx-auto flex max-w-site items-center justify-end gap-2 px-5 py-3 sm:px-8">
                  <Link to="/signup" className="btn-mint !px-5 !py-2 text-xs" onClick={closeAll}>
                    Start for Free
                  </Link>
                  <a href="#get-started" className="btn-ghost-surface !px-5 !py-2 text-xs" onClick={closeAll}>
                    Book a walkthrough
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {mobile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: reduceMotion ? 0.1 : 0.28 }}
              className="overflow-hidden border-t border-line bg-canvas lg:hidden"
            >
              <div className="space-y-5 px-5 py-5">
                {menus.map((menu) => (
                  <div key={menu.id}>
                    <p className="text-xxs font-semibold uppercase tracking-[0.2em] text-subtle">
                      {menu.label}
                    </p>
                    <ul className="mt-2">
                      {megaNav[menu.id].columns.flatMap((col) => col.items).map((item) => (
                        <MegaItem key={`${menu.id}-${item.title}`} item={item} onClick={closeAll} />
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="flex items-center justify-between gap-2 border-t border-line pt-4">
                  <LanguageToggle compact />
                  <div className="flex flex-1 gap-2">
                  <Link
                    to="/login"
                    onClick={closeAll}
                    className="flex-1 rounded-lg border border-line px-4 py-2.5 text-center text-sm font-medium text-ink"
                  >
                    Sign in
                  </Link>
                  <Link to="/signup" onClick={closeAll} className="btn-mint flex-1 !py-2.5">
                    Start for Free
                  </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  )
}
