import { AboutBio } from './AboutBio'
import { AboutHeader } from './AboutHeader'
import type { About as AboutModel } from './types'
import styles from './styles.module.css'

export { AboutBio } from './AboutBio'
export { AboutHeader } from './AboutHeader'
export { AboutSocials } from './AboutSocials'

export interface AboutProps {
  about: AboutModel
}

export function About({ about }: AboutProps) {
  return (
    <article className={styles.about}>
      <AboutHeader about={about} />
      <AboutBio bio={about.bio} />
    </article>
  )
}

export default About
