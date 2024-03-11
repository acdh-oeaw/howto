/** @typedef {import("mdast-util-mdx").MdxJsxAttribute} MdxJsxAttribute */
/** @typedef {import("mdast-util-mdx").MdxJsxTextElement} MdxJsxTextElement */
/** @typedef {import("mdast-util-mdx").MdxJsxFlowElement} MdxJsxFlowElement */

import { SKIP, visit } from "unist-util-visit";

export function withMdxFootnotes() {
	return function transformer(/** @type {import("mdast").Root} */ tree) {
		let count = 1;

		/** @type {MdxJsxTextElement[]} */
		const footnotes = [];

		visit(tree, "mdxJsxTextElement", (node, index, parent) => {
			if (node.name === "Footnote") {
				/** @type {MdxJsxAttribute} */
				const countAttribute = {
					type: "mdxJsxAttribute",
					name: "count",
					value: String(count),
				};

				/** @type {MdxJsxTextElement} */
				const reference = {
					type: "mdxJsxTextElement",
					name: "FootnoteReference",
					attributes: [countAttribute],
					children: [],
				};

				/** @type {MdxJsxTextElement} */
				const content = {
					type: "mdxJsxTextElement",
					name: "FootnoteContent",
					attributes: [countAttribute],
					children: node.children,
				};

				// @ts-expect-error Parent node exists.
				parent.children.splice(index, 1, reference);
				footnotes.push(content);

				count++;
			}

			return SKIP;
		});

		if (footnotes.length > 0) {
			/** @type {MdxJsxFlowElement} */
			const section = {
				type: "mdxJsxFlowElement",
				name: "FootnotesSection",
				attributes: [],
				// @ts-expect-error Should be fine to set `MdxJsxTextElement` children.
				children: footnotes,
			};

			tree.children.push(section);
		}
	};
}
