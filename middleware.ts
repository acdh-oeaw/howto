import type { MiddlewareConfig } from "next/server";
import createI18nMiddleware from "next-intl/middleware";

import { defaultLocale, locales } from "@/config/i18n.config";

const i18nMiddleware = createI18nMiddleware({
	defaultLocale,
	locales,
});

export default i18nMiddleware;

export const config: MiddlewareConfig = {
	matcher: [
		"/",
		/**
		 * Next.js does not support arbitrary expressions for `matcher`.
		 *
		 * @see https://github.com/vercel/next.js/issues/56398
		 */
		"/(de|en)/:path*",
		/**
		 * Redirect cms preview urls.
		 */
		"/curricula/:path*",
		"/resources/:path*",
	],
};
