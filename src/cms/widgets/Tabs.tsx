import { remarkMarkAndUnravel as withUnraveledJsxChildren } from "@mdx-js/mdx/lib/plugin/remark-mark-and-unravel";
import { type MDXJsxFlowElement } from "hast-util-to-estree";
import { type EditorComponentOptions } from "netlify-cms-core";
import { remark } from "remark";
import withGitHubMarkdown from "remark-gfm";
import withMdx from "remark-mdx";
import { type Node } from "unist";
import { visit } from "unist-util-visit";
import { type VFile } from "vfile";

function withTabs() {
	return function transformer(tree: Node, file: VFile) {
		const tabs: Array<any> = [];

		(file.data as any).tabs = tabs;

		visit(tree, "mdxJsxFlowElement", onMdx);

		function onMdx(node: MDXJsxFlowElement) {
			switch (node.name) {
				case "Tabs.Tab": {
					const title = node.attributes.find((attribute: any) => {
						return attribute.name === "title";
					})?.value;

					const content = processor.stringify({
						type: "root",
						/* @ts-expect-error Waiting for updated remark types. */
						children: node.children,
					});

					const tab = { title, content };
					tabs.push(tab);
					break;
				}
				default:
			}
		}
	};
}

const processor = remark()
	.use({
		settings: {
			bullet: "-",
			emphasis: "_",
			fences: true,
			incrementListMarker: true,
			listItemIndent: "one",
			resourceLink: true,
			rule: "-",
			strong: "*",
		},
	})
	.use(withMdx)
	.use(withUnraveledJsxChildren)
	.use(withGitHubMarkdown)
	.use(withTabs);

/**
 * Netlify CMS richtext editor widget for Tabs component.
 */
export const tabsEditorWidget: EditorComponentOptions = {
	id: "Tabs",
	label: "Tabs",
	summary: "{{fields.title}}",
	fields: [
		{
			name: "tabs",
			label: "Tabs",
			/* @ts-expect-error Missing in upstream types. */
			label_singular: "Tab",
			widget: "list",
			fields: [
				{
					name: "title",
					label: "Title",
				},
				{
					name: "content",
					label: "Panel",
					widget: "markdown",
					editor_components: ["image", "code-block", "Figure"],
					// modes: ['raw'],
				},
			],
		},
	],
	pattern: /^<Tabs>\n([^]*?)\n<\/Tabs>/,
	fromBlock(match) {
		/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */
		const children = match[1]!;
		const ast = processor.parse(children);
		const file = { data: {} };
		processor.runSync(ast, file);
		/* @ts-expect-error Cards are mutated in the transformer. */
		const tabs = file.data.tabs;

		return {
			tabs,
		};
	},
	toBlock(data) {
		const tabs = data.tabs ?? [];

		const ast: any = {
			type: "root",
			children: [
				{
					type: "mdxJsxFlowElement",
					name: "Tabs",
					children: tabs.map((tab: any) => {
						return {
							type: "mdxJsxFlowElement",
							name: "Tabs.Tab",
							attributes: [
								{
									type: "mdxJsxAttribute",
									name: "title",
									value: tab.title,
								},
							],
							children: [processor.parse(tab.content)],
						};
					}),
				},
			],
		};

		return String(processor.stringify(ast));
	},
	/**
	 * This is only used in `getWidgetFor` (which we don't use).
	 */
	toPreview() {
		return `Tabs`;
	},
};
