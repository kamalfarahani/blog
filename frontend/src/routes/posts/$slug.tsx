import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'

import { Post } from '#/components/Post'
import { fetchPost } from '#/lib/api'

import styles from './$slug.module.css'

const getPost = createServerFn({ method: 'GET' })
  .validator((slug: string) => slug)
  .handler(async ({ data: slug }) => {
    try {
      return await fetchPost(slug)
    } catch {
      return null
    }
  })

export const Route = createFileRoute('/posts/$slug')({
  component: PostDetailPage,
  loader: async ({ params }) => {
    const post = await getPost({ data: params.slug })
    if (!post) throw notFound()
    return post
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}

    const description = loaderData.excerpt || loaderData.title
    const image = loaderData.featured_image ?? '/logo.svg'

    return {
      meta: [
        { title: loaderData.title },
        { name: 'description', content: description },
        // Open Graph
        { property: 'og:type', content: 'article' },
        { property: 'og:title', content: loaderData.title },
        { property: 'og:description', content: description },
        { property: 'og:image', content: image },
        // Twitter
        {
          name: 'twitter:card',
          content: loaderData.featured_image ? 'summary_large_image' : 'summary',
        },
        { name: 'twitter:title', content: loaderData.title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: image },
      ],
    }
  },
  notFoundComponent: PostNotFound,
})

function PostDetailPage() {
  const post = Route.useLoaderData()

  return (
    <div className={styles.wrapper}>
      <nav className={styles.nav}>
        <Link to="/posts" className={styles.back}>
          ← All posts
        </Link>
      </nav>
      <Post post={post} />
    </div>
  )
}

function PostNotFound() {
  return (
    <div className={styles.notFound}>
      <h1 className={styles.notFoundTitle}>Post not found</h1>
      <p className={styles.notFoundText}>
        This post may have been moved or never existed.
      </p>
      <Link to="/posts" className={styles.back}>
        ← All posts
      </Link>
    </div>
  )
}
