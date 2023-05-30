import Link from "next/link";

import { useI18n } from "@/i18n/useI18n";

export const mainContentId = "main";

/**
 * Link to skip to main page content.
 *
 * Visible only when focused. Should be placed as the first element in a page's
 * tab order.
 */
export function SkipLink(): JSX.Element {
	const { t } = useI18n();

	/**
	 * A regular `<a>` element with an url fragment `href` does move focus to the
	 * linked element in Chromium, but not in Firefox.
	 *
	 * When using a `next/link`, focus does not move at all, so we move it manually.
	 *
	 * @see https://github.com/vercel/next.js/issues/22838
	 */
	function moveFocus() {
		document.getElementById(mainContentId)?.focus();
	}

	return (
		<Link
			href={{ hash: mainContentId }}
			onClick={moveFocus}
			className="absolute z-10 m-3 flex -translate-y-full rounded bg-white px-6 py-3 font-medium focus:translate-y-0 focus:outline-none focus-visible:ring focus-visible:ring-brand-blue"
		>
			{t("common.skipToMainContent")}
		</Link>
	);
}
