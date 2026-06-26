import styles from './styles.module.css'

export interface PostFeaturedImageProps {
  src: string
  alt: string
}

export function PostFeaturedImage({ src, alt }: PostFeaturedImageProps) {
  return (
    <figure className={styles.figure}>
      <img className={styles.image} src={src} alt={alt} loading="lazy" />
    </figure>
  )
}
