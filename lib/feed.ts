import { assert, createUrl, groupByToMap, keyByToMap } from "@acdh-oeaw/lib";
import { getFormatter } from "next-intl/server";
import { renderToStaticMarkup } from "react-dom/server";
import { type Entry, rss } from "xast-util-feed";
import { toXml } from "xast-util-to-xml";

import { env } from "@/config/env.config";
import { locales } from "@/config/i18n.config";
import { getResourceContent } from "@/lib/content/mdx";
import { reader } from "@/lib/content/reader";

const baseUrl = env.NEXT_PUBLIC_APP_BASE_URL;

const resources = await reader().collections.resources.all();
const resourcesByLocale = groupByToMap(resources, (resource) => {
	return resource.entry.locale;
});

const people = await reader().collections.people.all();
const peopleById = keyByToMap(people, (person) => {
	return person.slug;
});

const tags = await reader().collections.tags.all();
const tagsById = keyByToMap(tags, (tag) => {
	return tag.slug;
});

for (const locale of locales) {
	const { list } = await getFormatter({ locale });

	const channel = {
		title: "Digital Humanities learning resources",
		url: baseUrl,
		feedUrl: String(createUrl({ baseUrl, pathname: `/de/rss/resources.xml` })),
		lang: locale,
		author: "Austrian Center for Digital Humanities and Cultural Heritage",
	};

	const resources = resourcesByLocale.get(locale) ?? [];

	const data: Array<Entry> = [];

	for (const resource of resources) {
		const { Content } = await getResourceContent(resource.slug);
		const html = renderToStaticMarkup(Content({}));

		data.push({
			title: resource.entry.title,
			url: String(createUrl({ baseUrl, pathname: `/${locale}/resources/${resource.slug}` })),
			description: resource.entry.summary,
			author: list(
				resource.entry.authors.map((id) => {
					const person = peopleById.get(id);
					assert(person);
					return [person.entry.firstName, person.entry.lastName].join(" ");
				}),
			),
			published: resource.entry.publicationDate,
			tags: resource.entry.tags.map((id) => {
				const tag = tagsById.get(id);
				assert(tag);
				return tag.entry.name;
			}),
		});
	}

	const feed = toXml(rss(channel, data));
}
