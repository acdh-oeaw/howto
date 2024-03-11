import type { Metadata } from "next";

interface GetHighwireMetadataParams {
	authors: ReadonlyArray<string>;
	publicationDate: string;
	locale: string;
	siteTitle: string;
	summary: string;
	title: string;
}

export function getHighwireMetadata(params: GetHighwireMetadataParams ) {
	const { authors, locale, publicationDate, siteTitle, summary, title } = params;

	const metadata: Metadata = {
		other: {
			citation_abstract: summary,
			citation_author: authors as Array<string>,
			citation_journal_title: siteTitle,
			citation_language: locale,
			citation_publication_date: publicationDate,
			citation_title: title,
		}
	}

	return metadata
}
