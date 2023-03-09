import * as fs from 'fs'
import * as path from 'path'

import { getCoursePreviews } from '@/cms/api/courses.api'
import { getPostPreviews } from '@/cms/api/posts.api'
import { log } from '@/utils/log'

/**
 * Dumps metadata to public folder as json.
 */
async function main() {
  const locale = 'en'

  const outputFolder = path.join(process.cwd(), 'public', 'metadata')
  fs.mkdirSync(outputFolder, { recursive: true })

  const resourcesPreviews = await getPostPreviews(locale)
  const resources = resourcesPreviews.map((preview) => {
    if (typeof preview.featuredImage === 'object') {
      delete preview.featuredImage.blurDataURL
    }
    return {
      ...preview,
      authors: preview.authors.map((author) => {
        if (typeof author.avatar === 'object') {
          delete author.avatar.blurDataURL
        }
        return author
      }),
      editors:
        preview.editors?.map((editor) => {
          if (typeof editor.avatar === 'object') {
            delete editor.avatar.blurDataURL
          }
          return editor
        }) ?? [],
      contributors:
        preview.contributors?.map((contributor) => {
          if (typeof contributor.avatar === 'object') {
            delete contributor.avatar.blurDataURL
          }
          return contributor
        }) ?? [],
    }
  })
  fs.writeFileSync(path.join(outputFolder, 'resources.json'), JSON.stringify({ resources }), {
    encoding: 'utf-8',
  })

  const curriculaPreviews = await getCoursePreviews(locale)
  const curricula = curriculaPreviews.map((preview) => {
    if (typeof preview.featuredImage === 'object') {
      delete preview.featuredImage.blurDataURL
    }
    return {
      ...preview,
      editors:
        preview.editors?.map((author) => {
          if (typeof author.avatar === 'object') {
            delete author.avatar.blurDataURL
          }
          return author
        }) ?? [],
    }
  })
  fs.writeFileSync(path.join(outputFolder, 'curricula.json'), JSON.stringify({ curricula }), {
    encoding: 'utf-8',
  })
}

main()
  .then(() => {
    log.success('Successfully dumped metadata to public folder.')
  })
  .catch(log.error)
