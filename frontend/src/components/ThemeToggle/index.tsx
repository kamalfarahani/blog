import { useEffect, useState } from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'

import { applyTheme, getStoredTheme, type ThemeMode } from '#/lib/theme'

import styles from './styles.module.css'

const ORDER: ThemeMode[] = ['light', 'dark', 'auto']
const LABEL: Record<ThemeMode, string> = {
  light: 'Light',
  dark: 'Dark',
  auto: 'System',
}
const ICON = { light: Sun, dark: Moon, auto: Monitor }

export function ThemeToggle() {
  // Theme lives in localStorage, unavailable during SSR. Render a stable
  // placeholder until mounted to avoid a hydration mismatch.
  const [mounted, setMounted] = useState(false)
  const [mode, setMode] = useState<ThemeMode>('auto')

  useEffect(() => {
    setMode(getStoredTheme())
    setMounted(true)
  }, [])

  // While in 'auto', follow live OS color-scheme changes.
  useEffect(() => {
    if (!mounted) return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      if (getStoredTheme() === 'auto') applyTheme('auto')
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [mounted])

  function cycle() {
    const next = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length]
    setMode(next)
    applyTheme(next)
  }

  const Icon = ICON[mode]

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={cycle}
      aria-label={
        mounted ? `Theme: ${LABEL[mode]}. Click to change.` : 'Toggle theme'
      }
      title={mounted ? LABEL[mode] : undefined}
    >
      {mounted ? (
        <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
      ) : (
        <span className={styles.placeholder} aria-hidden="true" />
      )}
    </button>
  )
}

export default ThemeToggle
