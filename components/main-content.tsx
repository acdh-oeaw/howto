import type { ReactNode } from "react";

import { cn } from "@/lib/styles";

export const id = "main-content";

interface MainContentProps {
	children: ReactNode;
	className?: string;
}

export function MainContent(props: MainContentProps) {
	const { children, className } = props;

	return (
		<main
			className={cn(
				"max-w-screen-md border-x bg-neutral-0 outline-0 dark:bg-neutral-900",
				className,
			)}
			id={id}
			tabIndex={-1}
		>
			{children}
		</main>
	);
}
