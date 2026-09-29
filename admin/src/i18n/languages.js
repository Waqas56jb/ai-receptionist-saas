export const LANGUAGE_KEY = 'devmark.ui.language'

export const LANGUAGES = [
  { id: 'en', name: 'English', native: 'English', dir: 'ltr', locale: 'en-GB' },
  { id: 'fr', name: 'French', native: 'Français', dir: 'ltr', locale: 'fr-FR' },
  { id: 'ar', name: 'Arabic', native: 'العربية', dir: 'rtl', locale: 'ar' },
  { id: 'so', name: 'Somali', native: 'Soomaali', dir: 'ltr', locale: 'so-SO' },
  { id: 'am', name: 'Amharic', native: 'አማርኛ', dir: 'ltr', locale: 'am-ET' },
  { id: 'aa', name: 'Afar', native: 'Qafar af', dir: 'ltr', locale: 'aa-ET' },
]

export function normalizeLang(value) {
  const id = String(value || '').toLowerCase().slice(0, 2)
  return LANGUAGES.some((lang) => lang.id === id) ? id : 'en'
}

export function readStoredLang() {
  try {
    return normalizeLang(localStorage.getItem(LANGUAGE_KEY) || 'en')
  } catch {
    return 'en'
  }
}

export function applyDocumentLang(lang) {
  const meta = LANGUAGES.find((item) => item.id === lang) || LANGUAGES[0]
  const root = document.documentElement
  root.lang = meta.id
  root.dir = meta.dir
  root.setAttribute('data-lang', meta.id)
}

export function localeFor(lang) {
  return (LANGUAGES.find((item) => item.id === lang) || LANGUAGES[0]).locale
}
