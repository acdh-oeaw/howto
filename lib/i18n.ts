import "server-only";

import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

import { isValidLocale } from "@/config/i18n.config";

export default getRequestConfig(async ({ locale }) => {
	if (!isValidLocale(locale)) notFound();

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const _messages = await (locale === "en"
		? /** Enables hot-module-reloading for `en` when using `turbopack`. */
			import("@/messages/en.json")
		: import(`@/messages/${locale}.json`));
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	const messages = _messages.default as IntlMessages;
	const timeZone = "UTC";

	return {
		messages,
		timeZone,
	};
});
