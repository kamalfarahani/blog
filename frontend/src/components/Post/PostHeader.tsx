import { formatDate } from '#/utils/date'

import type { Category } from './types'
import styles from './styles.module.css'

export interface PostHeaderProps {
  title: string
  categories: Category[]
  publishedAt: string | null
}

export function PostHeader({ title, categories, publishedAt }: PostHeaderProps) {
  const published = formatDate(publishedAt)

  return (
    <header className={styles.header}>
      {categories.length > 0 && (
        <ul className={styles.categories}>
          {categories.map((category) => (
            <li key={category.id} className={styles.category}>
              {category.name}
            </li>
          ))}
        </ul>
      )}

      <h1 className={styles.title}>{title}</h1>

      {published && (
        <time className={styles.date} dateTime={publishedAt ?? undefined}>
          {published}
        </time>
      )}
    </header>
  )
}
