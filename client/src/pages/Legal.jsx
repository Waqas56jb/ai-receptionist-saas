import { Link } from 'react-router-dom'
import { ArrowLeft, FileText } from 'lucide-react'
import Logo from '../components/ui/Logo'
import Button from '../components/ui/Button'
import { brand, year } from '../config/brand'

/**
 * Placeholder for the legal pages. Deliberately does not invent policy text —
 * the real wording is supplied by the business before launch.
 */
export default function Legal({ title, summary }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200/80">
        <div className="container-page flex h-[4.5rem] items-center justify-between gap-4">
          <Link to="/" className="rounded-lg" aria-label={`${brand.name} home`}>
            <Logo size="md" />
          </Link>
          <Button as={Link} to="/" variant="ghost" size="sm">
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to website
          </Button>
        </div>
      </header>

      <main className="container-page py-16 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <span className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400">
            <FileText className="h-5 w-5" aria-hidden="true" />
          </span>

          <h1 className="mt-6 font-display text-[2rem] font-bold tracking-tight text-ink-900">{title}</h1>
          <p className="mt-4 text-[0.95rem] leading-relaxed text-slate-600">{summary}</p>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
            <p className="text-[0.875rem] leading-relaxed text-slate-600">
              The final wording for this page will be provided by {brand.name} before launch. It is
              intentionally left blank rather than filled with placeholder legal text.
            </p>
          </div>

          <p className="mt-8 text-[0.85rem] text-slate-500">
            Questions in the meantime?{' '}
            <a
              href={`mailto:${brand.contactEmail}`}
              className="font-semibold text-brand-600 underline-offset-4 hover:underline"
            >
              {brand.contactEmail}
            </a>
          </p>

          <p className="mt-10 border-t border-slate-200 pt-6 text-[0.8rem] text-slate-400">
            © {year} {brand.name}. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  )
}
