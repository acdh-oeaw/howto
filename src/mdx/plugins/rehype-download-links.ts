import type * as Hast from "hast";
import { type MDXJsxFlowElement, type MDXJsxTextElement } from "hast-util-to-estree";
import { type Transformer } from "unified";
import { visit } from "unist-util-visit";

import { copyAsset } from "@/mdx/utils/copyAsset";

/**
 * Rehype plugin which copies linked assets.
 */
export default function attacher(): Transformer<Hast.Root> {
	return async function transformer(tree, file) {
		visit(tree, "element", onElement);

		function onElement(node: Hast.Element) {
			if (node.tagName !== "a") return;

			const paths = copyAsset(node.properties?.href, file.path);
			if (paths == null) return;
			const { publicPath } = paths;

			node.properties = node.properties ?? {};
			node.properties.href = publicPath;
			node.properties.download = true;
		}

		/* @ts-expect-error Error in upstream types. */
		visit(tree, ["mdxJsxFlowElement", "mdxJsxTextElement"], onMdxJsxElement);

		function onMdxJsxElement(node: MDXJsxFlowElement | MDXJsxTextElement) {
			if (node.name !== "Download") return;

			const urlAttribute = node.attributes.find(
				/** Ignore `MDXJsxExpressionAttribute`. */
				(attribute) => {
					return "name" in attribute && attribute.name === "url";
				},
			);

			const paths = copyAsset(urlAttribute?.value, file.path, "asset");
			if (paths == null) return;
			const { publicPath } = paths;

			if (urlAttribute != null) {
				urlAttribute.value = publicPath;
			}
		}
	};
}
