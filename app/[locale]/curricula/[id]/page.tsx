import { assert, isNonNullable } from "@acdh-oeaw/lib";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import {
	getFormatter,
	getTranslations,
	unstable_setRequestLocale as setRequestLocale,
} from "next-intl/server";

import { DraftModeToggle } from "@/components/draft-mode-toggle";
import { MainContent } from "@/components/main-content";
import { ResourcesList } from "@/components/resources-list";
import { PageTitle } from "@/components/ui/page-title";
import type { Locale } from "@/config/i18n.config";
import { getCurriculumContent } from "@/lib/content/mdx";
import { reader } from "@/lib/content/reader";
import { getDublinCoreMetadata } from "@/lib/metadata/get-dublin-core-metadata";
import { getHighwireMetadata } from "@/lib/metadata/get-highwire-metadata";

interface CurriculumPageProps {
	params: {
		id: string;
		locale: Locale;
	};
}

export const dynamicParams = false;

export async function generateStaticParams(_props: {
	params: Pick<CurriculumPageProps["params"], "locale">;
}): Promise<Array<Pick<CurriculumPageProps["params"], "id">>> {
	const ids = await reader().collections.curricula.list();

	return ids.map((id) => {
		return { id };
	});
}

export async function generateMetadata(
	props: CurriculumPageProps,
	parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { id } = params;

	const curriculum = await reader().collections.curricula.read(id);
	if (curriculum == null) notFound();

	const layoutMetadata = await parent;
	const siteTitle = layoutMetadata.title?.absolute;
	assert(siteTitle, "Missing title metadata.");

	const dc = getDublinCoreMetadata({
		authors: curriculum.editors,
		license: curriculum.license,
		locale: curriculum.locale,
		publicationDate: curriculum.publicationDate,
		siteTitle,
		summary: curriculum.summary,
		tags: curriculum.tags,
		title: curriculum.title,
	});

	const highwire = getHighwireMetadata({
		authors: curriculum.editors,
		locale: curriculum.locale,
		publicationDate: curriculum.publicationDate,
		siteTitle,
		summary: curriculum.summary,
		title: curriculum.title,
	});

	const metadata: Metadata = {
		title: curriculum.title,
		other: {
			...dc.other,
			...highwire.other,
		},
	};

	return metadata;
}

export default function CurriculumPage(props: CurriculumPageProps) {
	const { params } = props;

	const { id, locale } = params;
	setRequestLocale(locale);

	return (
		<MainContent className="container py-4 xs:py-8">
			<DraftModeToggle />

			<CurriculumContent id={id} />
		</MainContent>
	);
}

interface CurriculumContentProps {
	id: string;
}

async function CurriculumContent(props: CurriculumContentProps) {
	const { id } = props;

	const t = await getTranslations("CurriculumContent");
	const { dateTime, list } = await getFormatter();

	const { Content, frontmatter: curriculum } = await getCurriculumContent(id);

	const editors = await Promise.all(
		curriculum.editors.map((id) => {
			return reader().collections.people.read(id);
		}),
	);

	const resources = await Promise.all(
		curriculum.resources.map(async (id) => {
			const resource = await reader().collections.resources.read(id);
			assert(resource, "Missing resource.");
			return { ...resource, id };
		}),
	);

	const tags = await Promise.all(
		curriculum.tags.map((id) => {
			return reader().collections.tags.read(id);
		}),
	);

	return (
		<div className="prose prose-sm w-full">
			<PageTitle>{curriculum.title}</PageTitle>

			<div className="border-b">
				<dl className="grid leading-normal">
					{editors.length > 0 ? (
						<div className="inline">
							<dt className="inline">{t("edited-by")} </dt>
							<dd className="inline pl-1">
								{list(
									editors.filter(isNonNullable).map((editor) => {
										return [editor.firstName, editor.lastName].join(" ");
									}),
								)}
							</dd>
						</div>
					) : null}
					<div className="inline">
						<dt className="inline">{t("published-on")} </dt>
						<dd className="inline pl-1">
							{dateTime(new Date(curriculum.publicationDate), { dateStyle: "long" })}
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

			<ResourcesList resources={resources} />
		</div>
	);
}
