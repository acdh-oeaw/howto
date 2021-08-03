import * as fs from 'fs'
import * as path from 'path'

import { getPostPreviews } from '@/cms/api/posts.api'
import { log } from '@/utils/log'

/**
 * Dumps resource metadata to public folder as json.
 */
async function main() {
  const locale = 'en'

  const outputFolder = path.join(process.cwd(), 'public', 'resources')
  fs.mkdirSync(outputFolder, { recursive: true })

  const resources = await getPostPreviews(locale)
  fs.writeFileSync(
    path.join(outputFolder, 'resources.json'),
    JSON.stringify({ resources }),
    {
      encoding: 'utf-8',
    },
  )
}

main()
  .then(() =>
    log.success('Successfully dumped resource metadata to public folder.'),
  )
  .catch(log.error)
