import { cp, mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";

import { log } from "@acdh-oeaw/lib";
import type { Link, Yaml } from "mdast";
import type { MdxJsxAttribute, MdxJsxFlowElement, MdxJsxTextElement } from "mdast-util-mdx";
import withFrontmatter from "remark-frontmatter";
import withGfm from "remark-gfm";
import withMdx from "remark-mdx";
import fromMarkdown from "remark-parse";
import toMarkdown from "remark-stringify";
import { read } from "to-vfile";
import { unified } from "unified";
import { EXIT, visit } from "unist-util-visit";
import * as YAML from "yaml";

import type { Person, Resource, Tag } from "@/lib/content/types";

const allowedResources = [
	"corpus-query-language-im-austrian-media-corpus",
	"datenmanagement-uebung",
	"einfuehrung-metadaten",
	"grundlagen-datenmanagement",
	"langzeitarchivierung",
];

declare module "vfile" {
	interface DataMap {
		slug: string;
	}
}

const outputBaseFolder = join(process.cwd(), ".content");
const outputFolder = join(outputBaseFolder, "posts");
const contentBaseFolder = join(process.cwd(), "content");
const contentFolder = join(contentBaseFolder, "resources");
const publicFolder = join(process.cwd(), "public");

const processor = unified()
	.use(fromMarkdown)
	.use(withMdx)
	.use(withFrontmatter)
	.use(withGfm)
	.use(() => {
		return async function transform(tree, file) {
			const people = new Set<string>();
			const tags = new Set<string>();

			const featuredImages = new Map<string, string>();

			function convertImagePath(pathname: string | null, outputFolder: string) {
				if (!pathname) return undefined;

				const sourcePath = join(publicFolder, pathname);
				const publicImagePath = join("images", basename(pathname));

				const targetPath = join(outputFolder, publicImagePath);
				featuredImages.set(sourcePath, targetPath);

				return publicImagePath;
			}

			visit(tree, "yaml", (node: Yaml) => {
				const metadata = YAML.parse(node.value) as Resource;

				metadata.authors.forEach((id) => {
					people.add(id);
				});

				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				metadata.editors?.forEach((id) => {
					people.add(id);
				});

				metadata.tags.forEach((id) => {
					tags.add(id);
				});

				const featuredImage = convertImagePath(
					metadata.featuredImage,
					join(outputFolder, file.data.slug),
				);

				node.value = YAML.stringify({
					title: metadata.title,
					shortTitle: metadata.summaryTitle,
					lang: metadata.locale,
					date: metadata.publicationDate,
					version: metadata.version,
					authors: metadata.authors,
					editors: metadata.editors,
					tags: metadata.tags,
					categories: ["acdh-ch"],
					featuredImage,
					abstract: metadata.summary,
					domain: "Social Sciences and Humanities",
					targetGroup: "Domain researchers",
					type: "training-module",
					licence: "ccby-4.0",
					toc: metadata.toc,
					draft: false,
				});

				return EXIT;
			});

			visit(tree, "link", (node: Link) => {
				const url = node.url;

				if (url.startsWith("/")) {
					if (url.startsWith("/curricula")) {
						node.url = url.replace("/curricula", "/curriculum");
					}

					if (url.startsWith("/resources")) {
						node.url = url.replace("/resources", "/resource/posts");
					}

					// if (url.startsWith("/resource/posts")) {
					// 	node.url = url.replace("/resource/posts", "/resource/posts")
					// }
				}
			});

			// @ts-expect-error Ignore this error!
			visit(
				tree,
				["mdxJsxFlowElement", "mdxJsxTextElement"],
				(node: MdxJsxFlowElement | MdxJsxTextElement) => {
					switch (node.name) {
						case "Callout": {
							const map = {
								caution: "danger",
								note: "note",
								tip: "tip",
								warning: "warning",
								important: "info",
							};
							const attr = (node.attributes as Array<MdxJsxAttribute>).find((a) => {
								return a.name === "kind";
							});
							node.name = "SideNote";
							const kind = attr?.value as keyof typeof map | undefined;
							if (kind && attr) {
								attr.value = map[kind];
								attr.name = "type";
							}
							break;
						}

						case "Download": {
							const attr = (node.attributes as Array<MdxJsxAttribute>).find((a) => {
								return a.name === "href";
							});
							const src = attr?.value as string | undefined;
							if (src && attr) {
								attr.value = convertImagePath(src, join(outputFolder, file.data.slug));
								attr.name = " url";
							}
							break;
						}

						case "Figure": {
							const attr = (node.attributes as Array<MdxJsxAttribute>).find((a) => {
								return a.name === "src";
							});
							const src = attr?.value as string | undefined;
							if (src && attr) {
								attr.value = convertImagePath(src, join(outputFolder, file.data.slug));
							}
							break;
						}

						case "Footnote": {
							// TODO: should we just convert to regular pandoc footnotes?
							// or rather upstream mdx footnote support to dariah campus?
							break;
						}

						case "Quiz": {
							break;
						}
						case "QuizChoice": {
							node.name = "Quiz.Card";
							node.children = [
								{
									type: "mdxJsxFlowElement",
									name: "Quiz.MultipleChoice",
									attributes: [
										{
											type: "mdxJsxAttribute",
											name: "variant",
											value: (node.attributes as Array<MdxJsxAttribute>).find((a) => {
												return a.name === "variant";
											})?.value,
										},
									],
									children: node.children,
								},
							];
							node.attributes = [];
							break;
						}
						case "QuizChoiceQuestion": {
							node.name = "Quiz.Question";
							break;
						}
						case "QuizChoiceAnswer": {
							const attr = (node.attributes as Array<MdxJsxAttribute>).find((a) => {
								return a.name === "kind";
							});
							const isCorrect = attr?.value === "correct";

							node.name = "Quiz.MultipleChoice.Option";
							node.attributes = isCorrect
								? [
										{
											type: "mdxJsxAttribute",
											name: "isCorrect",
											value: undefined,
										},
									]
								: [];
							break;
						}
						case "QuizSuccessMessage": {
							node.name = "Quiz.Message";
							node.attributes = [
								{
									type: "mdxJsxAttribute",
									name: "type",
									value: "correct",
								},
							];
							break;
						}
						case "QuizErrorMessage": {
							node.name = "Quiz.Message";
							node.attributes = [
								{
									type: "mdxJsxAttribute",
									name: "type",
									value: "incorrect",
								},
							];
							break;
						}
						case "Quiz.MultipleChoice": {
							// generated above
							break;
						}

						case "Tabs": {
							// TODO: need to be upstreamed to dariah campus
							break;
						}
						case "Tab": {
							break;
						}

						case "Video": {
							// should be fine
							break;
						}

						default: {
							console.error("Unhandled mdx component:", node.name);
						}
					}
				},
			);

			for (const id of tags) {
				const inputFileName = join(contentBaseFolder, "tags", `${id}.json`);
				const input = JSON.parse(await readFile(inputFileName, { encoding: "utf-8" })) as Tag;
				const outputFolder = join(outputBaseFolder, "tags");
				await mkdir(outputFolder, { recursive: true });
				const outputFileName = join(outputFolder, `${id}.yml`);
				await writeFile(outputFileName, YAML.stringify(input));
			}

			for (const id of people) {
				const inputFileName = join(contentBaseFolder, "people", `${id}.json`);
				const input = JSON.parse(await readFile(inputFileName, { encoding: "utf-8" })) as Person;
				const outputFolder = join(outputBaseFolder, "people");
				await mkdir(outputFolder, { recursive: true });
				const outputFileName = join(outputFolder, `${id}.yml`);
				const image = convertImagePath(input.image, outputFolder);
				await writeFile(
					outputFileName,
					YAML.stringify({
						firstName: input.firstName,
						lastName: input.lastName,
						avatar: image,
						website: input.website,
					}),
				);
			}

			for (const [source, target] of featuredImages) {
				await cp(source, target);
			}
		};
	})
	.use(toMarkdown);

async function generate() {
	const entries = await readdir(contentFolder, { withFileTypes: true });

	for (const entry of entries) {
		if (!entry.isDirectory()) continue;

		if (!allowedResources.includes(entry.name)) continue;

		const filePath = join(contentFolder, entry.name, "index.mdx");
		const file = await read(filePath);
		file.data.slug = entry.name;
		const processed = await processor.process(file);

		await mkdir(join(outputFolder, entry.name), { recursive: true });
		const outputFilePath = join(outputFolder, entry.name, "index.mdx");
		await writeFile(outputFilePath, String(processed), { encoding: "utf-8" });
	}
}

generate()
	.then(() => {
		log.success("Successfully exported content.");
	})
	.catch((error: unknown) => {
		log.error("Failed to export content.\n", String(error));
	});
