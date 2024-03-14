import { Client } from "typesense";

import { env } from "@/config/env.config";

export function createSearchClient(apiKey = env.NEXT_PUBLIC_TYPESENSE_API_KEY) {
	const client = new Client({
		nodes: [
			{
				host: env.NEXT_PUBLIC_TYPESENSE_HOST,
				port: env.NEXT_PUBLIC_TYPESENSE_PORT,
				protocol: env.NEXT_PUBLIC_TYPESENSE_PROTOCOL,
			},
		],
		apiKey,
	});

	return client;
}
