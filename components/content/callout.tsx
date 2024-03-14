import { isNonEmptyString } from "@acdh-oeaw/lib";
import type { ReactNode } from "react";

import { type VariantProps, variants } from "@/lib/styles";

const calloutStyles = variants({
	base: "my-4 rounded-md border p-4 text-sm leading-relaxed shadow dark:shadow-none [&>:first-child]:mt-0 [&>:last-child]:mb-0",
	variants: {
		kind: {
			caution:
				"border-negative-950/10 bg-negative-100 text-negative-950 dark:border-negative-700/20 dark:bg-negative-700/15 dark:text-negative-50",
			important:
				"border-informative-950/10 bg-informative-100 text-informative-950 dark:border-informative-700/20 dark:bg-informative-700/15 dark:text-informative-50",
			note: "border-neutral-950/10 bg-neutral-100 text-neutral-950 dark:border-neutral-700/20 dark:bg-neutral-700/15 dark:text-neutral-50",
			tip: "border-positive-950/10 bg-positive-100 text-positive-950 dark:border-positive-700/20 dark:bg-positive-700/15 dark:text-positive-50",
			warning:
				"border-notice-950/10 bg-notice-100 text-notice-950 dark:border-notice-700/20 dark:bg-notice-700/15 dark:text-notice-50",
		},
	},
	defaultVariants: {
		kind: "note",
	},
});

type CalloutStyles = VariantProps<typeof calloutStyles>;

interface CalloutProps extends CalloutStyles {
	children: ReactNode;
	className?: string;
	title?: ReactNode;
}

export function Callout(props: CalloutProps): ReactNode {
	const { children, className, kind, title, ...rest } = props;

	return (
		<aside {...rest} className={calloutStyles({ className, kind })}>
			{isNonEmptyString(title) ? <strong className="mb-4 block">{title}</strong> : null}
			{children}
		</aside>
	);
}
