import { type Locale } from "@/i18n/i18n.config";
import { createUrl } from "@/utils/createUrl";

/**
 * Creates URL to fetch imprint from ACDH imprint service.
 */
export function createImprintUrl(locale: Locale): URL {
	return createUrl({
		baseUrl: "https://imprint.acdh.oeaw.ac.at",
		pathname: "/19273",
		query: { locale },
	});
}
