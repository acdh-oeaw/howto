import { assert } from "@acdh-oeaw/lib";
import { Client } from "typesense";

import { env } from "@/config/env.config";

export function createSearchClient(apiKey = env.NEXT_PUBLIC_TYPESENSE_API_KEY) {
	const host = env.NEXT_PUBLIC_TYPESENSE_HOST;
	const port = env.NEXT_PUBLIC_TYPESENSE_PORT;
	const protocol = env.NEXT_PUBLIC_TYPESENSE_PROTOCOL;

	assert(apiKey, "Invalid typesense config.");
	assert(host, "Invalid typesense config.");
	assert(port, "Invalid typesense config.");
	assert(protocol, "Invalid typesense config.");

	const client = new Client({
		nodes: [{ host, port, protocol }],
		apiKey,
	});

	return client;
}
