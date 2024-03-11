import { createUrl } from "@acdh-oeaw/lib";

import { env } from "@/config/env.config";
import { locales } from "@/config/i18n.config";
import { expect, test } from "@/e2e/lib/test";

test.describe("i18n", () => {
	test.describe("should redirect root route to preferred locale", () => {
		test.use({ locale: "en" });

		test("with default locale", async ({ page }) => {
			await page.goto("/");
			await expect(page).toHaveURL("/en");
		});
	});

	test.describe("should redirect root route to preferred locale", () => {
		test.use({ locale: "de" });

		test("with supported locale", async ({ page }) => {
			await page.goto("/");
			await expect(page).toHaveURL("/de");
		});
	});

	test.describe("should redirect root route to preferred locale", () => {
		test.use({ locale: "fr" });

		test("with unsupported locale", async ({ page }) => {
			await page.goto("/");
			await expect(page).toHaveURL("/en");
		});
	});

	test("should display not-found page for unknown locale", async ({ page }) => {
		const response = await page.goto("/unknown");
		expect(response?.status()).toBe(404);
		await expect(page.getByRole("heading", { name: "Page not found" })).toBeVisible();
	});

	test("should display localised not-found page for unknown pathname", async ({ page }) => {
		const response = await page.goto("/de/unknown");
		/**
		 * When streaming a response, because the root layout has a suspense boundary
		 * or a `loading.tsx`, the response status code will always be 200.
		 *
		 * @see https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming#status-codes
		 * @see https://nextjs.org/docs/app/api-reference/file-conventions/not-found
		 *
		 * This should not be an issue for seo, but to avoid this anyway you can move `loading.tsx`
		 * one level down (and add a `layout.tsx` which just passes children through):
		 *
		 * - [locale]
		 *   - layout.tsx
		 *   - not-found.tsx
		 *   - [...404]
		 *     - page.tsx
		 *   - (index)
		 *     - layout.tsx (pass-through)
		 *     - loading.tsx
		 *     - page.tsx
		 */
		expect(response?.status()).toBe(200);
		// expect(response?.status()).toBe(404);
		await expect(page.getByRole("heading", { name: "Seite nicht gefunden" })).toBeVisible();
	});

	test("should support switching locale", async ({ page }) => {
		// @ts-expect-error Single locale could be configured.
		// eslint-disable-next-line playwright/no-skipped-test, @typescript-eslint/no-unnecessary-condition
		test.skip(locales.length === 1, "Only single locale configured.");

		await page.goto("/de/imprint");
		await expect(page).toHaveURL("/de/imprint");
		await expect(page.getByRole("heading", { name: "Impressum" })).toBeVisible();
		await expect(page).toHaveTitle("Impressum | ACDH-CH Howto");

		await page.getByRole("link", { name: "Zu Englisch wechseln" }).click();

		await expect(page).toHaveURL("/en/imprint");
		await expect(page.getByRole("heading", { name: "Imprint" })).toBeVisible();
		await expect(page).toHaveTitle("Imprint | ACDH-CH Howto");
	});

	test("should set `lang` attribute on `html` element", async ({ page }) => {
		for (const locale of locales) {
			await page.goto(`/${locale}`);
			await expect(page.locator("html")).toHaveAttribute("lang", locale);
		}
	});

	test("should set alternate links in response header", async ({ page }) => {
		function createAbsoluteUrl(pathname: string) {
			return String(createUrl({ baseUrl: env.NEXT_PUBLIC_APP_BASE_URL, pathname }));
		}

		// TODO: toMatchSnapshot
		for (const locale of locales) {
			const response = await page.goto(`/${locale}`);
			expect(response?.headers().link?.split(", ")).toEqual([
				`<${createAbsoluteUrl("/de")}>; rel="alternate"; hreflang="de"`,
				`<${createAbsoluteUrl("/en")}>; rel="alternate"; hreflang="en"`,
				`<${createAbsoluteUrl("/")}>; rel="alternate"; hreflang="x-default"`,
			]);
		}

		// TODO: toMatchSnapshot
		for (const locale of locales) {
			const response = await page.goto(`/${locale}/imprint`);
			expect(response?.headers().link?.split(", ")).toEqual([
				`<${createAbsoluteUrl("/de/imprint")}>; rel="alternate"; hreflang="de"`,
				`<${createAbsoluteUrl("/en/imprint")}>; rel="alternate"; hreflang="en"`,
			]);
		}
	});
});
