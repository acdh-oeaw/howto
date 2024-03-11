import { cookies, draftMode } from "next/headers";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

export function DraftModeToggle(): ReactNode {
	const { isEnabled } = draftMode();

	if (!isEnabled) return null;

	const branch = cookies().get("ks-branch")?.value;

	return (
		<div className="mb-8 flex w-full items-center justify-between gap-x-8 rounded-md bg-notice-400 px-3 py-1.5 text-sm font-medium text-notice-50 dark:bg-notice-600 dark:text-notice-950">
			<span>Draft mode{branch != null ? ` (${branch})` : null}</span>
			<form action="/api/preview/end" method="POST">
				<Button type="submit">End preview</Button>
			</form>
		</div>
	);
}
