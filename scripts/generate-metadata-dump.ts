import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

import { assert, keyByToMap, log } from "@acdh-oeaw/lib";
import { createReader } from "@keystatic/core/reader";

import config from "@/keystatic.config";
import type { Curriculum, Resource } from "@/lib/content/types";

async function generate() {
	const reader = createReader(process.cwd(), config);

	const curricula = await reader.collections.curricula.all();
	const resources = await reader.collections.resources.all();
	const people = await reader.collections.people.all();
	const tags = await reader.collections.tags.all();
	const licenses = await reader.collections.licenses.all();

	const peopleById = keyByToMap(people, (person) => {
		return person.slug;
	});
	const tagsById = keyByToMap(tags, (tag) => {
		return tag.slug;
	});
	const licensesById = keyByToMap(licenses, (license) => {
		return license.slug;
	});
	const resourcesById = keyByToMap(resources, (resource) => {
		return resource.slug;
	});

	function createResource(id: string, resource: Resource) {
		const authors = resource.authors.map((id) => {
			return peopleById.get(id)?.entry;
		});
		const editors = resource.editors.map((id) => {
			return peopleById.get(id)?.entry;
		});
		const tags = resource.tags.map((id) => {
			return tagsById.get(id)?.entry;
		});
		const license = licensesById.get(resource.license)?.entry;

		return {
			id,
			lang: resource.locale,
			title: resource.title,
			date: resource.publicationDate,
			authors,
			editors,
			tags,
			licence: license,
			version: resource.version,
			abstract: resource.summary,
		};
	}

	function createCurriculum(id: string, curriculum: Curriculum) {
		const editors = curriculum.editors.map((id) => {
			return peopleById.get(id)?.entry;
		});
		const tags = curriculum.tags.map((id) => {
			return tagsById.get(id)?.entry;
		});
		const license = licensesById.get(curriculum.license)?.entry;
		const resources = curriculum.resources.map((id) => {
			const resource = resourcesById.get(id);
			assert(resource);
			return createResource(resource.slug, resource.entry);
		});

		return {
			id,
			lang: curriculum.locale,
			title: curriculum.title,
			date: curriculum.publicationDate,
			editors,
			tags,
			licence: license,
			version: curriculum.version,
			abstract: curriculum.summary,
			resources,
		};
	}

	const outputFolder = join(process.cwd(), "public", "metadata");
	await mkdir(outputFolder, { recursive: true });

	await writeFile(
		join(outputFolder, "curricula.json"),
		JSON.stringify(
			curricula.map((curriculum) => {
				return createCurriculum(curriculum.slug, curriculum.entry);
			}),
		),
		{ encoding: "utf-8" },
	);

	await writeFile(
		join(outputFolder, "resources.json"),
		JSON.stringify(
			resources.map((resource) => {
				return createResource(resource.slug, resource.entry);
			}),
		),
		{ encoding: "utf-8" },
	);
}

generate()
	.then(() => {
		log.success("Successfully generated metadata dump.");
	})
	.catch((error) => {
		log.error("Failed to generate metadata dump.", String(error));
		process.exitCode = 1;
	});
