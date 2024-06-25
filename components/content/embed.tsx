import type { ReactNode } from "react";

interface EmbedProps {
	children?: ReactNode;
	url: string;
}

export function Embed(props: EmbedProps) {
	const { children, url } = props;

	return (
		<figure>
			<iframe
				allowFullScreen={true}
				className="aspect-video w-full overflow-hidden rounded-md"
				src={url}
				title="Embed"
			/>
			<figcaption>{children}</figcaption>
		</figure>
	);
}
