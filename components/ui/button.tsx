"use client";

import type { ElementRef } from "react";
import {
	Button as AriaButton,
	type ButtonProps as AriaButtonProps,
	composeRenderProps,
} from "react-aria-components";

import { TouchTarget } from "@/components/ui/touch-target";
import { type ForwardedRef, forwardRef } from "@/lib/forward-ref";
import { type VariantProps, variants } from "@/lib/styles";

export const buttonStyles = variants({
	base: [
		"relative inline-flex cursor-default items-center justify-center gap-x-2 whitespace-nowrap transition",
		"rounded-md px-3 py-1.5",
		"text-sm font-medium leading-normal",
		"border",

		"disabled:opacity-50",
	],
	variants: {
		variant: {
			solid: [
				"border-neutral-950/90 dark:border-neutral-0/5",
				"bg-neutral-900 text-neutral-0 dark:bg-neutral-600",
				"hover:bg-neutral-900/90 dark:hover:bg-neutral-600/90",
				"shadow-sm dark:shadow-none",
				"disabled:shadow-none",
			],
			outline: [
				"border-neutral-950/10 dark:border-neutral-0/15",
				"bg-transparent hover:bg-neutral-950/[2.5%] pressed:bg-neutral-950/[2.5%]",
				"text-neutral-950 dark:text-neutral-0",
			],
			plain: [
				"border-transparent",
				"hover:bg-neutral-950/5 pressed:bg-neutral-950/5",
				"text-neutral-950 dark:text-neutral-0",
				"dark:hover:bg-neutral-0/10 dark:pressed:bg-neutral-0/10",
			],
		},
	},
	defaultVariants: {
		variant: "solid",
	},
});

export type ButtonStyles = VariantProps<typeof buttonStyles>;

export interface ButtonProps extends AriaButtonProps, ButtonStyles {}

export const Button = forwardRef(function Button(
	props: ButtonProps,
	forwardedRef: ForwardedRef<ElementRef<typeof AriaButton>>,
) {
	const { children, className, variant, ...rest } = props;

	return (
		<AriaButton
			ref={forwardedRef}
			{...rest}
			className={composeRenderProps(className, (className, renderProps) => {
				return buttonStyles({ ...renderProps, className, variant });
			})}
		>
			{composeRenderProps(children, (children, _renderProps) => {
				return <TouchTarget>{children}</TouchTarget>;
			})}
		</AriaButton>
	);
});
