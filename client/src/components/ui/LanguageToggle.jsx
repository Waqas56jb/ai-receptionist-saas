import { useEffect, useRef, useState } from 'react'
import { Check, Globe } from 'lucide-react'
import { useI18n } from '../../i18n/LanguageProvider'
import cn from '../../lib/cn'

export default function LanguageToggle({ compact = false, className = '' }) {
  const { lang, setLang, languages, t } = useI18n()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = languages.find((item) => item.id === lang) || languages[0]

  useEffect(() => {
    const onDoc = (event) => {
      if (!ref.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  return (
    <div ref={ref} className={cn('relative', className)} data-no-i18n>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('Choose language')}
        title={t('Choose language')}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-xl border border-line bg-surface text-muted transition hover:border-line-strong hover:text-ink',
          compact ? 'h-9 px-2.5' : 'h-10 px-3',
        )}
      >
        <Globe className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className="text-[0.78rem] font-semibold uppercase tracking-wide">{current.id}</span>
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label={t('Language')}
          className="absolute end-0 z-[120] mt-2 min-w-[12.5rem] overflow-hidden rounded-xl border border-line bg-surface p-1.5 shadow-lift"
        >
          {languages.map((item) => {
            const active = item.id === lang
            return (
              <li key={item.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    setLang(item.id)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-[0.82rem] transition-colors',
                    active ? 'bg-[#0066FF]/12 text-ink' : 'text-muted hover:bg-surface-2 hover:text-ink',
                  )}
                >
                  <span>
                    <span className="block font-semibold text-ink">{item.native}</span>
                    <span className="block text-[0.7rem] text-slate-500">{item.name}</span>
                  </span>
                  {active && <Check className="h-3.5 w-3.5 text-[#0066FF]" aria-hidden="true" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
