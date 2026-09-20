import { Link } from 'react-router-dom'
import { Linkedin, Instagram } from 'lucide-react'
import Logo from '../ui/Logo'
import { footerColumns } from '../../data/landing'
import { brand, year } from '../../config/brand'

export default function Footer() {
  return (
    <footer className="border-t border-line bg-canvas" aria-label="Footer">
      <div className="section-shell py-14 sm:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,2fr)] lg:gap-16">
          <div>
            <Logo size="lg" />
            <p className="mt-2 text-[0.8rem] font-medium tracking-wide text-subtle">{brand.tagline}</p>
            <p className="mt-4 max-w-xs text-[0.9rem] leading-relaxed text-muted">
              Digital receptionist software for businesses that cannot miss a call. Publish once from
              a browser and answer everywhere — on the channels you already own.
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              <a
                href={brand.social.linkedin}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${brand.name} on LinkedIn`}
                className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface-2/70 text-muted transition-colors hover:border-line-strong hover:text-ink"
              >
                <Linkedin className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href={brand.social.instagram}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${brand.name} on Instagram`}
                className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface-2/70 text-muted transition-colors hover:border-line-strong hover:text-ink"
              >
                <Instagram className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-ink">
                  {column.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => {
                    const className = 'text-[0.9rem] text-muted transition-colors hover:text-ink'
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

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-line pt-8 sm:flex-row">
          <p className="text-[0.8rem] text-subtle">
            © {year} {brand.name}. All rights reserved.
          </p>
          <p className="text-[0.8rem] text-subtle">Phone · WhatsApp · Instagram · Web</p>
        </div>
      </div>
    </footer>
  )
}
