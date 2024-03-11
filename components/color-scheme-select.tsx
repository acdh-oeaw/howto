"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import type { Key, ReactNode } from "react";

import { IconButton } from "@/components/ui/icon-button";
import {
	Select,
	SelectListBox,
	SelectListBoxItem,
	SelectPopover,
	SelectValue,
} from "@/components/ui/select";
import type { ColorScheme } from "@/lib/color-scheme-script";
import { useColorScheme } from "@/lib/use-color-scheme";

interface ColorSchemeSelectProps {
	items: Record<ColorScheme | "system", string>;
	label: string;
}

export function ColorSchemeSelect(props: ColorSchemeSelectProps): ReactNode {
	const { items, label } = props;

	const { colorSchemeState, setColorScheme } = useColorScheme();

	function onSelectionChange(key: Key) {
		const value = key as keyof ColorSchemeSelectProps["items"];

		setColorScheme(value === "system" ? null : value);
	}

	const selectedKey = colorSchemeState.kind === "system" ? "system" : colorSchemeState.colorScheme;

	const Icon = colorSchemeState.colorScheme === "dark" ? MoonIcon : SunIcon;

	return (
		<Select
			aria-label={label}
			name="color-scheme"
			onSelectionChange={onSelectionChange}
			selectedKey={selectedKey}
		>
			<IconButton variant="plain">
				<Icon aria-hidden={true} className="size-5 shrink-0" />
				<SelectValue className="sr-only" />
			</IconButton>
			<SelectPopover placement="bottom">
				<SelectListBox>
					{Object.entries(items).map(([id, label]) => {
						return (
							<SelectListBoxItem key={id} id={id} textValue={label}>
								{label}
							</SelectListBoxItem>
						);
					})}
				</SelectListBox>
			</SelectPopover>
		</Select>
	);
}
