import { Moon, Sun } from 'lucide-react'
import { useSiteTheme } from '../../context/SiteThemeContext'

export default function ThemeToggle({ className = '' }) {
  const { toggle } = useSiteTheme()

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-surface text-muted transition hover:border-line-strong hover:text-ink ${className}`}
    >
      <Sun className="theme-icon-sun h-4 w-4" aria-hidden="true" />
      <Moon className="theme-icon-moon h-4 w-4" aria-hidden="true" />
    </button>
  )
}
