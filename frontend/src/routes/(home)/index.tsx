import { Link, createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { PostGrid } from '#/components/PostGrid'
import { fetchPosts } from '#/lib/api'

import styles from './index.module.css'

const LATEST_COUNT = 6

const getLatestPosts = createServerFn({ method: 'GET' }).handler(async () => {
  const { results } = await fetchPosts()
  return [...results]
    .sort((a, b) => {
      const at = a.published_at ?? a.created_at
      const bt = b.published_at ?? b.created_at
      return bt.localeCompare(at)
    })
    .slice(0, LATEST_COUNT)
})

export const Route = createFileRoute('/(home)/')({
  component: HomePage,
  loader: () => getLatestPosts(),
})

function HomePage() {
  const posts = Route.useLoaderData()

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>The Blog</p>
        <h1 className={styles.title}>Thoughts on craft, code, and stillness.</h1>
        <p className={styles.tagline}>
          A quiet corner of the internet for essays, engineering notes, and the
          occasional book. Read at your own pace.
        </p>
      </section>

      <section className={styles.latest}>
        <div className={styles.latestHeader}>
          <h2 className={styles.latestHeading}>Latest</h2>
          <Link to="/posts" className={styles.viewAll}>
            View all →
          </Link>
        </div>

        <PostGrid posts={posts} emptyMessage="Nothing published yet." />
      </section>
    </main>
  )
}
