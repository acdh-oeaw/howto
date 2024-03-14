import "client-only";

import { useLayoutEffect, useSyncExternalStore } from "react";

import type { ColorScheme, ColorSchemeState } from "@/lib/color-scheme-script";
import { useLocale } from "@/lib/navigation";

interface UseColorSchemeReturnValue {
	colorSchemeState: ColorSchemeState;
	setColorScheme: (colorScheme: ColorScheme | null) => void;
}

export function useColorScheme(): UseColorSchemeReturnValue {
	const locale = useLocale();

	const state = useSyncExternalStore(window.__colorScheme.subscribe, window.__colorScheme.get);

	/**
	 * When the `locale` param changes, next.js will re-render the locale layout, but not
	 * re-execute the color scheme script, resulting in an `<html>` element without
	 * the `data-ui-color-scheme` attribute. So we need to programmatically re-apply it before
	 * next paint.
	 */
	useLayoutEffect(() => {
		window.__colorScheme.sync();
	}, [locale]);

	return {
		colorSchemeState: state,
		setColorScheme: window.__colorScheme.set,
	};
}
