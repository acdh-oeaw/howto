import type { ReactNode } from "react";

import { Image } from "@/components/content/image";

interface FigureProps {
	alt?: string;
	children: ReactNode;
	src: string;
}

export function Figure(props: FigureProps) {
	const { alt = "", children, src } = props;

	return (
		<figure>
			<Image alt={alt} className="overflow-hidden rounded-md" src={src} />
			<figcaption>{children}</figcaption>
		</figure>
	);
}
