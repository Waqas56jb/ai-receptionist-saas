import { useState } from 'react'
import { Check, Copy, Eye, EyeOff, KeyRound, RefreshCw, ShieldCheck, Trash2, X } from 'lucide-react'
import cn from '../../lib/cn'
import { formatDate } from '../../lib/format'

/**
 * Credential field for third-party secrets.
 *
 * Once a value is saved it is never rendered again — only the masked preview
 * returned by the API. Typing a new value replaces it; the raw string is handed
 * straight to the service call and never kept in component state afterwards.
 */
export default function SecureCredentialInput({
  credential,
  onSave,
  onRemove,
  copyable = false,
  className = '',
}) {
  const { label, preview, saved, updatedAt, hint } = credential
  const [editing, setEditing] = useState(!saved)
  const [value, setValue] = useState('')
  const [reveal, setReveal] = useState(false)
  const [busy, setBusy] = useState(false)
  const [copied, setCopied] = useState(false)

  const save = async () => {
    if (!value.trim()) return
    setBusy(true)
    try {
      await onSave?.(value.trim())
      setValue('')
      setReveal(false)
      setEditing(false)
    } finally {
      setBusy(false)
    }
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(preview || '')
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className={cn('rounded-xl border border-line bg-surface p-4', className)}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-lg', saved ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-400')}>
            {saved ? <ShieldCheck className="h-4 w-4" aria-hidden="true" /> : <KeyRound className="h-4 w-4" aria-hidden="true" />}
          </span>
          <div className="min-w-0">
            <p className="text-[0.83rem] font-semibold text-ink-900">{label}</p>
            <p className="text-[0.72rem] text-slate-500">
              {saved ? `Saved · updated ${formatDate(updatedAt)}` : 'Not configured'}
            </p>
          </div>
        </div>

        {saved && !editing && (
          <div className="flex items-center gap-1">
            {copyable && (
              <button
                type="button"
                onClick={copy}
                className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-ink-900"
                aria-label={`Copy ${label}`}
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            )}
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-[0.75rem] font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-ink-900"
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
              Replace
            </button>
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove()}
                className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                aria-label={`Remove ${label}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        )}
      </div>

      {saved && !editing ? (
        <p className="mt-3 rounded-lg bg-slate-50 px-3 py-2 font-mono text-[0.8rem] tracking-wider text-slate-500">
          {preview}
        </p>
      ) : (
        <div className="mt-3">
          <div className="relative">
            <input
              type={reveal ? 'text' : 'password'}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Paste your ${label.toLowerCase()}`}
              autoComplete="off"
              spellCheck={false}
              className="h-10 w-full rounded-lg border border-line bg-surface px-3 pr-10 font-mono text-[0.8rem] text-ink transition-colors placeholder:font-sans placeholder:text-slate-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-400/30"
            />
            <button
              type="button"
              onClick={() => setReveal((v) => !v)}
              className="absolute right-1.5 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-slate-400 transition-colors hover:text-ink-900"
              aria-label={reveal ? 'Hide value' : 'Show value'}
            >
              {reveal ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>

          <div className="mt-2.5 flex items-center gap-2">
            <button
              type="button"
              onClick={save}
              disabled={!value.trim() || busy}
              className="inline-flex h-8 items-center rounded-lg bg-brand-600 px-3 text-[0.75rem] font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
            >
              {busy ? 'Saving…' : 'Save securely'}
            </button>
            {saved && (
              <button
                type="button"
                onClick={() => {
                  setEditing(false)
                  setValue('')
                }}
                className="inline-flex h-8 items-center gap-1 rounded-lg px-2.5 text-[0.75rem] font-semibold text-slate-500 transition-colors hover:bg-slate-100 hover:text-ink-900"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                Cancel
              </button>
            )}
          </div>
        </div>
      )}

      {hint && <p className="mt-2.5 text-[0.72rem] leading-relaxed text-slate-500">{hint}</p>}
    </div>
  )
}

export function SecretsNotice({ className = '' }) {
  return (
    <div className={cn('flex items-start gap-3 rounded-xl border border-primary-400/30 bg-primary-500/10 p-4', className)}>
      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" aria-hidden="true" />
      <p className="text-[0.8rem] leading-relaxed text-primary-300">
        Secrets are sent straight to your backend and stored there — they are never written into this
        app's source, environment variables or browser storage. After saving, only a masked preview is
        shown. Prefer scoped API keys over master credentials wherever the provider supports them.
      </p>
    </div>
  )
}
