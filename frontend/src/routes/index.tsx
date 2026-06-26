import { createFileRoute } from '@tanstack/react-router'

import { Post } from '#/components/Post'
import type { Post as PostType } from '#/components/Post/types'

export const Route = createFileRoute('/')({ component: App })

const samplePost: PostType = {
  id: 1,
  title: 'On Stillness and the Empty Page',
  slug: 'on-stillness-and-the-empty-page',
  body: `There is a particular kind of quiet that arrives before the first word is written. It is not emptiness, but **potential** — the page waiting, patient and unhurried.

## The shape of beginning

We often mistake productivity for motion. Yet the most honest work begins in stillness:

- Stop reaching.
- Notice what is already here.
- Let the next step reveal itself.

> The rest will follow in its own time.

Begin small. A single sentence. A single breath. Read more on [the practice of attention](https://example.com).`,
  excerpt: 'A short meditation on beginning.',
  featured_image: null,
  categories: [{ id: 1, name: 'Essays', slug: 'essays' }],
  tags: [
    { id: 1, name: 'writing', slug: 'writing' },
    { id: 2, name: 'mindfulness', slug: 'mindfulness' },
  ],
  status: 'published',
  published_at: '2026-06-20T09:00:00Z',
  created_at: '2026-06-20T09:00:00Z',
  updated_at: '2026-06-20T09:00:00Z',
}

function App() {
  return <Post post={samplePost} />
}
