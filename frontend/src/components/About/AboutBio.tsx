import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

import styles from './styles.module.css'

export interface AboutBioProps {
  bio: string
}

export function AboutBio({ bio }: AboutBioProps) {
  return (
    <div className={styles.bio}>
      <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
        {bio}
      </Markdown>
    </div>
  )
}
