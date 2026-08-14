/** Presentation helpers shared across the portal. */

export function formatNumber(value) {
  if (value === null || value === undefined) return '—'
  return new Intl.NumberFormat('en-US').format(value)
}

export function formatCurrency(value, currency = 'USD') {
  if (value === null || value === undefined) return '—'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value)
}

export function formatPercent(value, digits = 0) {
  if (value === null || value === undefined) return '—'
  return `${value.toFixed(digits)}%`
}

/** Seconds → "4m 12s" (or "48s"). */
export function formatDuration(seconds) {
  if (!seconds && seconds !== 0) return '—'
  const m = Math.floor(seconds / 60)
  const s = Math.round(seconds % 60)
  return m ? `${m}m ${String(s).padStart(2, '0')}s` : `${s}s`
}

/** Seconds → "02:48" for transcript timestamps. */
export function formatClock(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, '0')
  const s = String(Math.round(seconds % 60)).padStart(2, '0')
  return `${m}:${s}`
}

export function formatDate(value, opts = {}) {
  if (!value) return '—'
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', ...opts })
}

export function formatTime(value) {
  if (!value) return '—'
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

export function formatDateTime(value) {
  if (!value) return '—'
  return `${formatDate(value)} · ${formatTime(value)}`
}

/** "3 min ago" / "2 days ago" — relative to the demo clock. */
export function timeAgo(value, now = new Date()) {
  if (!value) return '—'
  const d = value instanceof Date ? value : new Date(value)
  const diff = Math.max(0, (now.getTime() - d.getTime()) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)} h ago`
  if (diff < 604800) return `${Math.floor(diff / 86400)} d ago`
  return formatDate(d, { year: undefined })
}

export function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return '—'
  const units = ['B', 'KB', 'MB', 'GB']
  let i = 0
  let n = bytes
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024
    i++
  }
  return `${n < 10 && i > 0 ? n.toFixed(1) : Math.round(n)} ${units[i]}`
}

export function initials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

/** Masked preview of a stored secret — we never render the real value. */
export function maskSecret(prefix = 'sk', last4 = '0000') {
  return `${prefix}_••••••••••${last4}`
}

export function greeting(date = new Date()) {
  const h = date.getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}
