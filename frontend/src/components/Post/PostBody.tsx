import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import styles from './styles.module.css'

export interface PostBodyProps {
  body: string
}

export function PostBody({ body }: PostBodyProps) {
  return (
    <div className={styles.body}>
      <Markdown remarkPlugins={[remarkGfm]}>{body}</Markdown>
    </div>
  )
}
