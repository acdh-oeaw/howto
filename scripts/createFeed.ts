import * as fs from 'fs'
import * as path from 'path'

import { rss } from 'xast-util-feed'
import type { Channel, Entry } from 'xast-util-feed'
import { toXml } from 'xast-util-to-xml'

import { getPostPreviews } from '@/cms/api/posts.api'
import { getFullName } from '@/cms/utils/getFullName'
import { defaultLocale, locales } from '@/i18n/i18n.config'
import { routes } from '@/navigation/routes.config'
import { log } from '@/utils/log'
import { url as siteUrl } from '~/config/site.config'
import { siteMetadata } from '~/config/siteMetadata.config'

async function generate() {
  const resourcesByLocale = await Promise.all(
    locales.map((locale) => {
      return getPostPreviews(locale)
    }),
  )

  const resources = resourcesByLocale.flat()
  const metadata = siteMetadata[defaultLocale]

  const channel: Channel = {
    title: metadata.title,
    url: siteUrl, // metadata.url
    feedUrl: String(new URL('feed.xml', siteUrl)),
    description: metadata.description,
    // lang: locale,
    author: metadata.creator?.name,
    tags: ['Digital Humanities'],
  }

  const entries: Array<Entry> = resources.map((resource) => {
    return {
      title: resource.title,
      url: String(
        new URL(
          routes.resource({ kind: 'posts', id: resource.id }).pathname,
          siteUrl,
        ),
      ),
      description: resource.abstract,
      author: resource.authors.map((author) => getFullName(author)).join(', '),
      published: resource.date,
      tags: resource.tags.map((tag) => tag.name),
    }
  })

  const feed = toXml(rss(channel, entries))

  fs.writeFileSync(path.join(process.cwd(), 'public', 'feed.xml'), feed, {
    encoding: 'utf-8',
  })
}

/**
 * Generates RSS `feed.xml`.
 */
generate()
  .then(() => log.success('Successfully generated RSS feed.'))
  .catch(log.error)
