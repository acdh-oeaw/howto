import type { ReactNode } from "react";

interface FigureProps {
	alt?: string;
	children: ReactNode;
	src: string;
}

export function Figure(props: FigureProps) {
	const { alt = "", children, src } = props;

	return (
		<figure>
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img alt={alt} className="overflow-hidden rounded-md" src={src} />
			<figcaption>{children}</figcaption>
		</figure>
	);
}
