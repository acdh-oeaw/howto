import { readFile } from "node:fs/promises";
import { join } from "node:path";

import sizeOf from "image-size";
import NextImage from "next/image";

interface ImageProps {
	alt?: string;
	className?: string;
	height?: number;
	src: string;
	width?: number;
}

export async function Image(props: ImageProps) {
	const { alt = "", src } = props;

	if (src.startsWith("data:") || src.startsWith("http:")) {
		// eslint-disable-next-line @next/next/no-img-element
		return <img {...props} alt={alt} />;
	}

	const dimensions = await getDimensions(src);

	if (dimensions?.height == null || dimensions.width == null) {
		// eslint-disable-next-line @next/next/no-img-element
		return <img {...props} alt={alt} />;
	}

	return (
		<NextImage
			{...props}
			alt={alt}
			src={{
				height: dimensions.height,
				// TODO: use build id instead of timestamp for cache busting.
				/** Next.js will add long-time caching headers for static image imports. */
				src: src + `?timestamp=${String(Date.now())}`,
				width: dimensions.width,
			}}
		/>
	);
}

async function getDimensions(src: string) {
	try {
		// TODO: fetch external images via http.
		// const buffer = Buffer.from(await fetch(src).then(response => response.arrayBuffer()))
		const buffer = await readFile(join(process.cwd(), "public", src));
		const dimensions = sizeOf(buffer);
		return dimensions;
	} catch {
		return null;
	}
}
