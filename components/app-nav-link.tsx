"use client";

import { AppLink } from "@/components/app-link";
import type { LinkProps } from "@/components/link";
import { useNavLink } from "@/lib/use-nav-link";

interface AppNavLinkProps extends LinkProps {}

export function AppNavLink(props: AppNavLinkProps) {
	const { children, ...rest } = props;

	const navLinkProps = useNavLink(rest);

	return (
		<AppLink
			{...rest}
			{...navLinkProps}
			data-current={Boolean(navLinkProps["aria-current"]) || undefined}
		>
			{children}
		</AppLink>
	);
}
