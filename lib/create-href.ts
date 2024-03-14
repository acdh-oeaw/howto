import { env } from "@/config/env.config";
import { createFullUrl, type CreateFullUrlParams } from "@/lib/create-full-url";

const baseUrl = env.NEXT_PUBLIC_APP_BASE_URL;

export function createHref(href: CreateFullUrlParams): string {
	const url = createFullUrl(href);

	if (url.origin === baseUrl) {
		if (href.hash != null && href.pathname == null && href.searchParams == null) {
			return url.hash;
		}

		if (href.searchParams != null && href.pathname == null) {
			return String(url.searchParams);
		}

		return String(url).slice(baseUrl.length);
	}

	return String(url);
}
