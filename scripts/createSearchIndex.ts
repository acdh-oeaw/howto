import { promises as fs } from 'node:fs'

import env from '@next/env'
import type { SearchIndex } from 'algoliasearch'
import algoliasearch from 'algoliasearch'
import { remark } from 'remark'
import withFrontmatter from 'remark-frontmatter'
import withGfm from 'remark-gfm'
import withMdx from 'remark-mdx'
import withHeadingIds from 'remark-slug'
import toPlaintext from 'strip-markdown'
import { VFile } from 'vfile'

import { getCourseFilePath, getCoursePreviews } from '@/cms/api/courses.api'
import { getPostFilePath, getPostPreviews } from '@/cms/api/posts.api'
import type { Locale } from '@/i18n/i18n.config'
import type { Chunk } from '@/mdx/plugins/remark-split-by-heading'
import withChunks from '@/mdx/plugins/remark-split-by-heading'
import type { IndexedCourse, IndexedResource } from '@/search/types'
import { log } from '@/utils/log'
import { noop } from '@/utils/noop'

// eslint-disable-next-line import/no-named-as-default-member
env.loadEnvConfig(process.cwd(), false, { info: noop, error: log.error })

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
 * Creates `unified` processor to split mdx into chunks by heading.
 */
async function createProcessor() {
  const processor = remark()
    .use(withFrontmatter)
    .use(withGfm)
    .use(withMdx)
    .use(withHeadingIds)
    .use(withChunks)

  return processor
}

/**
 * Creates `unified` processor to serialize mdx ast to plaintext. Keeps image alt text.
 */
async function createPlaintextProcessor() {
  const processor = remark()
    .use(withMdx)
    .use(toPlaintext, {
      remove: [
        [
          'mdxJsxFlowElement',
          function (node) {
            return node.children ?? []
          },
        ],
        [
          'mdxJsxTextElement',
          function (node) {
            return node.children ?? []
          },
        ],
      ],
    })

  return processor
}

async function getResourceObjects(
  locale: Locale,
): Promise<Array<IndexedResource>> {
  const processor = await createProcessor()
  const plaintextProcessor = await createPlaintextProcessor()

  const entries: Array<IndexedResource> = []

  const resources = await getPostPreviews(locale)
  await Promise.all(
    resources.map(async (resource) => {
      const entry = {
        type: 'resources' as const,
        kind: resource.kind,
        id: resource.id,
        uuid: resource.uuid,
        objectID: resource.uuid,
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
            id: tag.id,
            name: tag.name,
          }
        }),
      }

      entries.push({
        ...entry,
        content: resource.abstract,
      })

      const filePath = getPostFilePath(resource.id, locale)
      const fileContent = await fs.readFile(filePath, { encoding: 'utf-8' })

      const file = new VFile({ value: fileContent, path: filePath })
      const ast = processor.parse(file)
      await processor.run(ast, file)
      const chunks = file.data['chunks'] as Array<Chunk>
      await Promise.all(
        chunks.map(async (chunk, index) => {
          const plaintextAst = await plaintextProcessor.run(chunk.content)
          const content = plaintextProcessor.stringify(plaintextAst).trim()
          if (content.length > 0) {
            entries.push({
              ...entry,
              objectID: [entry.objectID, index].join('-'),
              content,
              heading: { id: chunk.id, title: chunk.title, depth: chunk.depth },
            })
          }
        }),
      )
    }),
  )

  return entries
}

async function getCourseObjects(locale: Locale): Promise<Array<IndexedCourse>> {
  const processor = await createProcessor()
  const plaintextProcessor = await createPlaintextProcessor()

  const entries: Array<IndexedCourse> = []

  const courses = await getCoursePreviews(locale)
  await Promise.all(
    courses.map(async (course) => {
      const entry = {
        type: 'courses' as const,
        id: course.id,
        uuid: course.uuid,
        objectID: course.uuid,
        title: course.title,
        date: course.date,
        lang: course.lang,
        tags: course.tags.map((tag) => {
          return {
            id: tag.id,
            name: tag.name,
          }
        }),
      }

      entries.push({
        ...entry,
        content: course.abstract,
      })

      const filePath = getCourseFilePath(course.id, locale)
      const fileContent = await fs.readFile(filePath, { encoding: 'utf-8' })

      const file = new VFile({ value: fileContent, path: filePath })
      const ast = processor.parse(file)
      await processor.run(ast, file)
      const chunks = file.data['chunks'] as Array<Chunk>
      await Promise.all(
        chunks.map(async (chunk, index) => {
          const plaintextAst = await plaintextProcessor.run(chunk.content)
          const content = plaintextProcessor.stringify(plaintextAst).trim()
          if (content.length > 0) {
            entries.push({
              ...entry,
              objectID: [entry.objectID, index].join('-'),
              content,
              heading: { id: chunk.id, title: chunk.title, depth: chunk.depth },
            })
          }
        }),
      )
    }),
  )

  return entries
}

/**
 * Updates Algolia search index.
 */
async function generate() {
  const searchIndex = getAlgoliaSearchIndex()
  if (searchIndex == null) return

  const locale = 'en'
  const resources = await getResourceObjects(locale)
  const courses = await getCourseObjects(locale)

  /** Clear search index, to avoid stale resources, or stale resource chunks. */
  await searchIndex.clearObjects()
  const { objectIDs } = await searchIndex.saveObjects([
    ...resources,
    ...courses,
  ])
  return objectIDs.length
}

generate()
  .then((n) => {
    log.success(
      `Successfully updated Algolia search index with ${n ?? 0} objects.`,
    )
  })
  .catch(log.error)
