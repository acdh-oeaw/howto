"use client";

import type { ElementRef } from "react";
import {
	composeRenderProps,
	TextField as AriaTextField,
	type TextFieldProps as AriaTextFieldProps,
} from "react-aria-components";

import { type ForwardedRef, forwardRef } from "@/lib/forward-ref";
import { type VariantProps, variants } from "@/lib/styles";

export const textFieldStyles = variants({
	base: ["group grid content-start gap-y-1.5"],
});

export type TextFieldStyles = VariantProps<typeof textFieldStyles>;

export interface TextFieldProps extends AriaTextFieldProps, TextFieldStyles {}

export const TextField = forwardRef(function TextField(
	props: TextFieldProps,
	forwardedRef: ForwardedRef<ElementRef<typeof AriaTextField>>,
) {
	const { children, className, ...rest } = props;

	return (
		<AriaTextField
			ref={forwardedRef}
			{...rest}
			className={composeRenderProps(className, (className, renderProps) => {
				return textFieldStyles({ ...renderProps, className });
			})}
		>
			{children}
		</AriaTextField>
	);
});
