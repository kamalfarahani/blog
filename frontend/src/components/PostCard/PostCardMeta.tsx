import { formatDate } from '#/utils/date'
import type { Category } from '#/components/Post/types'

import styles from './styles.module.css'

export interface PostCardMetaProps {
  category?: Category
  publishedAt: string | null
}

export function PostCardMeta({ category, publishedAt }: PostCardMetaProps) {
  const published = formatDate(publishedAt)

  if (!category && !published) return null

  return (
    <div className={styles.meta}>
      {category && <span className={styles.category}>{category.name}</span>}
      {published && (
        <time className={styles.date} dateTime={publishedAt ?? undefined}>
          {published}
        </time>
      )}
    </div>
  )
}
