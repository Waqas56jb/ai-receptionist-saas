import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const SiteThemeContext = createContext({
  theme: 'dark',
  toggle: () => {},
})

function readStoredTheme() {
  if (typeof document === 'undefined') return 'dark'
  const attr = document.documentElement.getAttribute('data-site-theme')
  if (attr === 'light' || attr === 'dark') return attr
  try {
    const stored = window.localStorage.getItem('site-theme')
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    /* storage blocked */
  }
  return 'dark'
}

export function SiteThemeProvider({ children }) {
  const [theme, setTheme] = useState(readStoredTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-site-theme', theme)
    try {
      window.localStorage.setItem('site-theme', theme)
    } catch {
      /* storage blocked */
    }
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [])

  const value = useMemo(() => ({ theme, toggle }), [theme, toggle])

  return <SiteThemeContext.Provider value={value}>{children}</SiteThemeContext.Provider>
}

export function useSiteTheme() {
  return useContext(SiteThemeContext)
}
