import { HttpError } from "@/error/HttpError";
import { type Locale } from "@/i18n/i18n.config";
import { type HtmlString } from "@/utils/ts/aliases";
import { createImprintUrl } from "~/config/imprint.config";

export async function getImprint(locale: Locale): Promise<HtmlString> {
	const response = await fetch(String(createImprintUrl(locale)));

	if (!response.ok) {
		throw new HttpError(response);
	}

	const html = await response.text();

	return html;
}
