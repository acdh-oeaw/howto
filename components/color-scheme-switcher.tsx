import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

import type { ColorScheme } from "@/lib/color-scheme-script";

const ColorSchemeSelect = dynamic(
	() => {
		return import("@/components/color-scheme-select").then((module) => {
			return module.ColorSchemeSelect;
		});
	},
	{
		loading: ColorSchemeSelectLoadingIndicator,
		ssr: false,
	},
);

export function ColorSchemeSwitcher() {
	const t = useTranslations("ColorSchemeSwitcher");

	const items = useMemo(() => {
		return Object.fromEntries(
			(["system", "light", "dark"] as const).map((id) => {
				return [id, t(`color-schemes.${id}`)];
			}),
		) as Record<ColorScheme | "system", string>;
	}, [t]);

	return <ColorSchemeSelect items={items} label={t("change-color-scheme")} />;
}

function ColorSchemeSelectLoadingIndicator() {
	return <div className="size-9" />;
}
