import withSyntaxHighlighter from "@shikijs/rehype";
import withFrontmatter from "remark-frontmatter";
import withGfm from "remark-gfm";
import withMdxFrontmatter from "remark-mdx-frontmatter";
import withTypographicQuotes from "remark-smartypants";

import { withMdxFootnotes } from "../lib/content/footnotes.js";
import { config as syntaxHighlighterConfig } from "./syntax-highlighter.config.js";

/** @type {import('@mdx-js/mdx').CompileOptions} */
export const config = {
	remarkPlugins: [
		withFrontmatter,
		withMdxFrontmatter,
		withGfm,
		withMdxFootnotes,
		withTypographicQuotes,
	],
	rehypePlugins: [[withSyntaxHighlighter, syntaxHighlighterConfig]],
};
