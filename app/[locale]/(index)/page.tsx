import { createUrlSearchParams } from "@acdh-oeaw/lib";
import type { Metadata, ResolvingMetadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations, unstable_setRequestLocale as setRequestLocale } from "next-intl/server";

import { MainContent } from "@/components/main-content";
import { ResourcesSection } from "@/components/resources-section";
import type { Locale } from "@/config/i18n.config";
import { createResourceFiltersSearchParamsSchema } from "@/lib/schemas/resource-filter-schema";

interface IndexPageProps {
	params: {
		locale: Locale;
	};
	searchParams: Record<string, Array<string> | string>;
}

export async function generateMetadata(
	props: IndexPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { locale } = params;
	const _t = await getTranslations({ locale, namespace: "IndexPage" });

	const metadata: Metadata = {
		/**
		 * Fall back to `title.default` from `layout.tsx`.
		 *
		 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata#title
		 */
		// title: undefined,
	};

	return metadata;
}

export default function IndexPage(props: IndexPageProps) {
	const { params, searchParams } = props;

	const { locale } = params;
	setRequestLocale(locale);

	const t = useTranslations("IndexPage");

	const urlSearchParams = createUrlSearchParams(searchParams);

	const searchParamsSchema = createResourceFiltersSearchParamsSchema(locale);

	const filters = searchParamsSchema.parse({
		limit: urlSearchParams.get("limit"),
		locale: urlSearchParams.get("locale"),
		page: urlSearchParams.get("page"),
		q: urlSearchParams.get("q")?.trim().toLocaleLowerCase(),
		tag: urlSearchParams.getAll("tag"),
	});

	return (
		<MainContent className="container grid grid-rows-[auto_1fr] py-4 xs:py-8">
			<section className="grid w-full items-start justify-items-center gap-y-4 py-8 text-center md:py-12">
				<h1 className="text-balance font-heading text-3xl font-bold leading-tight tracking-tighter text-neutral-950 md:text-5xl dark:text-neutral-0">
					{t("title")}
				</h1>
				<div className="text-pretty text-md leading-normal text-neutral-600 xs:text-lg xs:leading-snug dark:text-neutral-400">
					{t("lead-in")}
				</div>
			</section>

			<ResourcesSection filters={filters} />
		</MainContent>
	);
}
