import { type ReactNode } from "react";

export interface LeadInProps {
	children: ReactNode;
}

/**
 * Lead in text.
 */
export function LeadIn(props: LeadInProps): JSX.Element {
	const { children } = props;

	return <div className="text-lg text-neutral-100">{children}</div>;
}
