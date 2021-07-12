import { createHash } from 'crypto'
import * as fs from 'fs'
import * as path from 'path'

import type * as Hast from 'hast'
import type { Transformer } from 'unified'
import visit from 'unist-util-visit'
import type { VFile } from 'vfile'

/**
 * Rehype plugin which copies linked assets.
 */
export default function attacher(): Transformer {
  return transformer

  async function transformer(tree: Hast.Node, file: VFile) {
    visit(tree, 'element', visitor)

    function visitor(node: Hast.Element) {
      if (node.tagName !== 'a') return

      node.properties = node.properties ?? {}

      if (
        typeof node.properties.href === 'string' &&
        node.properties.href.length > 0
      ) {
        if (node.properties.href.startsWith('http://')) return
        if (node.properties.href.startsWith('https://')) return
        if (node.properties.href.startsWith('/')) return
        if (node.properties.href.startsWith('#')) return
        if (file.path == null) return

        const filePath = path.join(
          path.dirname(file.path),
          node.properties.href,
        )

        const buffer = fs.readFileSync(filePath, { encoding: 'binary' })
        const hash = createHash('md4')
        hash.update(buffer)

        const newFileName = path.join(
          path.dirname(filePath),
          hash.digest('hex').substr(0, 9999) + path.extname(filePath),
        )
        const newPath = path.join(
          'static',
          'image',
          path.relative(process.cwd(), newFileName),
        )

        const outputPath = path.join('/_next', newPath)
        const fullDestinationPath = path.join(process.cwd(), '.next', newPath)

        if (!fs.existsSync(fullDestinationPath)) {
          fs.mkdirSync(path.dirname(fullDestinationPath), { recursive: true })
          fs.copyFileSync(filePath, fullDestinationPath)
        }

        node.properties.href = outputPath
        node.properties.download = true
      }
    }
  }
}
