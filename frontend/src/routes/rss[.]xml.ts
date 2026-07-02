import RSS from 'rss'
import { createFileRoute } from '@tanstack/react-router'

import { fetchPosts } from '#/lib/api'

const SITE_NAME = 'The Blog'
const SITE_DESCRIPTION =
  'A quiet corner of the internet for essays, engineering notes, and the occasional book.'

export const Route = createFileRoute('/rss.xml')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const siteUrl = new URL(request.url).origin
        const { results: posts } = await fetchPosts()

        const feed = new RSS({
          title: SITE_NAME,
          description: SITE_DESCRIPTION,
          feed_url: `${siteUrl}/rss.xml`,
          site_url: siteUrl,
          language: 'en',
          pubDate: new Date(),
        })

        for (const post of posts) {
          const date = post.published_at ?? post.created_at

          feed.item({
            title: post.title,
            description: post.excerpt || post.title,
            url: `${siteUrl}/posts/${post.slug}`,
            date: new Date(date),
            custom_elements: [
              { 'content:encoded': { _cdata: post.body } },
            ],
            enclosure: post.featured_image
              ? { url: post.featured_image, type: 'image/jpeg' }
              : undefined,
          })
        }

        return new Response(feed.xml({ indent: true }), {
          status: 200,
          headers: { 'Content-Type': 'text/xml; charset=utf-8' },
        })
      },
    },
  },
})
