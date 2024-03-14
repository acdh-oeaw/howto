import { useTranslations } from "next-intl";

import { MainContent } from "@/components/main-content";

export default function Loading() {
	const t = useTranslations("Loading");

	return (
		<MainContent className="container grid place-content-center py-4 xs:py-8">
			<div className="text-sm">{t("loading")}...</div>
		</MainContent>
	);
}
