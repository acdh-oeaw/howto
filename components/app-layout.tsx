import type { ReactNode } from "react";

interface AppLayoutProps {
	children: ReactNode;
}

export function AppLayout(props: AppLayoutProps): ReactNode {
	const { children } = props;

	return <div className="relative isolate grid h-full grid-rows-[auto_1fr_auto]">{children}</div>;
}
