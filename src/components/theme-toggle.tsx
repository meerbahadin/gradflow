'use client'

import { flushSync } from 'react-dom'
import { ThemeSwitch } from '@/components/arc/theme-switch/theme-switch'
import { useTheme, type Theme } from '@/components/theme-provider'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const change = (next: Theme, _variant: string, trigger: HTMLElement) => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!document.startViewTransition || reduced) {
      setTheme(next)
      return
    }

    // grow the new theme out of the button as a circle that reaches the
    // farthest corner of the viewport
    const rect = trigger.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    const radius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    const transition = document.startViewTransition(() => {
      flushSync(() => setTheme(next))
    })

    // `ready` rejects when the browser skips the transition (a hidden tab, a
    // second toggle mid-flight); the theme has still been applied by then
    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${radius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 560,
          easing: 'cubic-bezier(.22,1,.36,1)',
          pseudoElement: '::view-transition-new(root)',
        }
      )
    }, () => {})
  }

  return (
    <ThemeSwitch theme={theme ?? 'light'} onThemeChange={change} iconOnly />
  )
}
