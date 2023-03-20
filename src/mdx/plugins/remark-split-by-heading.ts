import type { Root } from 'mdast'
import { toString } from 'mdast-util-to-string'
import type { Transformer } from 'unified'
import { SKIP, visit } from 'unist-util-visit'

export interface Chunk {
  title: string | null
  id: string | null
  depth: number
  content: Root
}

/**
 * Remark plugin which splits the tree by headings, and attaches the chunks
 * on the `VFile`'s `data.chunks` property.
 *
 * Useful e.g. for feeding a document in chunks to Algolia.
 */
export default function attacher(): Transformer<Root> {
  return function transformer(tree, file) {
    const chunks: Array<Chunk> = [
      {
        title: null,
        id: null,
        depth: 0,
        content: { type: 'root', children: [] },
      },
    ]

    visit(tree, function onNode(node) {
      if (node.type === 'root') return undefined

      if (node.type === 'heading') {
        const chunk: Chunk = {
          title: toString(node),
          id: (node.data?.id as string | undefined) ?? null,
          depth: node.depth,
          content: { type: 'root', children: [] },
        }
        chunks.push(chunk)
      } else {
        const last = chunks[chunks.length - 1]
        if (last != null) {
          last.content.children.push(node)
        }
      }

      return SKIP
    })

    file.data.chunks = chunks
  }
}
