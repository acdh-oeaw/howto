/** @typedef {import('next').NextConfig} NextConfig */

import createBundleAnalyzer from "@next/bundle-analyzer";
import createMdxPlugin from "@next/mdx";
import localesPlugin from "@react-aria/optimize-locales-plugin";
import createI18nPlugin from "next-intl/plugin";

import { env } from "./config/env.config.js";
import { config as mdxConfig } from "./config/mdx.config.js";

/** @type {NextConfig} */
const config = {
	eslint: {
		dirs: [process.cwd()],
		ignoreDuringBuilds: true,
	},
	logging: {
		fetches: {
			fullUrl: true,
		},
	},
	output: env.BUILD_MODE,
	pageExtensions: ["ts", "tsx", "md", "mdx"],
	redirects() {
		/** Resolve legacy urls from previous version. */
		/** @type {Awaited<ReturnType<NonNullable<NextConfig["redirects"]>>>} */
		const redirects = [
			{
				source: "/:locale(de|en)?/resource/posts/lesson-1-make-a-plan",
				destination: "/resources/semantickraus-lesson-1-make-a-plan",
				permanent: true,
			},
			{
				source: "/:locale(de|en)?/resource/posts/lesson-2-meet-the-data",
				destination: "/resources/semantickraus-lesson-2-meet-the-data",
				permanent: true,
			},
			{
				source: "/:locale(de|en)?/resource/posts/lesson-3-copy-and-paste",
				destination: "/resources/semantickraus-lesson-3-copy-and-paste",
				permanent: true,
			},
			{
				source: "/:locale(de|en)?/resource/posts/:path*",
				destination: "/resources/:path*",
				permanent: true,
			},
			{
				source: "/:locale(de|en)?/curriculum/:path*",
				destination: "/curricula/:path*",
				permanent: true,
			},
			{
				source: "/:locale(de|en)?/resources/page/:path*",
				destination: "/resources",
				permanent: false,
			},
			{
				source: "/:locale(de|en)?/curricula/page/:path*",
				destination: "/curricula",
				permanent: false,
			},
		];

		return Promise.resolve(redirects);
	},
	typescript: {
		ignoreBuildErrors: true,
	},
	webpack(config, { isServer }) {
		/**
		 * @see https://react-spectrum.adobe.com/react-aria/ssr.html#nextjs-app-router
		 */
		if (!isServer) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
			config.plugins.push(localesPlugin.webpack({ locales: [] }));
		}

		// eslint-disable-next-line @typescript-eslint/no-unsafe-return
		return config;
	},
};

/** @type {Array<(config: NextConfig) => NextConfig>} */
const plugins = [
	createBundleAnalyzer({ enabled: env.BUNDLE_ANALYZER === "enabled" }),
	createI18nPlugin("./lib/i18n.ts"),
	createMdxPlugin({
		extension: /\.(md|mdx)$/,
		options: mdxConfig,
	}),
];

export default plugins.reduce((config, plugin) => {
	return plugin(config);
}, config);
