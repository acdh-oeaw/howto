"use client";

import type { ElementRef } from "react";
import { composeRenderProps } from "react-aria-components";

import { Input, type InputProps } from "@/components/ui/input";
import { type ForwardedRef, forwardRef } from "@/lib/forward-ref";
import { type VariantProps, variants } from "@/lib/styles";

export const textInputStyles = variants({
	base: [],
});

export type TextInputStyles = VariantProps<typeof textInputStyles>;

export interface TextInputProps extends InputProps, TextInputStyles {}

export const TextInput = forwardRef(function TextInput(
	props: TextInputProps,
	forwardedRef: ForwardedRef<ElementRef<typeof Input>>,
) {
	const { children, className, ...rest } = props;

	return (
		<Input
			ref={forwardedRef}
			{...rest}
			className={composeRenderProps(className, (className, renderProps) => {
				return textInputStyles({ ...renderProps, className });
			})}
		>
			{children}
		</Input>
	);
});
