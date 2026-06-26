import { useMemo } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { CategoryFilter } from '#/components/CategoryFilter'
import { PostGrid } from '#/components/PostGrid'
import { fetchPosts } from '#/lib/api'
import { collectCategories, filterPostsByCategory } from '#/lib/posts'

import styles from './posts.module.css'

const getPosts = createServerFn({ method: 'GET' }).handler(async () => {
  const { results } = await fetchPosts()
  return results
})

interface PostsSearch {
  category?: string
}

export const Route = createFileRoute('/posts/')({
  validateSearch: (search: Record<string, unknown>): PostsSearch => ({
    category:
      typeof search.category === 'string' ? search.category : undefined,
  }),
  component: PostsPage,
  loader: () => getPosts(),
})

function PostsPage() {
  const posts = Route.useLoaderData()
  const { category } = Route.useSearch()
  const categories = useMemo(() => collectCategories(posts), [posts])
  const visiblePosts = filterPostsByCategory(posts, category)

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>The Journal</p>
        <h1 className={styles.heading}>Posts</h1>
        <p className={styles.subtitle}>
          A quiet collection of writing — read at your own pace.
        </p>
        <span className={styles.divider} aria-hidden="true" />
      </header>

      <CategoryFilter categories={categories} active={category} />

      <PostGrid
        posts={visiblePosts}
        emptyMessage={
          category ? 'No posts in this category.' : 'Nothing published yet.'
        }
      />
    </main>
  )
}
