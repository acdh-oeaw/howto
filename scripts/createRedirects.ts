import * as fs from 'node:fs'
import * as path from 'node:path'

import prettier from 'prettier'

import { getCoursePreviews } from '@/cms/api/courses.api'
import { getPostPreviews } from '@/cms/api/posts.api'
import { log } from '@/utils/log'

function createRedirects(resources: Array<{ uuid: string; id: string }>, fileName: string) {
  const redirects: Record<string, string> = {}

  resources.forEach((resource) => {
    redirects[resource.uuid] = resource.id
  })

  fs.writeFileSync(
    path.join(process.cwd(), fileName),

    prettier.format(JSON.stringify(redirects), { parser: 'json' }),
    {
      encoding: 'utf-8',
    },
  )
}

/**
 * Creates redirects for UUID urls.
 */
async function main() {
  const locale = 'en'

  const resources = await getPostPreviews(locale)
  createRedirects(resources, 'redirects.resources.json')

  const courses = await getCoursePreviews(locale)
  createRedirects(courses, 'redirects.courses.json')
}

main()
  .then(() => {
    log.success('Successfully updated redirects.')
  })
  .catch(log.error)
