const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

export function normalizeEmail(value) {
  return String(value || '').trim().toLowerCase()
}

export function isValidEmail(value) {
  const email = normalizeEmail(value)
  if (!email || email.length < 6 || email.length > 254) return false
  if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) return false
  return EMAIL_RE.test(email)
}

export function emailError(value) {
  const raw = String(value || '').trim()
  if (!raw) return 'Enter your email address.'
  if (!isValidEmail(raw)) return 'Enter a valid email, for example name@business.com.'
  return ''
}

export default { isValidEmail, normalizeEmail, emailError }
