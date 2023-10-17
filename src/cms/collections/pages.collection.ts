import { type CmsCollection } from "netlify-cms-core";

/**
 * Pages collection.
 */
export const collection: CmsCollection = {
	name: "pages",
	label: "Pages",
	label_singular: "Page",
	description: "",
	format: "frontmatter",
	files: [
		/**
		 * NetlifyCMS currently only supports "single_file" i18n mode for file collections,
		 * which we don't want, so we expose two separate file entries.
		 */
		{
			file: "content/pages/de/home.mdx",
			name: "home-de",
			label: "Home page (german)",
			fields: [
				{
					name: "title",
					label: "Title",
					hint: "",
				},
				{
					name: "body",
					label: "Content",
					hint: "",
					widget: "markdown",
				},
			],
		},
		{
			file: "content/pages/en/home.mdx",
			name: "home-en",
			label: "Home page (english)",
			fields: [
				{
					name: "title",
					label: "Title",
					hint: "",
				},
				{
					name: "body",
					label: "Content",
					hint: "",
					widget: "markdown",
				},
			],
		},
	],
};
