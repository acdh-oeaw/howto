import { createUrl } from "@acdh-oeaw/lib";

import { env } from "@/config/env.config";
import { locales } from "@/config/i18n.config";
import { expect, test } from "@/e2e/lib/test";

test("should set a canonical url", async ({ page }) => {
	for (const locale of locales) {
		await page.goto(`/${locale}`);

		const canonicalUrl = page.locator('link[rel="canonical"]');
		await expect(canonicalUrl).toHaveAttribute(
			"href",
			String(createUrl({ baseUrl: env.NEXT_PUBLIC_APP_BASE_URL, pathname: `/${locale}` })),
		);
	}
});

/** FIXME: @see https://github.com/vercel/next.js/issues/45620 */
test.fixme("should set document title on not-found page", async ({ page }) => {
	await page.goto("/unknown");
	await expect(page).toHaveTitle("Page not found | ACDH-CH Howto");

	await page.goto("/de/unknown");
	await expect(page).toHaveTitle("Seite nicht gefunden | ACDH-CH Howto");
});

/** FIXME: @see https://github.com/vercel/next.js/issues/45620 */
test.fixme("should disallow indexing of not-found page", async ({ page }) => {
	for (const pathname of ["/unknown", "/de/unknown"]) {
		await page.goto(pathname);

		const ogTitle = page.locator('meta[name="robots"]');
		await expect(ogTitle).toHaveAttribute("content", "noindex");
	}
});

test.describe("should set page metadata", () => {
	test("static", async ({ page }) => {
		await page.goto("/en");

		const ogType = page.locator('meta[property="og:type"]');
		await expect(ogType).toHaveAttribute("content", "website");

		const twCard = page.locator('meta[name="twitter:card"]');
		await expect(twCard).toHaveAttribute("content", "summary_large_image");

		const twCreator = page.locator('meta[name="twitter:creator"]');
		await expect(twCreator).toHaveAttribute("content", "@acdh_oeaw");

		const twSite = page.locator('meta[name="twitter:site"]');
		await expect(twSite).toHaveAttribute("content", "@acdh_oeaw");

		// const googleSiteVerification = page.locator('meta[name="google-site-verification"]');
		// await expect(googleSiteVerification).toHaveAttribute("content", "");
	});

	test("with en locale", async ({ page }) => {
		await page.goto("/en");

		await expect(page).toHaveTitle("ACDH-CH Howto");

		const metaDescription = page.locator('meta[name="description"]');
		await expect(metaDescription).toHaveAttribute(
			"content",
			"Digital Humanities learning materials",
		);

		const ogTitle = page.locator('meta[property="og:title"]');
		await expect(ogTitle).toHaveAttribute("content", "ACDH-CH Howto");

		const ogDescription = page.locator('meta[property="og:description"]');
		await expect(ogDescription).toHaveAttribute("content", "Digital Humanities learning materials");

		const ogUrl = page.locator('meta[property="og:url"]');
		await expect(ogUrl).toHaveAttribute(
			"content",
			String(createUrl({ baseUrl: env.NEXT_PUBLIC_APP_BASE_URL, pathname: "/en" })),
		);

		const ogLocale = page.locator('meta[property="og:locale"]');
		await expect(ogLocale).toHaveAttribute("content", "en");
	});

	test("with de locale", async ({ page }) => {
		await page.goto("/de");

		await expect(page).toHaveTitle("ACDH-CH Howto");

		const metaDescription = page.locator('meta[name="description"]');
		await expect(metaDescription).toHaveAttribute("content", "Digital Humanities Lernmaterialien");

		const ogTitle = page.locator('meta[property="og:title"]');
		await expect(ogTitle).toHaveAttribute("content", "ACDH-CH Howto");

		const ogDescription = page.locator('meta[property="og:description"]');
		await expect(ogDescription).toHaveAttribute("content", "Digital Humanities Lernmaterialien");

		const ogUrl = page.locator('meta[property="og:url"]');
		await expect(ogUrl).toHaveAttribute(
			"content",
			String(createUrl({ baseUrl: env.NEXT_PUBLIC_APP_BASE_URL, pathname: "/de" })),
		);

		const ogLocale = page.locator('meta[property="og:locale"]');
		await expect(ogLocale).toHaveAttribute("content", "de");
	});
});

test.describe("should add json+ld metadata", () => {
	test("with en locale", async ({ page }) => {
		await page.goto("/en");

		const metadata = page.locator('script[type="application/ld+json"]');
		await expect(metadata).toHaveText(
			JSON.stringify({
				"@context": "https://schema.org",
				"@type": "WebSite",
				name: "ACDH-CH Howto",
				description: "Digital Humanities learning materials",
			}),
		);
	});

	test("with de locale", async ({ page }) => {
		await page.goto("/de");

		const metadata = page.locator('script[type="application/ld+json"]');
		await expect(metadata).toHaveText(
			JSON.stringify({
				"@context": "https://schema.org",
				"@type": "WebSite",
				name: "ACDH-CH Howto",
				description: "Digital Humanities Lernmaterialien",
			}),
		);
	});
});

test("should serve an open-graph image", async ({ request }) => {
	for (const locale of locales) {
		const response = await request.get(`/${locale}/opengraph-image.png`);
		const status = response.status();

		expect(status).toEqual(200);
	}
});
