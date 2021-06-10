import type * as Hast from 'hast'
import type { Transformer } from 'unified'
import visit from 'unist-util-visit'

/**
 * Rehype plugin which adds `loading="lazy"` attribute to HTML `img` elements.
 */
export default function attacher(): Transformer {
  return transformer

  function transformer(tree: Hast.Node) {
    visit(tree, 'element', visitor)

    function visitor(node: Hast.Element) {
      if (node.tagName !== 'img') return

      node.properties = node.properties ?? {}
      node.properties.loading = 'lazy'
    }
  }
}
