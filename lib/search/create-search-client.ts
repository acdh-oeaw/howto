import { Client } from "typesense";

import { env } from "@/config/env.config";

export function createSearchClient() {
	const client = new Client({
		nodes: [
			{
				host: env.NEXT_PUBLIC_TYPESENSE_HOST,
				port: env.NEXT_PUBLIC_TYPESENSE_PORT,
				protocol: env.NEXT_PUBLIC_TYPESENSE_PROTOCOL,
			},
		],
		apiKey: env.TYPESENSE_ADMIN_API_KEY,
	});

	return client;
}
