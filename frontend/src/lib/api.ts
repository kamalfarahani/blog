import type { Post } from '#/components/Post/types'

/**
 * Base URL of the Django REST API. Used only on the server (inside server
 * functions), so the browser never talks to Django directly and no CORS
 * configuration is required.
 */
const API_BASE = process.env.API_URL ?? 'http://localhost:8000'

export interface Paginated<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

async function apiFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${path}`)
  }

  return response.json() as Promise<T>
}

export function fetchPosts(): Promise<Paginated<Post>> {
  return apiFetch<Paginated<Post>>('/api/posts/')
}

export function fetchPost(slug: string): Promise<Post> {
  return apiFetch<Post>(`/api/posts/${slug}/`)
}
