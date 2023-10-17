import { type GetStaticPropsContext, type GetStaticPropsResult } from "next";
import Link from "next/link";
import { Fragment } from "react";

import { getPageById } from "@/cms/api/pages.api";
import { type PostPreview } from "@/cms/api/posts.api";
import { getPostPreviews } from "@/cms/api/posts.api";
import { PageContent } from "@/common/PageContent";
import { getLocale } from "@/i18n/getLocale";
import { type Dictionary } from "@/i18n/loadDictionary";
import { loadDictionary } from "@/i18n/loadDictionary";
import { useI18n } from "@/i18n/useI18n";
import { useMdx } from "@/mdx/useMdx";
import { Metadata } from "@/metadata/Metadata";
import { useAlternateUrls } from "@/metadata/useAlternateUrls";
import { useCanonicalUrl } from "@/metadata/useCanonicalUrl";
import { routes } from "@/navigation/routes.config";
import { ResourcesList } from "@/views/ResourcesList";

export interface HomePageMetadata extends Record<string, unknown> {}

export interface HomePageProps {
	dictionary: Dictionary;
	locale: "de" | "en";
	posts: Array<PostPreview>;
	code: string;
}

/**
 * Provides translations.
 */
export async function getStaticProps(
	context: GetStaticPropsContext,
): Promise<GetStaticPropsResult<HomePageProps>> {
	const { locale } = getLocale(context);

	const dictionary = await loadDictionary(locale, ["common"]);
	const posts = (await getPostPreviews(locale)).slice(0, 4);

	const code = await getPageById("home", locale);

	return {
		props: {
			dictionary,
			locale,
			posts,
			code,
		},
	};
}

/**
 * Home page.
 */
export default function HomePage(props: HomePageProps): JSX.Element {
	const { posts, code } = props;

	const { t } = useI18n();
	const canonicalUrl = useCanonicalUrl();
	const languageAlternates = useAlternateUrls();
	const { MdxContent, metadata } = useMdx(code);
	const title = String(metadata?.title ?? "");

	return (
		<Fragment>
			<Metadata
				title={t("common.page.home")}
				canonicalUrl={canonicalUrl}
				languageAlternates={languageAlternates}
			/>
			<PageContent className="bg-brand-black text-white">
				<div className="mx-auto flex max-w-6xl flex-col gap-12 p-8 py-24 xs:py-48">
					<div className="flex flex-col-reverse">
						<h1 className="text-5xl font-black tracking-tighter 2xs:text-6xl xs:text-7xl">
							{title.split(" ").map((segment, index) => {
								const className =
									index === 0
										? "text-brand-light-blue"
										: index === 2
										? "text-brand-light-blue"
										: index === segment.length - 2
										? "text-brand-turquoise"
										: index === segment.length - 1
										? "text-brand-turquoise"
										: undefined;

								return (
									<span key={index} className={className}>
										{segment}{" "}
									</span>
								);
							})}
						</h1>
					</div>

					<div className="grid flex-1 gap-4 text-xl font-medium leading-relaxed text-neutral-300 [&_a]:underline [&_a]:decoration-dotted">
						<MdxContent />
					</div>

					<section className="my-12 grid gap-12">
						<div className="flex items-center justify-between border-b py-3">
							<h2 className="text-2xl font-bold text-neutral-100">{t(["common", "new-posts"])}</h2>
							<Link
								className="inline-flex items-center rounded bg-brand-blue px-6 py-2 font-medium text-brand-black transition hover:bg-brand-light-blue focus:bg-brand-light-blue"
								href={routes.resources({ kind: "posts" })}
							>
								{t(["common", "see-all-posts"])}
							</Link>
						</div>
						<ResourcesList posts={posts} />
					</section>
				</div>
			</PageContent>
		</Fragment>
	);
}
