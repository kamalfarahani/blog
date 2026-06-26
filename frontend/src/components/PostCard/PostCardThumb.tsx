import styles from './styles.module.css'

export interface PostCardThumbProps {
  src: string
  alt: string
}

export function PostCardThumb({ src, alt }: PostCardThumbProps) {
  return (
    <div className={styles.thumb}>
      <img className={styles.image} src={src} alt={alt} loading="lazy" />
    </div>
  )
}
