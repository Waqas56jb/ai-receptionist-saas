import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Menu, X, ArrowRight } from 'lucide-react'
import Logo from '../ui/Logo'
import Button from '../ui/Button'
import { navLinks } from '../../data/landing'
import { brand } from '../../config/brand'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      {/* Dims the page behind the mobile sheet. Kept as a sibling of the header
          (not a child) so the header bar itself stays solid white. */}
      <AnimatePresence>
        {open && (
          <motion.button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 h-screen w-full cursor-default bg-ink-900/40 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          open
            ? 'border-b border-slate-200/70 bg-white'
            : scrolled
              ? 'border-b border-slate-200/70 bg-white/80 backdrop-blur-xl'
              : 'border-b border-transparent bg-transparent'
        }`}
      >
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-ink-900 focus:px-4 focus:py-2 focus:text-sm focus:text-white"
        >
          Skip to content
        </a>

        <nav className="container-page" aria-label="Main">
          <div
            className={`flex items-center justify-between transition-all duration-300 ${
              scrolled ? 'h-16' : 'h-[4.5rem]'
            }`}
          >
            <a href="#top" className="rounded-lg" aria-label={`${brand.name} home`}>
              <Logo size="lg" />
            </a>

            <ul className="hidden items-center gap-1 lg:flex">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-600 transition-colors hover:text-ink-900"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="hidden items-center gap-2 lg:flex">
              <Button as="a" href="#" variant="ghost" size="md">
                Sign In
              </Button>
              <Button as="a" href="#get-started" variant="primary" size="md">
                Get Started
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-ink-900 transition-colors hover:bg-slate-50 lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-nav"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: reduceMotion ? 0.1 : 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-slate-200/70 bg-white lg:hidden"
            >
              <div className="container-page py-5">
                <ul className="flex flex-col">
                  {navLinks.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className="block rounded-xl px-2 py-3 text-base font-medium text-ink-900 transition-colors hover:bg-slate-50"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex flex-col gap-2.5 border-t border-slate-200/70 pt-5">
                  <Button as="a" href="#" variant="secondary" size="lg" onClick={() => setOpen(false)}>
                    Sign In
                  </Button>
                  <Button
                    as="a"
                    href="#get-started"
                    variant="primary"
                    size="lg"
                    onClick={() => setOpen(false)}
                  >
                    Get Started
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
