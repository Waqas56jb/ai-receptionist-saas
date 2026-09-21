const EMAIL_RE =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/

function cleanText(value, max = 500) {
  return String(value ?? '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, max)
}

function isValidEmail(value) {
  const email = cleanText(value, 254).toLowerCase()
  if (!email || email.length < 6 || email.length > 254) return false
  if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) return false
  return EMAIL_RE.test(email)
}

function normalizeEmail(value) {
  return cleanText(value, 254).toLowerCase()
}

function maskEmail(value) {
  const email = normalizeEmail(value)
  const [name, domain] = email.split('@')
  if (!name || !domain) return email
  const visible = name.slice(0, 2)
  return `${visible}${'•'.repeat(Math.max(1, name.length - 2))}@${domain}`
}

module.exports = { cleanText, isValidEmail, normalizeEmail, maskEmail, EMAIL_RE }
