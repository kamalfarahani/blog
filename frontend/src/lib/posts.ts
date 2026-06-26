import type { Category, Post } from '#/components/Post/types'

/** Unique categories used across the given posts, sorted by name. */
export function collectCategories(posts: Post[]): Category[] {
  const unique = new Map<string, Category>()
  for (const post of posts) {
    for (const cat of post.categories) {
      unique.set(cat.slug, cat)
    }
  }
  return [...unique.values()].sort((a, b) => a.name.localeCompare(b.name))
}

/** Posts belonging to the given category slug, or all posts when no slug. */
export function filterPostsByCategory(posts: Post[], slug?: string): Post[] {
  if (!slug) return posts
  return posts.filter((post) => post.categories.some((c) => c.slug === slug))
}
