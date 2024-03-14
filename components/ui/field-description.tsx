"use client";

import type { ElementRef } from "react";
import {
	Text as AriaFieldDescription,
	type TextProps as AriaFieldDescriptionProps,
} from "react-aria-components";

import { type ForwardedRef, forwardRef } from "@/lib/forward-ref";
import { type VariantProps, variants } from "@/lib/styles";

export const fieldDescriptionStyles = variants({
	base: [
		"transition",
		"text-xs leading-normal text-neutral-600 dark:text-neutral-400",
		"disabled:opacity-50",
	],
});

export type FieldDescriptionStyles = VariantProps<typeof fieldDescriptionStyles>;

export interface FieldDescriptionProps
	extends Omit<AriaFieldDescriptionProps, "slot">,
		FieldDescriptionStyles {}

export const FieldDescription = forwardRef(function FieldDescription(
	props: FieldDescriptionProps,
	forwardedRef: ForwardedRef<ElementRef<typeof AriaFieldDescription>>,
) {
	const { children, className, ...rest } = props;

	return (
		<AriaFieldDescription
			ref={forwardedRef}
			{...rest}
			className={fieldDescriptionStyles({ className })}
			slot="description"
		>
			{children}
		</AriaFieldDescription>
	);
});
