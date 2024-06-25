import { assert } from "@acdh-oeaw/lib";
import { Client } from "typesense";

import { env } from "@/config/env.config";

export function createSearchClient(apiKey = env.NEXT_PUBLIC_TYPESENSE_API_KEY) {
	const host = env.NEXT_PUBLIC_TYPESENSE_HOST;
	const port = env.NEXT_PUBLIC_TYPESENSE_PORT;
	const protocol = env.NEXT_PUBLIC_TYPESENSE_PROTOCOL;

	assert(apiKey, "Invalid search client configuration.");
	assert(host, "Invalid search client configuration.");
	assert(port, "Invalid search client configuration.");
	assert(protocol, "Invalid search client configuration.");

	const client = new Client({
		apiKey,
		nodes: [{ host, port, protocol }],
	});

	return client;
}
