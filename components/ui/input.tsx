"use client";

import type { ElementRef } from "react";
import {
	composeRenderProps,
	Input as AriaInput,
	type InputProps as AriaInputProps,
} from "react-aria-components";

import { type ForwardedRef, forwardRef } from "@/lib/forward-ref";
import { type VariantProps, variants } from "@/lib/styles";

/** @internal */
export const inputStyles = variants({
	base: [
		"flex w-full min-w-0 appearance-none transition",
		"rounded-md px-3 py-1.5",
		"text-sm leading-normal text-neutral-950 placeholder:text-neutral-500 dark:text-neutral-0",
		"border border-neutral-950/10 hover:border-neutral-950/20 dark:border-neutral-0/10 dark:hover:border-neutral-0/20",
		"bg-neutral-0 dark:bg-neutral-0/5",
		"shadow-sm dark:shadow-none",
		"invalid:border-negative-500 invalid:shadow-negative-500/10 invalid:hover:border-negative-500 dark:invalid:border-negative-500 dark:invalid:hover:border-negative-500",
		"disabled:border-neutral-950/20 disabled:bg-neutral-950/5 disabled:opacity-50 disabled:shadow-none dark:disabled:border-neutral-0/15 dark:disabled:hover:border-neutral-0/15",
		"outline outline-0 outline-neutral-950 invalid:outline-negative-500 focus:outline-1 focus-visible:outline-2 dark:outline-neutral-0 forced-colors:outline-[Highlight]",
	],
});

/** @internal */
export type InputStyles = VariantProps<typeof inputStyles>;

/** @internal */
export interface InputProps extends AriaInputProps, InputStyles {}

/** @internal */
export const Input = forwardRef(function Input(
	props: InputProps,
	forwardedRef: ForwardedRef<ElementRef<typeof AriaInput>>,
) {
	const { children, className, ...rest } = props;

	return (
		<AriaInput
			ref={forwardedRef}
			{...rest}
			className={composeRenderProps(className, (className, renderProps) => {
				return inputStyles({ ...renderProps, className });
			})}
		>
			{children}
		</AriaInput>
	);
});
