import { PostBody } from './PostBody'
import { PostFeaturedImage } from './PostFeaturedImage'
import { PostFooter } from './PostFooter'
import { PostHeader } from './PostHeader'
import type { Post as PostModel } from './types'
import styles from './styles.module.css'

export type { Category, Tag, PostStatus } from './types'
export { PostBody } from './PostBody'
export { PostFeaturedImage } from './PostFeaturedImage'
export { PostFooter } from './PostFooter'
export { PostHeader } from './PostHeader'

export interface PostProps {
  post: PostModel
}

export function Post({ post }: PostProps) {
  return (
    <article className={styles.post}>
      {post.featured_image && (
        <PostFeaturedImage src={post.featured_image} alt={post.title} />
      )}

      <PostHeader
        title={post.title}
        categories={post.categories}
        publishedAt={post.published_at}
      />

      <PostBody body={post.body} />

      <PostFooter tags={post.tags} />
    </article>
  )
}

export default Post
