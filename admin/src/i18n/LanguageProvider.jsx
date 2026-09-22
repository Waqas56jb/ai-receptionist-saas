import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { applyDocumentLang, LANGUAGE_KEY, LANGUAGES, localeFor, normalizeLang, readStoredLang } from './languages'
import { createTranslator, translateDom } from './engine'
import { ar, fr, so } from './dictionaries'
import { arMore, frMore, soMore } from './extras'
import { arUi, frUi, soUi } from './extras.ui'

const DICTS = {
  en: {},
  fr: { ...fr, ...frMore, ...frUi },
  ar: { ...ar, ...arMore, ...arUi },
  so: { ...so, ...soMore, ...soUi },
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => (typeof document === 'undefined' ? 'en' : readStoredLang()))
  const location = useLocation()

  const t = useMemo(() => createTranslator(DICTS[lang] || {}), [lang])

  const setLang = useCallback((next) => {
    const id = normalizeLang(next)
    setLangState(id)
    try {
      localStorage.setItem(LANGUAGE_KEY, id)
    } catch {
      /* ignore */
    }
    applyDocumentLang(id)
  }, [])

  useEffect(() => {
    applyDocumentLang(lang)
  }, [lang])

  useLayoutEffect(() => {
    const root = document.body
    if (!root) return undefined
    let frame = 0
    const run = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => translateDom(root, t, lang))
    }
    run()
    const observer = new MutationObserver(run)
    observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['placeholder', 'aria-label', 'title', 'alt'] })
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [lang, t, location.pathname, location.search])

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t,
      languages: LANGUAGES,
      locale: localeFor(lang),
      dir: LANGUAGES.find((item) => item.id === lang)?.dir || 'ltr',
    }),
    [lang, setLang, t],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useI18n() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useI18n must be used inside LanguageProvider')
  return ctx
}

export function useT() {
  return useI18n().t
}

export default LanguageContext
