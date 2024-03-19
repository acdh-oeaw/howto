import type { Metadata } from "next";
import { Suspense } from "react";
import { LocalizedStringProvider as Translations } from "react-aria-components/i18n";

import KeystaticApp from "@/app/keystatic/keystatic";

export const metadata: Metadata = {
	robots: {
		index: false,
	},
};

export default function RootLayout() {
	const locale = "en";

	return (
		<html lang={locale}>
			<body>
				<Translations locale={locale} />
				<Suspense>
					<KeystaticApp />
				</Suspense>
			</body>
		</html>
	);
}
