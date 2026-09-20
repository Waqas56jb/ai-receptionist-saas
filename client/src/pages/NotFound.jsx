import { Link } from 'react-router-dom'
import { ArrowLeft, Compass } from 'lucide-react'
import Button from '../components/ui/Button'
import Logo from '../components/ui/Logo'

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-canvas px-5">
      <div className="w-full max-w-md text-center">
        <Logo size="md" className="mx-auto" />
        <span className="mx-auto mt-8 grid h-12 w-12 place-items-center rounded-2xl border border-line bg-surface text-muted">
          <Compass className="h-5 w-5" aria-hidden="true" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-bold text-ink-900">Page not found</h1>
        <p className="mt-2 text-[0.9rem] leading-relaxed text-slate-500">
          The page you are looking for does not exist or has moved.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button as={Link} to="/app/dashboard" size="md">
            Go to dashboard
          </Button>
          <Button as={Link} to="/" variant="secondary" size="md">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to website
          </Button>
        </div>
      </div>
    </div>
  )
}
