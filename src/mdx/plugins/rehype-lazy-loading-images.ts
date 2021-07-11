import { createHash } from 'crypto'
import * as fs from 'fs'
import * as path from 'path'

import type * as Hast from 'hast'
import sizeOf from 'image-size'
import type { Transformer } from 'unified'
import visit from 'unist-util-visit'
import type { VFile } from 'vfile'

/**
 * Rehype plugin which adds `loading="lazy"` attribute to HTML `img` elements.
 */
export default function attacher(): Transformer {
  return transformer

  async function transformer(tree: Hast.Node, file: VFile) {
    visit(tree, 'element', visitor)

    function visitor(node: Hast.Element) {
      if (node.tagName !== 'img') return

      node.properties = node.properties ?? {}
      node.properties.loading = 'lazy'

      if (
        typeof node.properties.src === 'string' &&
        node.properties.src.length > 0
      ) {
        if (node.properties.src.startsWith('http://')) return
        if (node.properties.src.startsWith('https://')) return
        if (node.properties.src.startsWith('/')) return
        if (file.path == null) return

        const filePath = path.join(path.dirname(file.path), node.properties.src)
        const dimensions = sizeOf(filePath)
        node.properties.width = dimensions.width
        node.properties.height = dimensions.height

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
        // const outputPath = path.join('/_next', interpolatedName)

        const fullDestinationPath = path.join(process.cwd(), '.next', newPath)

        // TODO: only copy if !fs.existsSync / !fs.stats
        fs.mkdirSync(path.dirname(fullDestinationPath), { recursive: true })
        fs.copyFileSync(filePath, fullDestinationPath)
        node.properties.src = outputPath
        // TODO: similar to remark-mdx-images we need to construct a MdxJsxFlow node, so we can pass an object here.
        // https://github.com/remcohaszing/remark-mdx-images/blob/main/src/index.ts
        // node.properties.src = {
        //   src: outputPath,
        //   width: dimensions.width,
        //   height: dimensions.height,
        // }
      }
    }
  }
}
