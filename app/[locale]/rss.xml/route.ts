import type { Locale } from "@/config/i18n.config";
import { createFeed } from "@/lib/create-feed";

export const dynamicParams = false;

interface Context {
	params: {
		locale: Locale;
	};
}

export async function GET(request: Request, context: Context): Promise<Response> {
	const { locale } = context.params;

	const feed = await createFeed(locale);

	return new Response(feed, { headers: { "content-type": "application/xml" } });
}
