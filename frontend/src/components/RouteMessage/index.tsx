import type { ReactNode } from 'react'
import {
  Link,
  useRouter,
  type ErrorComponentProps,
} from '@tanstack/react-router'

import styles from './styles.module.css'

interface RouteMessageProps {
  eyebrow: string
  title: string
  text: string
  children?: ReactNode
}

export function RouteMessage({
  eyebrow,
  title,
  text,
  children,
}: RouteMessageProps) {
  return (
    <main className={styles.message}>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.text}>{text}</p>
      <div className={styles.actions}>{children}</div>
    </main>
  )
}

export function RootErrorComponent({ error }: ErrorComponentProps) {
  const router = useRouter()

  const handleRetry = () => {
    void router.invalidate()
  }

  return (
    <RouteMessage
      eyebrow="Something went wrong"
      title="We couldn’t load this page"
      text={
        error instanceof Error && error.message === 'fetch failed'
          ? 'The blog service is currently unreachable. Please make sure the backend is running and try again.'
          : 'An unexpected error occurred while loading this page.'
      }
    >
      <button
        type="button"
        className={styles.button}
        onClick={handleRetry}
      >
        Try again
      </button>
      <Link to="/" className={styles.link}>
        Back home
      </Link>
    </RouteMessage>
  )
}

export function RootNotFound() {
  return (
    <RouteMessage
      eyebrow="404"
      title="Page not found"
      text="The page you’re looking for doesn’t exist or has moved."
    >
      <Link to="/" className={styles.link}>
        Back home
      </Link>
    </RouteMessage>
  )
}
