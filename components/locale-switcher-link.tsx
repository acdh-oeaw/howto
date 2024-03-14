"use client";

import { useSearchParams } from "next/navigation";
import type { ReactNode } from "react";

import { AppLink } from "@/components/app-link";
import type { Locale } from "@/config/i18n.config";
import { createHref } from "@/lib/create-href";
import { usePathname } from "@/lib/navigation";

interface LocaleSwitcherLinkProps {
	children: ReactNode;
	locale: Locale;
}

export function LocaleSwitcherLink(props: LocaleSwitcherLinkProps) {
	const { children, locale } = props;

	const pathname = usePathname();
	const searchParams = useSearchParams();

	return (
		<AppLink
			className="inline-grid aspect-square size-9 place-content-center p-1"
			href={createHref({ pathname, searchParams })}
			locale={locale}
		>
			{children}
		</AppLink>
	);
}

export function LocaleSwitcherLinkFallback(props: LocaleSwitcherLinkProps) {
	const { children, locale } = props;

	const pathname = usePathname();

	return (
		<AppLink
			className="inline-grid aspect-square size-9 place-content-center p-1"
			href={createHref({ pathname })}
			locale={locale}
		>
			{children}
		</AppLink>
	);
}
