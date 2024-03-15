import { createPreset as createDesignTokenPreset } from "@acdh-oeaw/tailwindcss-preset";
import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";
import createPlugin from "tailwindcss/plugin";
import reactAriaComponentsPlugin from "tailwindcss-react-aria-components";

const designTokensPreset = createDesignTokenPreset();

const config = {
	content: [
		"./@(app|components|config|lib|styles)/**/*.@(css|ts|tsx)",
		"./content/**/*.@(md|mdx)",
		"./keystatic.config.tsx",
	],
	darkMode: [
		"variant",
		[":where(.kui-theme.kui-scheme--dark) &", ':where([data-ui-color-scheme="dark"]) &'],
	],
	plugins: [
		reactAriaComponentsPlugin,
		createPlugin(({ addBase }) => {
			addBase({
				":root": {
					color: "hsl(var(--color-neutral-600))",
					backgroundColor: "hsl(var(--color-neutral-0))",
				},
				':root[data-ui-color-scheme="dark"]': {
					color: "hsl(var(--color-neutral-400))",
					backgroundColor: "hsl(var(--color-neutral-900))",
				},
				body: {
					backgroundColor: "hsl(var(--color-neutral-100))",
				},
				'[data-ui-color-scheme="dark"] body': {
					backgroundColor: "hsl(var(--color-neutral-950))",
				},
				"[hidden]": {
					display: "none !important",
				},
			});
		}),
	],
	presets: [designTokensPreset],
	theme: {
		extend: {
			colors: {
				informative: colors.sky,
				negative: colors.red,
				notice: colors.orange,
				positive: colors.green,
			},
			typography: {
				DEFAULT: {
					css: {
						/** Don't add quotes around `blockquote`. */
						"blockquote p:first-of-type::before": null,
						"blockquote p:last-of-type::after": null,

						/** Don't add backticks around inline `code`. */
						"code::before": null,
						"code::after": null,

						strong: {
							color: "inherit",
						},
					},
				},
			},
		},
	},
} satisfies Config;

export default config;
