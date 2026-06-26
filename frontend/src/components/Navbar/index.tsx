import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'

import { ThemeToggle } from '#/components/ThemeToggle'

import styles from './styles.module.css'

export interface NavLink {
  label: string
  to: string
  exact?: boolean
}

export const DEFAULT_NAV_LINKS: NavLink[] = [
  { label: 'Home', to: '/', exact: true },
  { label: 'Posts', to: '/posts' },
  { label: 'About', to: '/about' },
]

export interface NavbarProps {
  links?: NavLink[]
}

export function Navbar({ links = DEFAULT_NAV_LINKS }: NavbarProps) {
  const [open, setOpen] = useState(false)

  // Close the mobile menu on Escape.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className={styles.navbar}>
      <nav className={styles.inner} aria-label="Primary">
        <Link to="/" className={styles.brand} onClick={() => setOpen(false)}>
          <img className={styles.logo} src="/logo.svg" alt="" aria-hidden="true" />
          <span>The Blog</span>
        </Link>

        <div className={styles.right}>
          <ul
            id="primary-nav-links"
            className={`${styles.links} ${open ? styles.linksOpen : ''}`}
          >
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={styles.link}
                  activeProps={{ className: styles.linkActive }}
                  activeOptions={{ exact: link.exact ?? false }}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <ThemeToggle />

          <button
            type="button"
            className={styles.menuButton}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="primary-nav-links"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X size={20} strokeWidth={1.5} aria-hidden="true" />
            ) : (
              <Menu size={20} strokeWidth={1.5} aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
