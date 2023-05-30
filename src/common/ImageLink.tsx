import { type ComponentPropsWithoutRef } from "react";

export function ImageLink(props: ComponentPropsWithoutRef<"img">): JSX.Element {
	return (
		<a href={props.src} target="_blank" rel="noreferrer">
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img alt="" {...props} />
		</a>
	);
}
