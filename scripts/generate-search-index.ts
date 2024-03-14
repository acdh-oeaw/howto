import { assert, log } from "@acdh-oeaw/lib";
import { createReader } from "@keystatic/core/reader";
import { Errors } from "typesense";

import { env } from "@/config/env.config";
import type { Locale } from "@/config/i18n.config";
import { schema } from "@/config/search.config";
import config from "@/keystatic.config";
import { createSearchClient } from "@/lib/search/create-search-client";

interface HowtDocument {
	id: string;
	kind: "curriculum" | "resource";
	locale: Locale;
	title: string;
	authors: ReadonlyArray<string>;
	tags: ReadonlyArray<string>;
	publication_year: number;
}

assert(env.TYPESENSE_ADMIN_API_KEY, "Missing typesense admin key.");
const client = createSearchClient(env.TYPESENSE_ADMIN_API_KEY);

async function generate() {
	const isCollectionExisting = await client.collections(schema.name).exists();

	if (!isCollectionExisting) {
		await client.collections().create(schema);
	}

	const documents: Array<HowtDocument> = [];

	const reader = createReader(process.cwd(), config);

	const curricula = await reader.collections.curricula.all();
	const resources = await reader.collections.resources.all();

	curricula.forEach((curriculum) => {
		documents.push({
			id: curriculum.slug,
			kind: "curriculum",
			locale: curriculum.entry.locale,
			title: curriculum.entry.title,
			authors: curriculum.entry.editors,
			tags: curriculum.entry.tags,
			publication_year: new Date(curriculum.entry.publicationDate).getUTCFullYear(),
		});
	});

	resources.forEach((resource) => {
		documents.push({
			id: resource.slug,
			kind: "resource",
			locale: resource.entry.locale,
			title: resource.entry.title,
			authors: resource.entry.authors,
			tags: resource.entry.tags,
			publication_year: new Date(resource.entry.publicationDate).getUTCFullYear(),
		});
	});

	await client.collections(schema.name).documents().import(documents, { action: "upsert" });
}

generate()
	.then(() => {
		log.success("Successfully updated search index.");
	})
	.catch((error) => {
		log.error("Failed to update search index.", String(error));
		if (error instanceof Errors.ImportError) {
			log.log(error.importResults);
		}
		process.exitCode = 1;
	});
