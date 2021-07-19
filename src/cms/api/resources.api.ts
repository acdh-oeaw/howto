import type { PostPreview } from '@/cms/api/posts.api'

export const resourceKinds = ['posts'] as const

export type ResourceKind = typeof resourceKinds[number]

/**
 * Resource fields indexed with Algolia.
 */
export interface IndexedResource
  extends Pick<PostPreview, 'id' | 'title' | 'date' | 'lang' | 'abstract'> {
  kind: ResourceKind
  objectID: string
  authors: Array<
    Pick<PostPreview['authors'][number], 'id' | 'firstName' | 'lastName'>
  >
  tags: Array<Pick<PostPreview['tags'][number], 'id' | 'name'>>
  body: string
}
