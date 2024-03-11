"use client";

import type { ElementRef } from "react";
import {
	Menu as AriaMenu,
	MenuItem as AriaMenuItem,
	type MenuItemProps as AriaMenuItemProps,
	type MenuProps as AriaMenuProps,
	MenuTrigger as AriaMenuTrigger,
	type MenuTriggerProps as AriaMenuTriggerProps,
	Popover as AriaMenuPopover,
	type PopoverProps as AriaMenuPopoverProps,
	Separator as AriaMenuSeparator,
	type SeparatorProps as AriaMenuSeparatorProps,
	SubmenuTrigger as AriaSubMenuTrigger,
	type SubmenuTriggerProps as AriaSubMenuTriggerProps,
} from "react-aria-components";

import { type ForwardedRef, forwardRef } from "@/lib/forward-ref";
import { type VariantProps, variants } from "@/lib/styles";

export {
	AriaMenuTrigger as MenuTrigger,
	type AriaMenuTriggerProps as MenuTriggerProps,
	AriaSubMenuTrigger as SubMenuTrigger,
	type AriaSubMenuTriggerProps as SubMenuTriggerProps,
};

export const menuPopoverStyles = variants({
	base: ["w-fit min-w-[--trigger-width]"],
});

export type MenuPopoverStyles = VariantProps<typeof menuPopoverStyles>;

export interface MenuPopoverProps extends AriaMenuPopoverProps, MenuPopoverStyles {}

export const MenuPopover = forwardRef(function MenuPopover(
	props: MenuPopoverProps,
	forwardedRef: ForwardedRef<ElementRef<typeof AriaMenuPopover>>,
) {
	const { children, className, ...rest } = props;

	return (
		<AriaMenuPopover ref={forwardedRef} {...rest} className={menuPopoverStyles({ className })}>
			{children}
		</AriaMenuPopover>
	);
});

export const menuStyles = variants({
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

export type MenuStyles = VariantProps<typeof menuStyles>;

export interface MenuProps<T extends object> extends AriaMenuProps<T>, MenuStyles {}

export const Menu = forwardRef(function Menu<T extends object>(
	props: MenuProps<T>,
	forwardedRef: ForwardedRef<ElementRef<typeof AriaMenu>>,
) {
	const { children, className, ...rest } = props;

	return (
		<AriaMenu<T> ref={forwardedRef} {...rest} className={menuStyles({ className })}>
			{children}
		</AriaMenu>
	);
});

export const menuItemStyles = variants({
	base: [
		"outline-transparent",
		"flex items-center justify-between gap-x-4",
		"transition",
		"rounded-sm py-1.5 pl-3 pr-2",
		"focus:bg-neutral-950/5 dark:focus:bg-neutral-0/5",
	],
});

export type MenuItemStyles = VariantProps<typeof menuItemStyles>;

export interface MenuItemProps<T extends object> extends AriaMenuItemProps<T>, MenuItemStyles {}

export const MenuItem = forwardRef(function MenuItem<T extends object>(
	props: MenuItemProps<T>,
	forwardedRef: ForwardedRef<ElementRef<typeof AriaMenuItem>>,
) {
	const { children, className, ...rest } = props;

	return (
		<AriaMenuItem<T> ref={forwardedRef} {...rest} className={menuItemStyles({ className })}>
			{children}
		</AriaMenuItem>
	);
});

export const MenuSeparatorStyles = variants({
	base: ["my-2 h-px w-full bg-neutral-200 dark:bg-neutral-700"],
});

export type menuSeparatorStyles = VariantProps<typeof MenuSeparatorStyles>;

export interface MenuSeparatorProps extends AriaMenuSeparatorProps, menuSeparatorStyles {}

export const MenuSeparator = forwardRef(function MenuSeparator(
	props: MenuSeparatorProps,
	forwardedRef: ForwardedRef<ElementRef<typeof AriaMenuSeparator>>,
) {
	const { className, ...rest } = props;

	return (
		<AriaMenuSeparator
			ref={forwardedRef}
			{...rest}
			className={MenuSeparatorStyles({ className })}
		/>
	);
});
