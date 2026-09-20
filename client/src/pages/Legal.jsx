import { Link } from 'react-router-dom'
import { ArrowLeft, FileText } from 'lucide-react'
import Logo from '../components/ui/Logo'
import { brand, year } from '../config/brand'
import { SiteThemeProvider } from '../context/SiteThemeContext'

export default function Legal({ title, summary }) {
  return (
    <SiteThemeProvider>
      <div className="site min-h-screen">
        <header className="border-b border-line bg-canvas/90 backdrop-blur-xl">
          <div className="section-shell flex h-[4.5rem] items-center justify-between gap-4">
            <Link to="/" className="rounded-lg" aria-label={`${brand.name} home`}>
              <Logo size="md" />
            </Link>
            <Link to="/" className="btn-ghost-surface !px-4 !py-2 text-sm">
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
              Back to website
            </Link>
          </div>
        </header>

        <main className="section-shell py-16 sm:py-20">
          <div className="mx-auto max-w-2xl">
            <span className="grid h-11 w-11 place-items-center rounded-xl border border-line bg-surface text-muted">
              <FileText className="h-5 w-5" aria-hidden="true" />
            </span>

            <h1 className="mt-6 font-display text-[2rem] font-bold tracking-tight text-ink">{title}</h1>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-muted">{summary}</p>

            <div className="mt-8 rounded-2xl border border-line bg-surface p-5">
              <p className="text-[0.875rem] leading-relaxed text-muted">
                The final wording for this page will be provided by {brand.name} before launch. It is
                intentionally left blank rather than filled with placeholder legal text.
              </p>
            </div>

            <p className="mt-8 text-[0.85rem] text-muted">
              Questions in the meantime?{' '}
              <a href={`mailto:${brand.contactEmail}`} className="font-semibold text-primary-500 underline-offset-4 hover:underline">
                {brand.contactEmail}
              </a>
            </p>

            <p className="mt-10 border-t border-line pt-6 text-[0.8rem] text-subtle">
              © {year} {brand.name}. All rights reserved.
            </p>
          </div>
        </main>
      </div>
    </SiteThemeProvider>
  )
}
