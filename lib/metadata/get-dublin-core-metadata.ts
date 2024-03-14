import type { Metadata } from "next";

interface GetDublinCoreMetadataParams {
	authors: ReadonlyArray<string>;
	license: string;
	locale: string;
	publicationDate: string;
	siteTitle: string;
	summary: string;
	tags: ReadonlyArray<string>;
	title: string;
}

export function getDublinCoreMetadata(params: GetDublinCoreMetadataParams) {
	const { authors, license, locale, publicationDate, siteTitle, summary, tags, title } = params;

	const metadata: Metadata = {
		other: {
			"DC.creator": authors as Array<string>,
			"DC.language": locale,
			"DC.publisher": siteTitle,
			"DC.subject": tags as Array<string>,
			"DC.title": title,
			"DCTERMS.abstract": summary,
			"DCTERMS.issued": publicationDate,
			"DCTERMS.license": license,
		},
	};

	return metadata;
}
