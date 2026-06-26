import { Link } from '@tanstack/react-router'

import type { Category } from '#/components/Post/types'

import styles from './styles.module.css'

export interface CategoryFilterProps {
  categories: Category[]
  /** Slug of the currently active category, if any. */
  active?: string
}

export function CategoryFilter({ categories, active }: CategoryFilterProps) {
  if (categories.length === 0) return null

  return (
    <nav className={styles.filters} aria-label="Filter posts by category">
      <Link
        to="/posts"
        search={{}}
        className={!active ? styles.filterActive : styles.filter}
      >
        All
      </Link>
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          to="/posts"
          search={{ category: cat.slug }}
          className={active === cat.slug ? styles.filterActive : styles.filter}
        >
          {cat.name}
        </Link>
      ))}
    </nav>
  )
}

export default CategoryFilter
