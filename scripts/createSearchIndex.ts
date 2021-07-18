import algoliasearch from 'algoliasearch'
import type { SearchIndex } from 'algoliasearch'

import { getPostPreviews } from '@/cms/api/posts.api'
import type { IndexedResource } from '@/cms/api/resources.api'
import { log } from '@/utils/log'

/**
 * Returns algolia search client configured with write permissions.
 */
function getAlgoliaSearchIndex(): SearchIndex | null {
  if (
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID == null ||
    process.env.ALGOLIA_API_KEY == null ||
    process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME == null
  ) {
    throw new Error(
      'Failed to update search index because no Algolia config was provided.',
    )
  }

  const searchClient = algoliasearch(
    process.env.NEXT_PUBLIC_ALGOLIA_APP_ID,
    process.env.ALGOLIA_API_KEY,
  )

  const searchIndex = searchClient.initIndex(
    process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME,
  )

  return searchIndex
}

/**
 * Updates Algolia search index.
 */
async function generate() {
  const searchIndex = getAlgoliaSearchIndex()
  if (searchIndex == null) return

  const locale = 'en'
  const resources = await getPostPreviews(locale)
  const kind = 'posts'

  const resourcesWithAlgoliaId: Array<IndexedResource> = resources.map(
    (resource) => {
      return {
        ...resource,
        objectID: `${kind}-${resource.id}`,
        kind,
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
      }
    },
  )

  searchIndex.saveObjects(resourcesWithAlgoliaId)
}

generate()
  .then(() => log.success('Successfully updated Algolia search index.'))
  .catch(log.error)
