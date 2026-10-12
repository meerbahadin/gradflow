'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from 'react'
import { useServerInsertedHTML } from 'next/navigation'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'gradflow-theme'

type ThemeContextValue = {
  /** undefined until the client has read the stored preference */
  theme: Theme | undefined
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

/**
 * Runs before first paint so the stored theme is applied without a flash.
 * It is injected through useServerInsertedHTML because React 19 refuses to
 * run a <script> element rendered from a component.
 */
const BLOCKING_SCRIPT = `(function(){try{var s=localStorage.getItem('${STORAGE_KEY}');var d=s?s==='dark':matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.dataset.theme=d?'dark':'light'}catch(e){}})()`

const systemTheme = (): Theme =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

// The <html> data-theme attribute is the source of truth: the blocking script
// writes it before React starts, and the provider only reads it back.
const subscribe = (onChange: () => void) => {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  })
  return () => observer.disconnect()
}

const getSnapshot = (): Theme | undefined => {
  const applied = document.documentElement.dataset.theme
  return applied === 'dark' || applied === 'light' ? applied : undefined
}

const getServerSnapshot = () => undefined

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  useServerInsertedHTML(() => (
    // a constant defined above, never user input
    <script dangerouslySetInnerHTML={{ __html: BLOCKING_SCRIPT }} />
  ))

  // follow the OS until the visitor picks a theme themselves
  useEffect(() => {
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      try {
        if (localStorage.getItem(STORAGE_KEY)) return
      } catch {
        // storage blocked: fall through and follow the OS
      }
      document.documentElement.dataset.theme = systemTheme()
    }
    query.addEventListener('change', onChange)

    return () => query.removeEventListener('change', onChange)
  }, [])

  const setTheme = useCallback((next: Theme) => {
    document.documentElement.dataset.theme = next
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // private mode or blocked storage: the theme still applies for this visit
    }
  }, [])

  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
