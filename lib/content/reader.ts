import "server-only";

import { createReader } from "@keystatic/core/reader";
import { createGitHubReader } from "@keystatic/core/reader/github";
import { cookies, draftMode } from "next/headers";
import { cache } from "react";

import { env } from "@/config/env.config";
import config from "@/keystatic.config";

export const reader = cache(() => {
	if (isDraftModeEnabled()) {
		const branch = cookies().get("ks-branch")?.value;

		if (branch) {
			return createGitHubReader(config, {
				repo: `${env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER}/${env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME}`,
				ref: branch,
				token: cookies().get("keystatic-gh-access-token")?.value,
			});
		}
	}

	return createReader(process.cwd(), config);
});

function isDraftModeEnabled(): boolean {
	try {
		return draftMode().isEnabled;
	} catch {
		return false;
	}
}
