import { join } from "node:path";

import { createUrl } from "@acdh-oeaw/lib";
import { glob } from "fast-glob";
import type { MetadataRoute } from "next";

import { env } from "@/config/env.config";
import { locales } from "@/config/i18n.config";

const baseUrl = env.NEXT_PUBLIC_APP_BASE_URL;

/**
 * Google supports up to 50.000 entries per sitemap file. Apps which need more that that can use
 * `generateSitemaps` to generate multiple sitemap files.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap#generating-a-sitemap-using-code-js-ts
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const paths = await glob("./**/page.tsx", { cwd: join(process.cwd(), "app", "[locale]") });

	const routes: Array<string> = [];

	paths.forEach((path) => {
		const route = path.slice(0, -"/page.tsx".length);

		if (route === "[...404]") return;

		const segments = [];

		for (const segment of route.split("/")) {
			/** Dynamic routes. */
			if (segment.startsWith("[") && segment.endsWith("]")) return;

			/** Route groups. */
			if (segment.startsWith("(") && segment.endsWith(")")) continue;

			segments.push(segment);
		}

		routes.push(segments.join("/"));
	});

	const entries = locales.flatMap((locale) => {
		return routes.map((pathname) => {
			return {
				url: String(createUrl({ baseUrl, pathname: `/${locale}/${pathname}` })),
				// lastModified: new Date(),
			};
		});
	});

	const resources = await glob("./*/index.mdx", {
		cwd: join(process.cwd(), "content", "resources"),
	});

	resources.forEach((resource) => {
		const id = resource.slice(0, -"/index.mdx".length);

		locales.forEach((locale) => {
			entries.push({
				url: String(createUrl({ baseUrl, pathname: `/${locale}/resources/${id}` })),
				// lastModified: new Date(),
			});
		});
	});

	const curricula = await glob("./*/index.mdx", {
		cwd: join(process.cwd(), "content", "curricula"),
	});

	curricula.forEach((curriculum) => {
		const id = curriculum.slice(0, -"/index.mdx".length);

		locales.forEach((locale) => {
			entries.push({
				url: String(createUrl({ baseUrl, pathname: `/${locale}/curricula/${id}` })),
				// lastModified: new Date(),
			});
		});
	});

	return entries;
}
