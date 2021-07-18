import type { CoursePreview } from '@/cms/api/courses.api'
import { getCoursePreviews } from '@/cms/api/courses.api'
import type { Locale } from '@/i18n/i18n.config'

/**
 * Returns metadata for courses filtered by author id.
 */
// export async function getCoursePreviewsByAuthorId(
//   id: string,
//   locale: Locale,
// ): Promise<Array<CoursePreview>> {
//   const postPreviews = await getCoursePreviews(locale)

//   const coursesByAuthor = postPreviews.filter((post) =>
//     post.authors.some((author) => author.id === id),
//   )

//   return coursesByAuthor
// }

/**
 * Returns metadata for courses filtered by tag id.
 */
export async function getCoursePreviewsByTagId(
  id: string,
  locale: Locale,
): Promise<Array<CoursePreview>> {
  const postPreviews = await getCoursePreviews(locale)

  const coursesByTag = postPreviews.filter((post) =>
    post.tags.some((tag) => tag.id === id),
  )

  return coursesByTag
}
