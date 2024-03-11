"use client";

import { useTranslations } from "next-intl";
import { type ReactNode, useEffect } from "react";

import { MainContent } from "@/components/main-content";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/ui/page-title";

interface InternalErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

/** `React.lazy` requires default export. */
// eslint-disable-next-line import/no-default-export
export default function InternalError(props: InternalErrorProps): ReactNode {
	const { error, reset } = props;

	const t = useTranslations("Error");

	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<MainContent className="container grid place-content-center place-items-center gap-y-8 py-4 xs:py-8">
			<PageTitle>{t("something-went-wrong")}</PageTitle>

			<Button
				onPress={() => {
					reset();
				}}
			>
				{t("try-again")}
			</Button>
		</MainContent>
	);
}
