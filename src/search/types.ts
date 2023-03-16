import type { CoursePreview } from '@/cms/api/courses.api'
import type { PostPreview } from '@/cms/api/posts.api'
import type { ResourceKind } from '@/cms/api/resources.api'

// TODO: central place for `type` (from cms/collection maybe)
type IndexedObject = IndexedCourse | IndexedResource
export type IndexedType = IndexedObject['type']

/**
 * Resource fields indexed with Algolia.
 */
export interface IndexedResource
  extends Pick<PostPreview, 'date' | 'id' | 'lang' | 'title' | 'uuid'> {
  type: 'resources'
  kind: ResourceKind
  objectID: string
  authors: Array<Pick<PostPreview['authors'][number], 'firstName' | 'id' | 'lastName'>>
  tags: Array<Pick<PostPreview['tags'][number], 'id' | 'name'>>
  /** Either the `abstract`, or a chunk of the `body`. */
  content: string
  /** Added id `content` is a chunk of the `body`, indicates the chunk's heading. */
  heading?: { id: string | null; title: string | null; depth: number }
}

/**
 * Course fields indexed with Algolia.
 */
export interface IndexedCourse
  extends Pick<CoursePreview, 'date' | 'id' | 'lang' | 'title' | 'uuid'> {
  type: 'courses'
  objectID: string
  tags: Array<Pick<CoursePreview['tags'][number], 'id' | 'name'>>
  /** Either the `abstract`, or a chunk of the `body`. */
  content: string
  /** Added id `content` is a chunk of the `body`, indicates the chunk's heading. */
  heading?: { id: string | null; title: string | null; depth: number }
}
