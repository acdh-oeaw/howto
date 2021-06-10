import type * as Hast from 'hast'
import type { Transformer } from 'unified'
import visit from 'unist-util-visit'

/**
 * Rehype plugin which adds `rel="noopener noreferrer"` attribute to HTML `anchor` elements.
 */
export default function attacher(): Transformer {
  return transformer

  function transformer(tree: Hast.Node) {
    visit(tree, 'element', visitor)

    function visitor(node: Hast.Element) {
      if (node.tagName !== 'a') return

      node.properties = node.properties ?? {}
      node.properties.target = '_blank'
      node.properties.rel = 'noopener noreferrer'
    }
  }
}
