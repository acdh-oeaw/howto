import { compareDesc } from "date-fns";
import { useLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { ResourcesFilterForm } from "@/components/resources-filter-form";
import { ResourcesList } from "@/components/resources-list";
import { type Locale, locales } from "@/config/i18n.config";
import { reader } from "@/lib/content/reader";

interface ResourcesSectionProps {
	filters: {
		limit: number;
		locale: Locale | "all";
		page: number;
		q: string;
		tag: Array<string>;
	};
}

// @ts-expect-error Upstream type issue.
export async function ResourcesSection(props: ResourcesSectionProps): Promise<ReactNode> {
	const { filters } = props;

	const locale = useLocale();
	const t = await getTranslations("ResourcesSection");

	const getLocaleLabel = new Intl.DisplayNames([locale], { type: "language" });
	const localeItems = [
		{ id: "all", label: t("locales.all") },
		...locales.map((locale) => {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return { id: locale, label: getLocaleLabel.of(locale)! };
		}),
	];

	const allResources = await reader().collections.resources.all();

	const filteredResources = allResources.filter((resource) => {
		if (filters.locale !== "all" && resource.entry.locale !== filters.locale) {
			return false;
		}

		if (filters.q.length > 0 && !resource.entry.title.toLocaleLowerCase().includes(filters.q)) {
			return false;
		}

		if (
			filters.tag.length > 0 &&
			!filters.tag.some((tag) => {
				return resource.entry.tags.includes(tag);
			})
		) {
			return false;
		}

		return true;
	});

	const count = filteredResources.length;

	const resources = filteredResources
		.sort((a, z) => {
			return compareDesc(a.entry.publicationDate, z.entry.publicationDate);
		})
		.slice((filters.page - 1) * filters.limit, filters.page * filters.limit)
		.map((resource) => {
			return { id: resource.slug, ...resource.entry };
		});

	const allTags = await reader().collections.tags.all();

	const tags = allTags
		.sort((a, z) => {
			return a.entry.name.localeCompare(z.entry.name);
		})
		.map((tag) => {
			return { id: tag.slug, ...tag.entry };
		});

	return (
		<section className="grid grid-rows-[auto_1fr] content-start items-start gap-y-6 xs:gap-y-12">
			<ResourcesFilterForm
				filters={filters}
				localeItems={localeItems}
				localeLabel={t("locale")}
				searchTermLabel={t("search-term")}
				submitLabel={t("search")}
				tags={tags}
				tagsLabel={t("tags")}
			/>

			{count > 0 ? (
				<div className="grid gap-y-12">
					<ResourcesList resources={resources} />
					<div className="justify-self-center text-sm">{t("search-results-found", { count })}</div>
				</div>
			) : (
				<div className="grid place-content-center self-stretch text-neutral-600 dark:text-neutral-400">
					{t("search-results-found", { count })}
				</div>
			)}
		</section>
	);
}
