import type { ResourcePreview } from '@/cms/api/resources.api'

export interface ResourcesListItem
  extends Pick<ResourcePreview, 'abstract' | 'id' | 'kind' | 'title'> {
  authors: Array<Pick<ResourcePreview['authors'][number], 'firstName' | 'id' | 'lastName'>>
}

export type ResourcesListData = Array<ResourcesListItem>

/**
 * Returns minimal data necessary for resources list view.
 */
export function getResourcesListData(resources: Array<ResourcePreview>): ResourcesListData {
  return resources.map((resource) => {
    const resourceData = {
      id: resource.id,
      kind: resource.kind,
      title: resource.shortTitle ?? resource.title,
      abstract: resource.abstract,
      authors: resource.authors.map((author) => {
        const authorData = {
          id: author.id,
          firstName: author.firstName,
          lastName: author.lastName,
        }
        return authorData
      }),
    }
    return resourceData
  })
}
