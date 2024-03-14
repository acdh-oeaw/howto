import type { ReactNode } from "react";

import {
	Menu,
	MenuItem,
	MenuPopover,
	type MenuPopoverProps,
	type MenuProps,
	MenuTrigger,
} from "@/components/ui/menu";

interface DropdownMenuProps<T extends object> extends MenuProps<T> {
	children: ReactNode;
	placement?: MenuPopoverProps["placement"];
}

export function DropdownMenu<T extends object>(props: DropdownMenuProps<T>) {
	const { children, placement, ...rest } = props;

	return (
		<MenuPopover placement={placement}>
			<Menu {...rest}>{children}</Menu>
		</MenuPopover>
	);
}

export { MenuItem as DropdownMenuItem, MenuTrigger as DropdownMenuTrigger };
