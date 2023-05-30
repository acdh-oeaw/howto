import type * as Hast from "hast";
import { h } from "hastscript";
import { type Transformer } from "unified";
import type * as Unist from "unist";
import { SKIP, visit } from "unist-util-visit";

/**
 * Rehype plugin which wraps images in `<figure>` and adds `<figcaption>` when a `title` attribute is provided.
 */
export default function attacher(): Transformer {
	return transformer;

	function transformer(tree: Hast.Node) {
		visit(tree, "element", visitor);

		function visitor(node: Hast.Element, index: number | null, parent: Unist.Parent | null) {
			if (node.tagName !== "img") return;
			if (node.properties?.title == null || parent == null) return;

			const title = node.properties.title as string;
			const figure = h("figure", [node, h("figcaption", title)]);

			if (index != null) {
				parent.children[index] = figure;
			}

			return SKIP;
		}
	}
}
