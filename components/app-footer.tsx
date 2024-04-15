import { useTranslations } from "next-intl";

import { AppLink } from "@/components/app-link";
import { AppNavLink } from "@/components/app-nav-link";
import type { LinkProps } from "@/components/link";
import { createHref } from "@/lib/create-href";

export function AppFooter() {
	const t = useTranslations("AppFooter");

	const links = {
		imprint: { href: createHref({ pathname: "/imprint" }), label: t("links.imprint") },
		feed: { href: createHref({ pathname: "/rss.xml" }), label: t("links.feed") },
	} satisfies Record<string, { href: LinkProps["href"]; label: string }>;

	return (
		<footer className="border-t">
			<div className="container flex max-w-screen-md items-center justify-between gap-4 border-x bg-neutral-0 py-6 text-xs dark:bg-neutral-900">
				<div className="-ml-3">
					<AppLink href="https://oeaw.ac.at">ACDH-CH</AppLink>
				</div>

				<nav aria-label={t("navigation-secondary")}>
					<ul className="-mr-3 flex items-center gap-4" role="list">
						{Object.entries(links).map(([id, link]) => {
							return (
								<li key={id}>
									<AppNavLink href={link.href}>{link.label}</AppNavLink>
								</li>
							);
						})}
					</ul>
				</nav>
			</div>
		</footer>
	);
}
