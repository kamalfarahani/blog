import type { Tag } from './types'
import styles from './styles.module.css'

export interface PostFooterProps {
  tags: Tag[]
}

export function PostFooter({ tags }: PostFooterProps) {
  if (tags.length === 0) return null

  return (
    <footer className={styles.footer}>
      <ul className={styles.tags}>
        {tags.map((tag) => (
          <li key={tag.id} className={styles.tag}>
            #{tag.name}
          </li>
        ))}
      </ul>
    </footer>
  )
}
