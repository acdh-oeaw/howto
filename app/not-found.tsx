import type { Metadata, ResolvingMetadata } from "next";
import { getTranslations } from "next-intl/server";

import { MainContent } from "@/components/main-content";
import { PageTitle } from "@/components/ui/page-title";
import { defaultLocale } from "@/config/i18n.config";
import { ColorSchemeScript } from "@/lib/color-scheme-script";
import * as fonts from "@/lib/fonts";
import { cn } from "@/lib/styles";

export async function generateMetadata(
	_props: Record<string, never>,
	_parent: ResolvingMetadata,
): Promise<Metadata> {
	const t = await getTranslations({ locale: defaultLocale, namespace: "NotFoundPage" });

	const metadata: Metadata = {
		title: t("meta.title"),
		robots: {
			index: false,
		},
	};

	return metadata;
}

export default async function NotFoundPage() {
	const t = await getTranslations({ locale: defaultLocale, namespace: "NotFoundPage" });

	return (
		<html
			className={cn(fonts.body.variable, fonts.heading.variable)}
			lang={defaultLocale}
			/**
			 * Suppressing hydration warning because we add `data-ui-color-scheme` before first paint.
			 */
			suppressHydrationWarning={true}
		>
			<body>
				<ColorSchemeScript />

				<MainContent className="container grid min-h-full place-content-center py-4 xs:py-8">
					<PageTitle>{t("title")}</PageTitle>
				</MainContent>
			</body>
		</html>
	);
}
