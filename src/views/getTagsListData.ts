import type { Tag } from '@/cms/api/tags.api'

export type TagsListItem = Pick<Tag, 'id' | 'name'>

export type TagsListData = Array<TagsListItem>

/**
 * Returns minimal data necessary for tags list view.
 */
export function getTagsListData(tags: Array<Tag>): TagsListData {
  return tags.map((tag) => {
    const tagData = {
      id: tag.id,
      name: tag.name,
    }
    return tagData
  })
}
