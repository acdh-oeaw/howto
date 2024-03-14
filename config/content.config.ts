import { env } from "@/config/env.config";

export function createAssetPaths(segment: `/${string}/`) {
	return {
		directory: `./public/assets${segment}`,
		publicPath: `/assets${segment}`,
	};
}

export function createPreviewUrl(previewUrl: string) {
	if (env.NEXT_PUBLIC_KEYSTATIC_MODE === "github") {
		return `/api/preview/start?branch={branch}&to=${previewUrl}`;
	}

	return previewUrl;
}
