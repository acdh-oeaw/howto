"use client";

import type { ReactNode } from "react";

import { Link, type LinkProps } from "@/components/link";
import { TouchTarget } from "@/components/ui/touch-target";
import { cn } from "@/lib/styles";

interface AppLinkProps extends LinkProps {}

export function AppLink(props: AppLinkProps): ReactNode {
	const { children, className, ...rest } = props;

	return (
		<Link
			{...rest}
			className={cn(
				"inline-flex items-center gap-x-2 rounded-md px-3 py-1.5 text-neutral-700 transition current:font-medium current:text-neutral-950 hover:text-neutral-950 focus-visible:text-neutral-950 dark:text-neutral-300 dark:current:text-neutral-0 dark:hover:text-neutral-0 dark:focus-visible:text-neutral-0",
				className,
			)}
		>
			<TouchTarget>{children}</TouchTarget>
		</Link>
	);
}
