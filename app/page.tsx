import { redirect } from "next/navigation";

import { defaultLocale } from "@/config/i18n.config";

/**
 * This page only renders when the app is built statically with `output: "export"`.
 */
export default function RootPage(): void {
	redirect(`/${defaultLocale}`);
}
