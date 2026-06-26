import { Link } from '@tanstack/react-router'

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
]

export interface NavbarProps {
  links?: NavLink[]
}

export function Navbar({ links = DEFAULT_NAV_LINKS }: NavbarProps) {
  return (
    <header className={styles.navbar}>
      <nav className={styles.inner} aria-label="Primary">
        <Link to="/" className={styles.brand}>
          The Blog
        </Link>

        <div className={styles.right}>
          <ul className={styles.links}>
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={styles.link}
                  activeProps={{ className: styles.linkActive }}
                  activeOptions={{ exact: link.exact ?? false }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}

export default Navbar
