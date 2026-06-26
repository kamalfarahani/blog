import { PostCard } from '#/components/PostCard'
import type { Post } from '#/components/Post/types'

import styles from './styles.module.css'

export interface PostGridProps {
  posts: Post[]
  emptyMessage?: string
}

export function PostGrid({
  posts,
  emptyMessage = 'Nothing published yet.',
}: PostGridProps) {
  if (posts.length === 0) {
    return <p className={styles.empty}>{emptyMessage}</p>
  }

  return (
    <div className={styles.grid}>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}

export default PostGrid
