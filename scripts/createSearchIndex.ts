import { promises as fs } from 'fs'

import { loadEnvConfig } from '@next/env'
import algoliasearch from 'algoliasearch'
import type { SearchIndex } from 'algoliasearch'
import remark from 'remark'
import withFootnotes from 'remark-footnotes'
import withFrontmatter from 'remark-frontmatter'
import withGfm from 'remark-gfm'
import toPlaintext from 'strip-markdown'

import { getPostFilePath, getPostPreviews } from '@/cms/api/posts.api'
import type { IndexedResource } from '@/cms/api/resources.api'
import { log } from '@/utils/log'
import { noop } from '@/utils/noop'

loadEnvConfig(process.cwd(), false, { info: noop, error: log.error })

/**
 * Returns algolia search client configured with admin permissions.
 */
function getAlgoliaSearchIndex(): SearchIndex | null {
  if (
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID == null ||
    process.env.ALGOLIA_ADMIN_API_KEY == null ||
    process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME == null
  ) {
    const error = new Error(
      'Failed to update search index because no Algolia config was provided.',
    )
    delete error.stack
    throw error
  }

  const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.ALGOLIA_ADMIN_API_KEY,
  )

  const searchIndex = searchClient.initIndex(
    process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME,
  )

  return searchIndex
}

/**
 * Creates `unified` processor to convert mdx to plaintext. Keeps image alt text.
 */
async function createProcessor() {
  // TODO:
  // const { remarkMdx } = await import('xdm/lib/plugin/remark-mdx')
  const processor = remark()
    .use(withFrontmatter)
    .use(withGfm)
    .use(withFootnotes)
    // .use(remarkMdx)
    .use(toPlaintext)
  return processor
}

/**
 * Updates Algolia search index.
 */
async function generate() {
  const searchIndex = getAlgoliaSearchIndex()
  if (searchIndex == null) return

  const processor = await createProcessor()

  const locale = 'en'
  const resources = await getPostPreviews(locale)
  const kind = 'posts' as const

  const resourcesWithAlgoliaId: Array<IndexedResource> = await Promise.all(
    resources
      .map((resource) => {
        return {
          id: resource.id,
          kind,
          objectID: `${kind}-${resource.id}`,
          title: resource.title,
          date: resource.date,
          lang: resource.lang,
          authors: resource.authors.map((author) => {
            return {
              id: author.id,
              lastName: author.lastName,
              firstName: author.firstName,
            }
          }),
          tags: resource.tags.map((tag) => {
            return {
              name: tag.name,
              id: tag.id,
            }
          }),
          abstract: resource.abstract,
        }
      })
      .map(async (resource) => {
        const filePath = getPostFilePath(resource.id, locale)
        const fileContent = await fs.readFile(filePath, { encoding: 'utf-8' })
        const plaintext = String(await processor.process(fileContent))
        return {
          ...resource,
          body: plaintext,
        }
      }),
  )

  return searchIndex.saveObjects(resourcesWithAlgoliaId)
}

generate()
  .then(() => log.success('Successfully updated Algolia search index.'))
  .catch(log.error)
