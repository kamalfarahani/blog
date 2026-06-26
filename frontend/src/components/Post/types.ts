export interface Category {
  id: number
  name: string
  slug: string
}

export interface Tag {
  id: number
  name: string
  slug: string
}

export type PostStatus = 'draft' | 'published'

export interface Post {
  id: number
  title: string
  slug: string
  body: string
  excerpt: string
  featured_image: string | null
  categories: Category[]
  tags: Tag[]
  status: PostStatus
  published_at: string | null
  created_at: string
  updated_at: string
}
