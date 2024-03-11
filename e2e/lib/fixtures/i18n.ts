import type { Page } from "@playwright/test";
import { createFormatter, createTranslator } from "next-intl";

import { defaultLocale } from "@/config/i18n.config";

export interface I18n {
	t: ReturnType<typeof createTranslator<never>>;
	format: ReturnType<typeof createFormatter>;
}

export async function createI18n(_page: Page, locale = defaultLocale): Promise<I18n> {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const _messages = await import(`@/messages/${locale}.json`, { with: { type: "json" } });
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	const messages = _messages.default as IntlMessages;

	return {
		t: createTranslator({ locale, messages }),
		format: createFormatter({ locale }),
	};
}

export type WithI18n<T> = T & { i18n: I18n };
