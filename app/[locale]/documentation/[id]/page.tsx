import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { DraftModeToggle } from "@/components/draft-mode-toggle";
import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/ui/page-title";
import type { Locale } from "@/config/i18n.config";
import { getDocumentationContent } from "@/lib/content/mdx";
import { reader } from "@/lib/content/reader";
import type { DocumentationPage } from "@/lib/content/types";

interface DocumentationPageProps {
	params: {
		id: string;
		locale: Locale;
	};
}

export const dynamicParams = false;

export async function generateStaticParams(_props: {
	params: Pick<DocumentationPageProps["params"], "locale">;
}): Promise<Array<Pick<DocumentationPageProps["params"], "id">>> {
	const ids = await reader().collections.documentation.list();

	return ids.map((id) => {
		return { id };
	});
}

export async function generateMetadata(
	props: DocumentationPageProps,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const { params } = props;

	const { id } = params;
	const document = await reader().collections.documentation.read(id);

	if (document == null) notFound();

	const metadata: Metadata = {
		title: document.title,
	};

	return metadata;
}

export default function DocumentationPage(props: DocumentationPageProps): ReactNode {
	const { params } = props;

	const { id, locale } = params;
	setRequestLocale(locale);

	return (
		<MainContent className="container py-4 xs:py-8">
			<DraftModeToggle />

			<DocumentationPageContent id={id} locale={locale} />
		</MainContent>
	);
}

interface DocumentationPageContentProps {
	id: string;
	locale: Locale;
}

// @ts-expect-error Upstream type issue.
async function DocumentationPageContent(props: DocumentationPageContentProps): Promise<ReactNode> {
	const { id } = props;

	const document = await reader().collections.documentation.read(id);
	if (document == null) notFound();

	const { Content } = await getDocumentationContent(id);

	return (
		<div className="prose prose-sm w-full">
			<PageTitle>{document.title}</PageTitle>

			<Content />
		</div>
	);
}
