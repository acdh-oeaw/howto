"use client";

import type { ComponentPropsWithoutRef, ElementRef } from "react";
import {
	Heading as AriaCardTitle,
	type HeadingProps as AriaCardTitleProps,
	Text as AriaCardDescription,
	type TextProps as AriaCardDescriptionProps,
} from "react-aria-components";

import { type ForwardedRef, forwardRef } from "@/lib/forward-ref";
import { type VariantProps, variants } from "@/lib/styles";

export const cardStyles = variants({
	base: [
		"relative grid min-w-80 max-w-screen-md content-start gap-y-6 overflow-auto",
		"rounded-md p-6",
		"bg-neutral-0 dark:bg-neutral-800/50",
		"border border-neutral-950/10 dark:border-neutral-0/5",
		"shadow-lg",
	],
});

export type CardStyles = VariantProps<typeof cardStyles>;

export interface CardProps extends ComponentPropsWithoutRef<"article">, CardStyles {}

export const Card = forwardRef(function Card(
	props: CardProps,
	forwardedRef: ForwardedRef<ElementRef<"article">>,
) {
	const { children, className, ...rest } = props;

	return (
		<article ref={forwardedRef} {...rest} className={cardStyles({ className })}>
			{children}
		</article>
	);
});

export const cardHeaderStyles = variants({
	base: ["flex flex-col gap-y-2"],
});

export type CardHeaderStyles = VariantProps<typeof cardHeaderStyles>;

export interface CardHeaderProps extends ComponentPropsWithoutRef<"header">, CardHeaderStyles {}

export const CardHeader = forwardRef(function CardHeader(
	props: CardHeaderProps,
	forwardedRef: ForwardedRef<ElementRef<"header">>,
) {
	const { children, className, ...rest } = props;

	return (
		<header ref={forwardedRef} {...rest} className={cardHeaderStyles({ className })}>
			{children}
		</header>
	);
});

export const cardTitleStyles = variants({
	base: [
		"text-balance text-md font-semibold leading-tight tracking-tight text-neutral-950 dark:text-neutral-0",
	],
});

export type CardTitleStyles = VariantProps<typeof cardTitleStyles>;

export interface CardTitleProps extends AriaCardTitleProps, CardTitleStyles {}

export const CardTitle = forwardRef(function CardTitle(
	props: CardTitleProps,
	forwardedRef: ForwardedRef<ElementRef<typeof AriaCardTitle>>,
) {
	const { children, className, ...rest } = props;

	return (
		<AriaCardTitle
			ref={forwardedRef}
			{...rest}
			className={cardTitleStyles({ className })}
			slot="title"
		>
			{children}
		</AriaCardTitle>
	);
});

export const cardDescriptionStyles = variants({
	base: ["text-pretty text-sm leading-normal text-neutral-600 dark:text-neutral-400"],
});

export type CardDescriptionStyles = VariantProps<typeof cardDescriptionStyles>;

export interface CardDescriptionProps extends AriaCardDescriptionProps, CardDescriptionStyles {}

export const CardDescription = forwardRef(function CardDescription(
	props: CardDescriptionProps,
	forwardedRef: ForwardedRef<ElementRef<typeof AriaCardDescription>>,
) {
	const { children, className, ...rest } = props;

	return (
		<AriaCardDescription
			ref={forwardedRef}
			{...rest}
			className={cardDescriptionStyles({ className })}
			// TODO: aria-describedby
			slot="description"
		>
			{children}
		</AriaCardDescription>
	);
});

export const cardFooterStyles = variants({
	base: ["flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"],
});

export type CardFooterStyles = VariantProps<typeof cardFooterStyles>;

export interface CardFooterProps extends ComponentPropsWithoutRef<"footer">, CardFooterStyles {}

export const CardFooter = forwardRef(function CardFooter(
	props: CardFooterProps,
	forwardedRef: ForwardedRef<ElementRef<"footer">>,
) {
	const { children, className, ...rest } = props;

	return (
		<footer ref={forwardedRef} {...rest} className={cardFooterStyles({ className })}>
			{children}
		</footer>
	);
});
