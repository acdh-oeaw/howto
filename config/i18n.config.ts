import type de from "@/messages/de.json";
import type en from "@/messages/en.json";

export const locales = ["de", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function isValidLocale(value: string): value is Locale {
	return locales.includes(value as Locale);
}

export interface Translations extends Record<Locale, IntlMessages> {
	de: typeof de;
	en: typeof en;
}
