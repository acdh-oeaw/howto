/// <reference types="@stefanprobst/next-svg/types" />

declare module "*.mdx" {
	import { type ComponentType } from "react";

	const Component: ComponentType;
	const metadata: Record<string, unknown>;

	export { metadata };
	export default Component;
}

declare module "*.svg?symbol" {
	import { type FC, type SVGProps } from "react";

	const Image: FC<SVGProps<SVGSVGElement> & { title?: string }>;

	export default Image;
}
