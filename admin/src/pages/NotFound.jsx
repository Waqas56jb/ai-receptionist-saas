import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import Button from '../components/ui/Button'
import Logo from '../components/ui/Logo'
import LanguageToggle from '../components/ui/LanguageToggle'

export default function NotFound() {
  return (
    <div className="grid min-h-[70vh] place-items-center px-5">
      <div className="w-full max-w-md text-center">
        <div className="mb-4 flex justify-end">
          <LanguageToggle compact />
        </div>
        <Logo size="md" className="mx-auto" />
        <span className="mx-auto mt-8 grid h-12 w-12 place-items-center rounded-2xl border border-line bg-surface text-muted">
          <Compass className="h-5 w-5" aria-hidden="true" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-bold text-ink-900">Page not found</h1>
        <p className="mt-2 text-[0.88rem] leading-relaxed text-slate-500">
          That screen does not exist in the admin console, or you do not have access to it.
        </p>
        <Button as={Link} to="/dashboard" size="md" className="mt-7">
          Back to dashboard
        </Button>
      </div>
    </div>
  )
}
