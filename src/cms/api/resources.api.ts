import type { PostPreview } from '@/cms/api/posts.api'

export const resourceKinds = ['posts'] as const

export type ResourceKind = typeof resourceKinds[number]

/**
 * Resource fields indexed with Algolia.
 */
export interface IndexedResource extends Omit<PostPreview, 'authors' | 'tags'> {
  objectID: string
  kind: ResourceKind
  authors: Array<
    Pick<PostPreview['authors'][number], 'id' | 'firstName' | 'lastName'>
  >
  tags: Array<Pick<PostPreview['tags'][number], 'id' | 'name'>>
}
