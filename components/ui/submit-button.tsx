"use client";

import type { ElementRef } from "react";
import { composeRenderProps } from "react-aria-components";
import { useFormStatus } from "react-dom";

import { Button, type ButtonProps } from "@/components/ui/button";
import { type ForwardedRef, forwardRef } from "@/lib/forward-ref";
import { type VariantProps, variants } from "@/lib/styles";

export const submitButtonStyles = variants({
	base: [],
});

export type SubmitButtonStyles = VariantProps<typeof submitButtonStyles>;

export interface SubmitButtonProps extends Omit<ButtonProps, "type">, SubmitButtonStyles {}

export const SubmitButton = forwardRef(function SubmitButton(
	props: SubmitButtonProps,
	forwardedRef: ForwardedRef<ElementRef<typeof Button>>,
) {
	const { children, className, isDisabled, ...rest } = props;

	const { pending: isPending } = useFormStatus();

	return (
		<Button
			ref={forwardedRef}
			{...rest}
			aria-disabled={isDisabled === true || isPending}
			className={composeRenderProps(className, (className, renderProps) => {
				return submitButtonStyles({ ...renderProps, className });
			})}
			type="submit"
		>
			{children}
		</Button>
	);
});
