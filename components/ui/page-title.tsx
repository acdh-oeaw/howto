import type { ReactNode } from "react";

interface PageTitleProps {
	children: ReactNode;
}

export function PageTitle(props: PageTitleProps) {
	const { children } = props;

	return (
		<h1 className="text-balance font-heading text-3xl font-bold leading-tight tracking-tighter text-neutral-950 xs:text-4xl md:text-5xl dark:text-neutral-0">
			{children}
		</h1>
	);
}
