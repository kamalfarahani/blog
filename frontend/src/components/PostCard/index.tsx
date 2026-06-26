import type { Post } from '#/components/Post/types'

import { PostCardContent } from './PostCardContent'
import { PostCardThumb } from './PostCardThumb'
import styles from './styles.module.css'

export { PostCardContent } from './PostCardContent'
export { PostCardMeta } from './PostCardMeta'
export { PostCardThumb } from './PostCardThumb'

export interface PostCardProps {
  post: Post
  /** Link target for the card. Defaults to `/posts/<slug>`. */
  href?: string
}

export function PostCard({ post, href }: PostCardProps) {
  const target = href ?? `/posts/${post.slug}`
  const [primaryCategory] = post.categories

  return (
    <article className={styles.card}>
      <a className={styles.link} href={target}>
        {post.featured_image && (
          <PostCardThumb src={post.featured_image} alt={post.title} />
        )}

        <PostCardContent
          title={post.title}
          excerpt={post.excerpt}
          category={primaryCategory}
          publishedAt={post.published_at}
        />
      </a>
    </article>
  )
}

export default PostCard
