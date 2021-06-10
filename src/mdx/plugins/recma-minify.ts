import { minify } from 'terser'
import type { Transformer } from 'unified'
import type { Node } from 'unist'

/**
 * Minifies xdm-compiled code.
 */
export default function attacher(): Transformer {
  return transform

  async function transform(tree: Node) {
    /* @ts-expect-error Missing in upstream type. */
    const minified = await minify(tree, {
      parse: { spidermonkey: true },
      format: { spidermonkey: true, code: false },
    })

    /* @ts-expect-error Missing in upstream type. */
    return minified.ast
  }
}
