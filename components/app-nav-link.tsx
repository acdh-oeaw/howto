"use client";

import type { ReactNode } from "react";

import { AppLink } from "@/components/app-link";
import type { LinkProps } from "@/components/link";
import { useNavLink } from "@/lib/use-nav-link";

interface AppNavLinkProps extends LinkProps {}

export function AppNavLink(props: AppNavLinkProps): ReactNode {
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
