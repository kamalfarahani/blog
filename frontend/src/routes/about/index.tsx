import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { About } from '#/components/About'
import { fetchAbout } from '#/lib/api'

import styles from './about.module.css'

const getAbout = createServerFn({ method: 'GET' }).handler(
  async () => await fetchAbout(),
)

export const Route = createFileRoute('/about/')({
  component: AboutPage,
  loader: () => getAbout(),
  head: () => ({ meta: [{ title: 'About' }] }),
})

function AboutPage() {
  const about = Route.useLoaderData()

  if (!about) {
    return <p className={styles.empty}>The about page hasn’t been set up yet.</p>
  }

  return <About about={about} />
}
