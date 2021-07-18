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

  const outputFolder = path.join(process.cwd(), 'public', 'resources')
  const outputFilePath = path.join(outputFolder, 'resources.json')

  fs.mkdirSync(outputFolder, { recursive: true })
  fs.writeFileSync(outputFilePath, JSON.stringify({ resources }), {
    encoding: 'utf-8',
  })
}

main()
  .then(() =>
    log.success('Successfully dumped resource metadata to public folder.'),
  )
  .catch(log.error)
