import { compareDesc } from "date-fns";
import { useLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

import { CurriculaFilterForm } from "@/components/curricula-filter-form";
import { CurriculaList } from "@/components/curricula-list";
import { type Locale, locales } from "@/config/i18n.config";
import { reader } from "@/lib/content/reader";

interface CurriculaSectionProps {
	filters: {
		limit: number;
		locale: Locale | "all";
		page: number;
		q: string;
		tag: Array<string>;
	};
}

// @ts-expect-error Upstream type issue.
export async function CurriculaSection(props: CurriculaSectionProps): Promise<ReactNode> {
	const { filters } = props;

	const locale = useLocale();
	const t = await getTranslations("CurriculaSection");

	const getLocaleLabel = new Intl.DisplayNames([locale], { type: "language" });
	const localeItems = [
		{ id: "all", label: t("locales.all") },
		...locales.map((locale) => {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return { id: locale, label: getLocaleLabel.of(locale)! };
		}),
	];

	const allCurricula = await reader().collections.curricula.all();

	const filteredCurricula = allCurricula.filter((curriculum) => {
		if (filters.locale !== "all" && curriculum.entry.locale !== filters.locale) {
			return false;
		}

		if (filters.q.length > 0 && !curriculum.entry.title.toLocaleLowerCase().includes(filters.q)) {
			return false;
		}

		if (
			filters.tag.length > 0 &&
			!filters.tag.some((tag) => {
				return curriculum.entry.tags.includes(tag);
			})
		) {
			return false;
		}

		return true;
	});

	const count = filteredCurricula.length;

	const curricula = filteredCurricula
		.sort((a, z) => {
			return compareDesc(a.entry.publicationDate, z.entry.publicationDate);
		})
		.slice((filters.page - 1) * filters.limit, filters.page * filters.limit)
		.map((curriculum) => {
			return { id: curriculum.slug, ...curriculum.entry };
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
			<CurriculaFilterForm
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
					<h2 className="sr-only">{t("search-results")}</h2>
					<CurriculaList curricula={curricula} />
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
