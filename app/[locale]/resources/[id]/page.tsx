import { assert, isNonNullable } from "@acdh-oeaw/lib";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import {
	getFormatter,
	getTranslations,
	unstable_setRequestLocale as setRequestLocale,
} from "next-intl/server";
import type { ReactNode } from "react";

import { DraftModeToggle } from "@/components/draft-mode-toggle";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/ui/page-title";
import type { Locale } from "@/config/i18n.config";
import { getResourceContent } from "@/lib/content/mdx";
import { reader } from "@/lib/content/reader";
import { getDublinCoreMetadata } from "@/lib/metadata/get-dublin-core-metadata";
import { getHighwireMetadata } from "@/lib/metadata/get-highwire-metadata";

interface ResourcePageProps {
	params: {
		id: string;
		locale: Locale;
	};
}

export const dynamicParams = false;

export async function generateStaticParams(_props: {
	params: Pick<ResourcePageProps["params"], "locale">;
}): Promise<Array<Pick<ResourcePageProps["params"], "id">>> {
	const ids = await reader().collections.resources.list();

	return ids.map((id) => {
		return { id };
	});
}

export async function generateMetadata(
	props: ResourcePageProps,
	parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { id } = params;

	const resource = await reader().collections.resources.read(id);
	if (resource == null) notFound();

	const layoutMetadata = await parent;
	const siteTitle = layoutMetadata.title?.absolute;
	assert(siteTitle, "Missing title metadata.");

	const dc = getDublinCoreMetadata({
		authors: resource.authors,
		license: resource.license,
		locale: resource.locale,
		publicationDate: resource.publicationDate,
		siteTitle,
		summary: resource.summary,
		tags: resource.tags,
		title: resource.title,
	});

	const highwire = getHighwireMetadata({
		authors: resource.authors,
		locale: resource.locale,
		publicationDate: resource.publicationDate,
		siteTitle,
		summary: resource.summary,
		title: resource.title,
	});

	const metadata: Metadata = {
		title: resource.title,
		other: {
			...dc.other,
			...highwire.other,
		},
	};

	return metadata;
}

export default function ResourcePage(props: ResourcePageProps): ReactNode {
	const { params } = props;

	const { id, locale } = params;
	setRequestLocale(locale);

	return (
		<MainContent className="container py-4 xs:py-8">
			<DraftModeToggle />

			<ResourceContent id={id} />
		</MainContent>
	);
}

interface ResourceContentProps {
	id: string;
}

// @ts-expect-error Upstream type issue.
async function ResourceContent(props: ResourceContentProps): Promise<ReactNode> {
	const { id } = props;

	const t = await getTranslations("ResourceContent");
	const { dateTime, list } = await getFormatter();

	const { Content, frontmatter: resource } = await getResourceContent(id);

	const authors = await Promise.all(
		resource.authors.map((id) => {
			return reader().collections.people.read(id);
		}),
	);

	const tags = await Promise.all(
		resource.tags.map((id) => {
			return reader().collections.tags.read(id);
		}),
	);

	return (
		<div className="prose prose-sm w-full">
			<PageTitle>{resource.title}</PageTitle>

			<div className="border-b">
				<dl className="grid leading-normal">
					<div className="inline">
						<dt className="inline">{t("written-by")} </dt>
						<dd className="inline pl-1">
							{list(
								authors.filter(isNonNullable).map((author) => {
									return [author.firstName, author.lastName].join(" ");
								}),
							)}
						</dd>
					</div>
					<div className="inline">
						<dt className="inline">{t("published-on")} </dt>
						<dd className="inline pl-1">
							{dateTime(new Date(resource.publicationDate), { dateStyle: "long" })}
						</dd>
					</div>
					<div className="inline">
						<dt className="inline">{t("tagged-with")} </dt>
						<dd className="inline pl-1">
							{list(
								tags.map((tag) => {
									assert(tag, "Missing tag.");
									return tag.name;
								}),
							)}
						</dd>
					</div>
				</dl>
			</div>

			<Content />
		</div>
	);
}
