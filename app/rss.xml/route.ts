import { createFeed } from "@/lib/create-feed";

export async function GET(): Promise<Response> {
	const feed = await createFeed("en");

	return new Response(feed, { headers: { "content-type": "application/xml" } });
}
