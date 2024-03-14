import { createUrl, createUrlSearchParams } from "@acdh-oeaw/lib";

interface VideoProps {
	caption?: string;
	id: string;
	provider: "youtube";
	startTime?: number;
}

export function Video(props: VideoProps) {
	const { caption, id, startTime } = props;

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
			<figcaption>{caption}</figcaption>
		</figure>
	);
}
