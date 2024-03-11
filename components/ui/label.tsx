"use client";

import type { ElementRef } from "react";
import { Label as AriaLabel, type LabelProps as AriaLabelProps } from "react-aria-components";

import { type ForwardedRef, forwardRef } from "@/lib/forward-ref";
import { type VariantProps, variants } from "@/lib/styles";

export const labelStyles = variants({
	base: [
		"select-none transition",
		"text-sm font-medium leading-normal text-neutral-950 dark:text-neutral-0",
		"disabled:opacity-50",
	],
});

export type LabelStyles = VariantProps<typeof labelStyles>;

export interface LabelProps extends AriaLabelProps, LabelStyles {}

export const Label = forwardRef(function Label(
	props: LabelProps,
	forwardedRef: ForwardedRef<ElementRef<typeof AriaLabel>>,
) {
	const { children, className, ...rest } = props;

	return (
		<AriaLabel ref={forwardedRef} {...rest} className={labelStyles({ className })}>
			{children}
		</AriaLabel>
	);
});
