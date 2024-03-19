import { HttpError, request } from "@acdh-oeaw/lib";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { useTranslations } from "next-intl";
import { getTranslations, unstable_setRequestLocale as setRequestLocale } from "next-intl/server";

import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/ui/page-title";
import type { Locale } from "@/config/i18n.config";
import { createImprintUrl } from "@/config/imprint.config";

interface ImprintPageProps {
	params: {
		locale: Locale;
	};
}

export async function generateMetadata(
	props: ImprintPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { locale } = params;
	const t = await getTranslations({ locale, namespace: "ImprintPage" });

	const metadata: Metadata = {
		title: t("meta.title"),
	};

	return metadata;
}

export default function ImprintPage(props: ImprintPageProps) {
	const { params } = props;

	const { locale } = params;
	setRequestLocale(locale);

	const t = useTranslations("ImprintPage");

	return (
		<MainContent className="container py-4 xs:py-8">
			<ImprintPageContent locale={locale} title={t("title")} />
		</MainContent>
	);
}

interface ImprintPageContentProps {
	locale: Locale;
	title: string;
}

async function ImprintPageContent(props: ImprintPageContentProps) {
	const { locale, title } = props;

	const html = await getImprintHtml(locale);

	return (
		<div className="prose prose-sm w-full min-w-0">
			<PageTitle>{title}</PageTitle>

			<div dangerouslySetInnerHTML={{ __html: html }} />
		</div>
	);
}

async function getImprintHtml(locale: Locale): Promise<string> {
	try {
		const url = createImprintUrl(locale);
		const html = await request(url, { responseType: "text" });

		return html as string;
	} catch (error) {
		if (error instanceof HttpError && error.response.status === 404) {
			notFound();
		}

		throw error;
	}
}
