import { remark } from 'remark'
import toPlaintext from 'strip-markdown'
import type { Transformer } from 'unified'
import type * as Unist from 'unist'
import type { VFile } from 'vfile'

/**
 * Adds reading time to VFile data.
 */
export default function attacher(): Transformer {
  const WORDS_PER_MINUTE = 265
  /** Uses `alt` text for images, everything wrapped in custom mdx elements is removed. */
  const processor = remark().use(toPlaintext, {
    remove: ['mdxJsxFlowElement', 'mdxJsxTextElement'],
  })

  return transformer

  function transformer(tree: Unist.Node, file: VFile) {
    const clonedTree = JSON.parse(JSON.stringify(tree))
    const plainText = processor.stringify(processor.runSync(clonedTree))

    const words = plainText.trim().split(/\s+/)
    const minutes = Math.ceil(words.length / WORDS_PER_MINUTE)

    const data = file.data as { timeToRead: number }
    data.timeToRead = minutes
  }
}
