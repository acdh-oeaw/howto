import { join } from "node:path";

import { compile } from "@mdx-js/mdx";
import withFrontmatter from "remark-frontmatter";
import withGitHubMarkdown from "remark-gfm";
import withMdxFrontmatter from "remark-mdx-frontmatter";

import { type Locale } from "@/i18n/i18n.config";
import withTypographicQuotesAndDashes from "@/mdx/plugins/remark-smartypants";
import { readFile } from "@/mdx/readFile";

export async function getPageById(id: string, locale: Locale) {
	const filePath = join(process.cwd(), "content", "pages", locale, id + ".mdx");
	const vfile = await readFile(filePath);

	const result = await compile(vfile, {
		development: false,
		outputFormat: "function-body",
		useDynamicImport: false,
		remarkPlugins: [
			withGitHubMarkdown,
			withTypographicQuotesAndDashes,
			withFrontmatter,
			withMdxFrontmatter,
		],
	});

	return String(result);
}
