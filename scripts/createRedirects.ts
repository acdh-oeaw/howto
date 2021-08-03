import * as fs from 'fs'
import * as path from 'path'

import { getPostPreviews } from '@/cms/api/posts.api'
import { log } from '@/utils/log'

/**
 * Dumps resource metadata to public folder as json.
 */
async function main() {
  const locale = 'en'
  const resources = await getPostPreviews(locale)

  const redirects: Record<string, string> = {}
  resources.forEach((resource) => {
    redirects[resource.uuid] = resource.id
  })

  const outputFilePath = path.join(process.cwd(), 'redirects.resources.json')

  fs.writeFileSync(outputFilePath, JSON.stringify(redirects), {
    encoding: 'utf-8',
  })
}

main()
  .then(() => log.success('Successfully updated resource redirects.'))
  .catch(log.error)
