import * as fs from 'fs'
import * as path from 'path'

import type * as Hast from 'hast'
import sizeOf from 'image-size'
// import loaderUtils from 'next/dist/compiled/loader-utils'
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

      if (typeof node.properties.src === 'string') {
        if (node.properties.src.startsWith('http://')) return
        if (node.properties.src.startsWith('https://')) return
        if (file.path == null) return

        const filePath = node.properties.src.startsWith('/')
          ? path.join(process.cwd(), 'public', node.properties.src)
          : path.join(path.dirname(file.path), node.properties.src)
        const dimensions = sizeOf(filePath)
        node.properties.width = dimensions.width
        node.properties.height = dimensions.height

        // TODO: content hash
        const newPath = path.join(
          'static',
          'image',
          path.relative(process.cwd(), filePath),
        )
        // const interpolatedName = loaderUtils.interpolateName(
        //   this,
        //   '/static/image/[path][name].[hash].[ext]',
        //   opts
        // )

        const outputPath = path.join('/_next', newPath)
        // const outputPath = path.join('/_next', interpolatedName)

        const fullDestinationPath = path.join(
          process.cwd(),
          '.next',
          // 'server',
          // 'chunks',
          newPath,
        )

        // TODO: only copy if !fs.existsSync / !fs.stats
        fs.mkdirSync(path.dirname(fullDestinationPath), { recursive: true })
        fs.copyFileSync(filePath, fullDestinationPath)
        node.properties.src = outputPath
        // TODO: similar to remark-mdx-images we need to construct a MdxJsxFlow node, so we can pass an object here.
        // node.properties.src = {
        //   src: outputPath,
        //   width: dimensions.width,
        //   height: dimensions.height,
        // }
      }
    }
  }
}
