import { notFound } from "next/navigation";
import { useLocale as _useLocale } from "next-intl";
import { createSharedPathnamesNavigation } from "next-intl/navigation";
import type { ComponentPropsWithRef, FC } from "react";

import { isValidLocale, type Locale, locales } from "@/config/i18n.config";

const { Link, redirect, usePathname, useRouter } = createSharedPathnamesNavigation({
	locales,
});

export { redirect, usePathname, useRouter };

export type LocaleLinkProps = Omit<ComponentPropsWithRef<typeof Link>, "href"> & {
	href?: string | undefined;
};

export const LocaleLink = Link as FC<LocaleLinkProps>;

export function useLocale(): Locale {
	const locale = _useLocale();

	if (!isValidLocale(locale)) notFound();

	return locale;
}
