import { createUrl, createUrlSearchParams } from "@acdh-oeaw/lib";
import type { ReactNode } from "react";

interface VideoProps {
	children?: ReactNode;
	id: string;
	provider: "youtube";
	startTime?: number;
}

export function Video(props: VideoProps) {
	const { children, id, startTime } = props;

	const url = String(
		createUrl({
			baseUrl: "https://www.youtube-nocookie.com",
			pathname: `/embed/${id}`,
			searchParams: createUrlSearchParams({ s: startTime }),
		}),
	);

	return (
		<figure>
			<iframe
				allowFullScreen={true}
				className="aspect-video w-full overflow-hidden rounded-md"
				src={url}
				title="Video"
			/>
			<figcaption>{children}</figcaption>
		</figure>
	);
}
