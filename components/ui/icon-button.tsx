"use client";

import type { ElementRef } from "react";
import { composeRenderProps } from "react-aria-components";

import { Button, type ButtonProps } from "@/components/ui/button";
import { type ForwardedRef, forwardRef } from "@/lib/forward-ref";
import { type VariantProps, variants } from "@/lib/styles";

export const iconButtonStyles = variants({
	base: ["inline-grid size-9 place-content-center p-1"],
});

export type IconButtonStyles = VariantProps<typeof iconButtonStyles>;

export interface IconButtonProps extends ButtonProps, IconButtonStyles {}

export const IconButton = forwardRef(function IconButton(
	props: IconButtonProps,
	forwardedRef: ForwardedRef<ElementRef<typeof Button>>,
) {
	const { children, className, ...rest } = props;

	return (
		<Button
			ref={forwardedRef}
			{...rest}
			className={composeRenderProps(className, (className, renderProps) => {
				return iconButtonStyles({ ...renderProps, className });
			})}
		>
			{children}
		</Button>
	);
});
