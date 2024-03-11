"use client";

import { Fragment, type ReactNode } from "react";

export interface TouchTargetProps {
	children: ReactNode;
}

export function TouchTarget(props: TouchTargetProps): ReactNode {
	const { children } = props;

	return (
		<Fragment>
			{children}
			<span
				aria-hidden={true}
				className="absolute left-1/2 top-1/2 size-[max(100%,2.75rem)] -translate-x-1/2 -translate-y-1/2 [@media(pointer:fine)]:hidden"
			/>
		</Fragment>
	);
}
