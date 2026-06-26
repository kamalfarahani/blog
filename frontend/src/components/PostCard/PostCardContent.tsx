import type { Category } from '#/components/Post/types'

import { PostCardMeta } from './PostCardMeta'
import styles from './styles.module.css'

export interface PostCardContentProps {
  title: string
  excerpt: string
  category?: Category
  publishedAt: string | null
}

export function PostCardContent({
  title,
  excerpt,
  category,
  publishedAt,
}: PostCardContentProps) {
  return (
    <div className={styles.content}>
      <PostCardMeta category={category} publishedAt={publishedAt} />

      <h2 className={styles.title}>{title}</h2>

      {excerpt && <p className={styles.excerpt}>{excerpt}</p>}
    </div>
  )
}
