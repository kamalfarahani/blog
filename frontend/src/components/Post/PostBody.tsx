import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

import styles from './styles.module.css'

export interface PostBodyProps {
  body: string
}

export function PostBody({ body }: PostBodyProps) {
  return (
    <div className={styles.body}>
      <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {body}
      </Markdown>
    </div>
  )
}
