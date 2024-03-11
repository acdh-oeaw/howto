"use client";

import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { type ElementRef, Fragment } from "react";
import {
	Button as AriaSelectTrigger,
	type ButtonProps as AriaSelectTriggerProps,
	composeRenderProps,
	ListBox as AriaSelectListBox,
	ListBoxItem as AriaSelectListBoxItem,
	type ListBoxItemProps as AriaSelectListBoxItemProps,
	type ListBoxProps as AriaSelectListBoxProps,
	Popover as AriaSelectPopover,
	type PopoverProps as AriaSelectPopoverProps,
	Select as AriaSelect,
	type SelectProps as AriaSelectProps,
	SelectValue as AriaSelectValue,
	type SelectValueProps as AriaSelectValueProps,
} from "react-aria-components";

import { type ForwardedRef, forwardRef } from "@/lib/forward-ref";
import { type VariantProps, variants } from "@/lib/styles";

export const selectStyles = variants({
	base: ["group grid content-start gap-y-1.5"],
});

export type SelectStyles = VariantProps<typeof selectStyles>;

export interface SelectProps<T extends object> extends AriaSelectProps<T>, SelectStyles {}

export const Select = forwardRef(function Select<T extends object>(
	props: SelectProps<T>,
	forwardedRef: ForwardedRef<ElementRef<typeof AriaSelect>>,
) {
	const { children, className, ...rest } = props;

	return (
		<AriaSelect<T>
			ref={forwardedRef}
			{...rest}
			className={composeRenderProps(className, (className, renderProps) => {
				return selectStyles({ ...renderProps, className });
			})}
		>
			{children}
		</AriaSelect>
	);
});

export const selectTriggerStyles = variants({
	base: [
		"flex w-full min-w-0 cursor-default appearance-none items-center justify-between gap-x-4 whitespace-nowrap transition",
		"rounded-md py-1.5 pl-3 pr-2.5",
		"text-sm leading-normal text-neutral-950 dark:text-neutral-0",
		//
		"border border-neutral-950/10 hover:border-neutral-950/20 dark:border-neutral-0/10 dark:hover:border-neutral-0/20",
		"bg-neutral-0 dark:bg-neutral-0/5",
		"shadow-sm dark:shadow-none",
		//
		"invalid:border-negative-500 invalid:shadow-negative-500/10 invalid:hover:border-negative-500 dark:invalid:border-negative-500 dark:invalid:hover:border-negative-500",
		"disabled:border-neutral-950/20 disabled:bg-neutral-950/5 disabled:opacity-50 disabled:shadow-none dark:disabled:border-neutral-0/15 dark:disabled:hover:border-neutral-0/15",
		//
		"outline outline-0 outline-neutral-950 invalid:outline-negative-500 focus:outline-1 focus-visible:outline-2 dark:outline-neutral-0 forced-colors:outline-[Highlight]",
	],
});

export type SelectTriggerStyles = VariantProps<typeof selectTriggerStyles>;

export interface SelectTriggerProps extends AriaSelectTriggerProps, SelectTriggerStyles {}

export const SelectTrigger = forwardRef(function SelectTrigger(
	props: SelectTriggerProps,
	forwardedRef: ForwardedRef<ElementRef<typeof AriaSelectTrigger>>,
) {
	const { children, className, ...rest } = props;

	return (
		<AriaSelectTrigger
			ref={forwardedRef}
			{...rest}
			className={composeRenderProps(className, (className, renderProps) => {
				return selectTriggerStyles({ ...renderProps, className });
			})}
		>
			{composeRenderProps(children, (children, _renderProps) => {
				return (
					<Fragment>
						{children}
						<ChevronsUpDownIcon aria-hidden={true} className="size-4 shrink-0 text-neutral-400" />
					</Fragment>
				);
			})}
		</AriaSelectTrigger>
	);
});

export const selectValueStyles = variants({
	base: ["placeholder-shown:text-neutral-500"],
});

export type SelectValueStyles = VariantProps<typeof selectValueStyles>;

export interface SelectValueProps<T extends object>
	extends AriaSelectValueProps<T>,
		SelectValueStyles {}

