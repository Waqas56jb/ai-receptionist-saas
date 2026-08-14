import { Link } from 'react-router-dom'
import { Linkedin, Instagram } from 'lucide-react'
import Logo from '../ui/Logo'
import { footerColumns } from '../../data/landing'
import { brand, year } from '../../config/brand'

export default function Footer() {
  return (
    <footer className="dark-section border-t border-white/10 bg-ink-950" aria-label="Footer">
      <div className="container-page py-14 sm:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,2fr)] lg:gap-16">
          {/* Brand */}
          <div>
            <Logo size="lg" />
            <p className="mt-2 text-[0.8rem] font-medium tracking-wide text-slate-500">
              {brand.tagline}
            </p>
            <p className="mt-4 max-w-xs text-[0.9rem] leading-relaxed text-slate-400">
              An AI receptionist that answers calls and customer messages 24/7 — trained on your own
              business information.
            </p>

            <div className="mt-6 flex items-center gap-2.5">
              <a
                href={brand.social.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${brand.name} on LinkedIn`}
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-300 transition-colors hover:border-white/20 hover:text-white"
              >
                <Linkedin className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href={brand.social.instagram}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${brand.name} on Instagram`}
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-300 transition-colors hover:border-white/20 hover:text-white"
              >
                <Instagram className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-white">
                  {column.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => {
                    const className = 'text-[0.9rem] text-slate-400 transition-colors hover:text-white'
                    // Internal routes go through the router; anchors and mailto stay plain links.
                    return (
                      <li key={`${column.title}-${link.label}`}>
                        {link.href.startsWith('/') ? (
                          <Link to={link.href} className={className}>
                            {link.label}
                          </Link>
                        ) : (
                          <a href={link.href} className={className}>
                            {link.label}
                          </a>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-[0.8rem] text-slate-500">
            © {year} {brand.name}. All rights reserved.
          </p>
          <p className="text-[0.8rem] text-slate-500">
            Phone · WhatsApp · Instagram · Web
          </p>
        </div>
      </div>
    </footer>
  )
}
