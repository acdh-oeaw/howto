import { useTranslations } from "next-intl";

import { AppNavLink } from "@/components/app-nav-link";
import { ColorSchemeSwitcher } from "@/components/color-scheme-switcher";
import type { LinkProps } from "@/components/link";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { Logo } from "@/components/logo";
import { createHref } from "@/lib/create-href";

export function AppHeader() {
	const t = useTranslations("AppHeader");

	const links = {
		home: { href: createHref({ pathname: "/" }), label: t("links.home") },
		resources: { href: createHref({ pathname: "/resources" }), label: t("links.resources") },
		curricula: { href: createHref({ pathname: "/curricula" }), label: t("links.curricula") },
	} satisfies Record<string, { href: LinkProps["href"]; label: string }>;

	return (
		<header className="border-b">
			<div className="container flex max-w-screen-md items-center justify-between gap-x-4 border-x bg-neutral-0 py-6 dark:bg-neutral-900">
				<nav aria-label={t("navigation-primary")}>
					<ul className="-ml-3 flex items-center gap-x-2 text-sm font-medium" role="list">
						{Object.entries(links).map(([id, link]) => {
							if (id === "home") {
								return (
									<li key={id}>
										<AppNavLink className="gap-x-3" href={link.href}>
											<Logo className="size-6" />
											<span className="sr-only xs:not-sr-only">{link.label}</span>
										</AppNavLink>
									</li>
								);
							}

							return (
								<li key={id}>
									<AppNavLink href={link.href}>{link.label}</AppNavLink>
								</li>
							);
						})}
					</ul>
				</nav>

				<div className="-mr-1 flex items-center gap-x-2">
					<ColorSchemeSwitcher />
					<LocaleSwitcher />
				</div>
			</div>
		</header>
	);
}
