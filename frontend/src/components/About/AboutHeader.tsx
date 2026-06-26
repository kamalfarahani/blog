import { AboutSocials } from './AboutSocials'
import type { About } from './types'
import styles from './styles.module.css'

export interface AboutHeaderProps {
  about: About
}

export function AboutHeader({ about }: AboutHeaderProps) {
  return (
    <header className={styles.header}>
      {about.photo && (
        <img
          className={styles.photo}
          src={about.photo}
          alt={about.name}
          loading="lazy"
        />
      )}
      <h1 className={styles.name}>{about.name}</h1>
      <AboutSocials about={about} />
    </header>
  )
}
