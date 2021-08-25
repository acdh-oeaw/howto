import type { PostPreview } from '@/cms/api/posts.api'
import { getPostPreviews } from '@/cms/api/posts.api'
import type { Locale } from '@/i18n/i18n.config'

/**
 * Returns metadata for posts filtered by author id.
 */
export async function getPostPreviewsByAuthorId(
  id: string,
  locale: Locale,
): Promise<Array<PostPreview>> {
  const postPreviews = await getPostPreviews(locale)

  const postsByAuthor = postPreviews.filter((post) => {
    return post.authors.some((author) => {
      return author.id === id
    })
  })

  return postsByAuthor
}

/**
 * Returns metadata for posts filtered by tag id.
 */
export async function getPostPreviewsByTagId(
  id: string,
  locale: Locale,
): Promise<Array<PostPreview>> {
  const postPreviews = await getPostPreviews(locale)

  const postsByTag = postPreviews.filter((post) => {
    return post.tags.some((tag) => {
      return tag.id === id
    })
  })

  return postsByTag
}
