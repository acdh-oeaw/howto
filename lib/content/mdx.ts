import "server-only";

import { evaluate } from "@mdx-js/mdx";
import type { MDXModule } from "mdx/types";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";
import { cache } from "react";
import * as runtime from "react/jsx-runtime";

import { config as mdxConfig } from "@/config/mdx.config";
import { reader } from "@/lib/content/reader";
import type { Curriculum, DocumentationPage, Resource } from "@/lib/content/types";
import { useMDXComponents } from "@/mdx-components";

interface MdxContent<T extends Record<string, unknown>> extends MDXModule {
	/** Added by `remark-mdx-frontmatter`. */
	frontmatter: T;
}

export const processMdx = cache(function processMdx<T extends Record<string, unknown>>(
	code: string,
): Promise<MdxContent<T>> {
	// @ts-expect-error Upstream type error.
	return evaluate(code, { ...runtime, ...mdxConfig, useMDXComponents });
});

interface CurriculumMetadata extends Omit<Curriculum, "content"> {}

export async function getCurriculumContent(id: string) {
	if (draftMode().isEnabled) {
		const curriculum = await reader().collections.curricula.read(id);
		if (curriculum == null) notFound();

		const { content, ...frontmatter } = curriculum;
		const { default: Content } = await processMdx(await content());

		return { Content, frontmatter };
	}

	const { default: Content, frontmatter } = (await import(
		`@/content/curricula/${id}/index.mdx`
	)) as MdxContent<CurriculumMetadata>;

	return { Content, frontmatter };
}

interface ResourceMetadata extends Omit<Resource, "content"> {}

export async function getResourceContent(id: string) {
	if (draftMode().isEnabled) {
		const resource = await reader().collections.resources.read(id);
		if (resource == null) notFound();

		const { content, ...frontmatter } = resource;
		const { default: Content } = await processMdx(await content());

		return { Content, frontmatter };
	}

	const { default: Content, frontmatter } = (await import(
		`@/content/resources/${id}/index.mdx`
	)) as MdxContent<ResourceMetadata>;

	return { Content, frontmatter };
}

interface DocumentationMetadata extends Omit<DocumentationPage, "content"> {}

export async function getDocumentationContent(id: string) {
	if (draftMode().isEnabled) {
		const documentation = await reader().collections.documentation.read(id);
		if (documentation == null) notFound();

		const { content, ...frontmatter } = documentation;
		const { default: Content } = await processMdx(await content());

		return { Content, frontmatter };
	}

	const { default: Content, frontmatter } = (await import(
		`@/content/documentation/${id}.mdx`
	)) as MdxContent<DocumentationMetadata>;

	return { Content, frontmatter };
}
