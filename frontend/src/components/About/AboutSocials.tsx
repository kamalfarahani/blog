import type { ComponentType } from 'react'
import { Github, Linkedin, Mail, Twitter } from 'lucide-react'

import type { About } from './types'
import styles from './styles.module.css'

interface SocialLink {
  href: string
  label: string
  Icon: ComponentType<{ size?: number; strokeWidth?: number }>
}

function buildSocials(about: About): SocialLink[] {
  const links: SocialLink[] = []
  if (about.email)
    links.push({ href: `mailto:${about.email}`, label: 'Email', Icon: Mail })
  if (about.github_url)
    links.push({ href: about.github_url, label: 'GitHub', Icon: Github })
  if (about.linkedin_url)
    links.push({ href: about.linkedin_url, label: 'LinkedIn', Icon: Linkedin })
  if (about.twitter_url)
    links.push({ href: about.twitter_url, label: 'Twitter', Icon: Twitter })
  return links
}

export interface AboutSocialsProps {
  about: About
}

export function AboutSocials({ about }: AboutSocialsProps) {
  const socials = buildSocials(about)

  if (socials.length === 0) return null

  return (
    <nav className={styles.socials} aria-label="Social links">
      {socials.map(({ href, label, Icon }) => {
        const external = !href.startsWith('mailto:')
        return (
          <a
            key={label}
            className={styles.social}
            href={href}
            aria-label={label}
            title={label}
            target={external ? '_blank' : undefined}
            rel={external ? 'noreferrer' : undefined}
          >
            <Icon size={20} strokeWidth={1.5} />
          </a>
        )
      })}
    </nav>
  )
}
