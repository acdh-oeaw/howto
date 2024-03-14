import { createUrl } from "@acdh-oeaw/lib";

import { env } from "@/config/env.config";
import { expect, test } from "@/e2e/lib/test";

test.describe("analytics service", () => {
	test("should track page views", async ({ page }) => {
		// eslint-disable-next-line playwright/no-skipped-test
		test.skip(
			env.NEXT_PUBLIC_MATOMO_BASE_URL == null || env.NEXT_PUBLIC_MATOMO_ID == null,
			"Analytics service disabled.",
		);

		const baseUrl = String(
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			createUrl({ baseUrl: env.NEXT_PUBLIC_MATOMO_BASE_URL!, pathname: "/**" }),
		);

		const initialResponsePromise = page.waitForResponse(baseUrl);
		await page.goto("/en");
		const initialResponse = await initialResponsePromise;
		expect(initialResponse.status()).toBe(204);

		const responsePromise = page.waitForResponse(baseUrl);
		await page.getByRole("link", { name: "Imprint" }).click();
		const response = await responsePromise;
		expect(response.status()).toBe(204);
	});
});
