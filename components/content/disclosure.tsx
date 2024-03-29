import type { ReactNode } from "react";

interface DisclosureProps {
	children: ReactNode;
	title: string;
}

export function Disclosure(props: DisclosureProps) {
	const { children, title, ...rest } = props;

	return (
		<details {...rest}>
			<summary>{title}</summary>
			{children}
		</details>
	);
}