export const SelectValue = forwardRef(function SelectValue<T extends object>(
	props: SelectValueProps<T>,
	forwardedRef: ForwardedRef<ElementRef<typeof AriaSelectValue>>,
) {
	const { children, className, ...rest } = props;

	return (
		<AriaSelectValue<T>
			ref={forwardedRef}
			{...rest}
			className={composeRenderProps(className, (className, renderProps) => {
				return selectValueStyles({ ...renderProps, className });
			})}
		>
			{children}
		</AriaSelectValue>
	);
});

export const selectPopoverStyles = variants({
	base: ["w-fit min-w-[--trigger-width]"],
});

export type SelectPopoverStyles = VariantProps<typeof selectPopoverStyles>;

export interface SelectPopoverProps extends AriaSelectPopoverProps, SelectPopoverStyles {}

export const SelectPopover = forwardRef(function SelectPopover(
	props: SelectPopoverProps,
	forwardedRef: ForwardedRef<ElementRef<typeof AriaSelectPopover>>,
) {
	const { children, className, ...rest } = props;

	return (
		<AriaSelectPopover
			ref={forwardedRef}
			{...rest}
			className={composeRenderProps(className, (className, renderProps) => {
				return selectPopoverStyles({ ...renderProps, className });
			})}
		>
			{children}
		</AriaSelectPopover>
	);
});

export const selectListBoxStyles = variants({
	base: [
		"outline outline-1 outline-transparent transition",
		// "overflow-y-scroll overscroll-contain",
		"select-none",
		"rounded-md p-1",
		"bg-neutral-0 dark:bg-neutral-800",
		"shadow-lg",
		// "backdrop-blur-xl",
		"border border-neutral-950/10 dark:border-neutral-0/10",
		"text-sm text-neutral-950 dark:text-neutral-0",
	],
});

export type SelectListBoxStyles = VariantProps<typeof selectListBoxStyles>;

export interface SelectListBoxProps<T extends object>
	extends AriaSelectListBoxProps<T>,
		SelectListBoxStyles {}

export const SelectListBox = forwardRef(function SelectListBox<T extends object>(
	props: SelectListBoxProps<T>,
	forwardedRef: ForwardedRef<ElementRef<typeof AriaSelectListBox>>,
) {
	const { children, className, ...rest } = props;

	return (
		<AriaSelectListBox<T>
			ref={forwardedRef}
			{...rest}
			className={composeRenderProps(className, (className, renderProps) => {
				return selectListBoxStyles({ ...renderProps, className });
			})}
		>
			{children}
		</AriaSelectListBox>
	);
});

export const selectListBoxItemStyles = variants({
	base: [
		"outline-transparent",
		"relative flex items-center justify-between gap-x-4",
		"transition",
		"rounded-sm py-1.5 pl-3 pr-9",
		"focus:bg-neutral-950/5 dark:focus:bg-neutral-0/5",
	],
});

export type SelectListBoxItemStyles = VariantProps<typeof selectListBoxItemStyles>;

export interface SelectListBoxItemProps<T extends object>
	extends AriaSelectListBoxItemProps<T>,
		SelectListBoxItemStyles {
	/** Require text value because we add a checkmark icon. */
	textValue: NonNullable<AriaSelectListBoxItemProps<T>["textValue"]>;
}

export const SelectListBoxItem = forwardRef(function SelectListBoxItem<T extends object>(
	props: SelectListBoxItemProps<T>,
	forwardedRef: ForwardedRef<ElementRef<typeof AriaSelectListBoxItem>>,
) {
	const { children, className, ...rest } = props;

	return (
		<AriaSelectListBoxItem<T>
			ref={forwardedRef}
			{...rest}
			className={composeRenderProps(className, (className, renderProps) => {
				return selectListBoxItemStyles({ ...renderProps, className });
			})}
		>
			{composeRenderProps(children, (children, renderProps) => {
				const { isSelected } = renderProps;

				return (
					<Fragment>
						{children}
						{isSelected ? (
							<CheckIcon aria-hidden={true} className="absolute right-2 size-4 shrink-0" />
						) : null}
					</Fragment>
				);
			})}
		</AriaSelectListBoxItem>
	);
});
