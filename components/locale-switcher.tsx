import { useTranslations } from "next-intl";
import { Fragment, Suspense, useMemo } from "react";

import { LocaleSwitcherLink, LocaleSwitcherLinkFallback } from "@/components/locale-switcher-link";
import { type Locale, locales } from "@/config/i18n.config";
import { useLocale } from "@/lib/navigation";

export function LocaleSwitcher() {
	const currentLocale = useLocale();
	const t = useTranslations("LocaleSwitcher");

	const items = useMemo(() => {
		const displayNames = new Intl.DisplayNames([currentLocale], { type: "language" });

		return Object.fromEntries(
			locales.map((locale) => {
				return [locale, displayNames.of(locale)];
			}),
		) as Record<Locale, string>;
	}, [currentLocale]);

	return (
		<div className="flex items-center gap-0.5 text-sm">
			{locales.map((locale, index) => {
				const label = items[locale];

				const separator = index !== 0 ? <span className="cursor-default">|</span> : null;

				if (locale === currentLocale) {
					return (
						<Fragment key={locale}>
							{separator}

							<span className="sr-only">{t("current-locale", { locale: label })}</span>
							<span
								aria-hidden={true}
								className="inline-grid aspect-square size-9 cursor-default place-content-center p-1 font-medium text-neutral-950 dark:text-neutral-0"
							>
								{locale.toUpperCase()}
							</span>
						</Fragment>
					);
				}

				const children = (
					<Fragment>
						<span className="sr-only">{t("switch-locale-to", { locale: label })}</span>
						<span aria-hidden={true}>{locale.toUpperCase()}</span>
					</Fragment>
				);

				/**
				 * Suspense boundary is necessary to avoid client-side deoptimisation caused by `useSearchParams`.
				 *
				 * @see https://nextjs.org/docs/messages/deopted-into-client-rendering
				 */
				return (
					<Fragment key={locale}>
						{separator}

						<Suspense
							fallback={
								<LocaleSwitcherLinkFallback locale={locale}>{children}</LocaleSwitcherLinkFallback>
							}
						>
							<LocaleSwitcherLink locale={locale}>{children}</LocaleSwitcherLink>
						</Suspense>
					</Fragment>
				);
			})}
		</div>
	);
}
