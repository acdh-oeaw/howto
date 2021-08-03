import * as fs from 'fs'
import * as path from 'path'

import { format } from 'prettier'

import { getCoursePreviews } from '@/cms/api/courses.api'
import { getPostPreviews } from '@/cms/api/posts.api'
import { log } from '@/utils/log'

/**
 * Dumps resource metadata to public folder as json.
 */
async function main() {
  const locale = 'en'

  const resources = await getPostPreviews(locale)
  const resourceRedirects: Record<string, string> = {}
  resources.forEach((resource) => {
    resourceRedirects[resource.uuid] = resource.id
  })
  fs.writeFileSync(
    path.join(process.cwd(), 'redirects.resources.json'),
    format(JSON.stringify(resourceRedirects), { parser: 'json' }),
    {
      encoding: 'utf-8',
    },
  )

  const courses = await getCoursePreviews(locale)
  const courseRedirects: Record<string, string> = {}
  courses.forEach((course) => {
    courseRedirects[course.uuid] = course.id
  })
  fs.writeFileSync(
    path.join(process.cwd(), 'redirects.courses.json'),
    format(JSON.stringify(resourceRedirects), { parser: 'json' }),
    {
      encoding: 'utf-8',
    },
  )
}

main()
  .then(() => log.success('Successfully updated redirects.'))
  .catch(log.error)
