import type { Metadata } from "next";
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
			<head>
				<Translations locale={locale} />
			</head>
			<body>
				<KeystaticApp />
			</body>
		</html>
	);
}
