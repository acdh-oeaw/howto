import "server-only";

import type { SearchParams } from "typesense/lib/Typesense/Documents";

import { schema } from "@/config/search.config";
import { createSearchClient } from "@/lib/search/create-search-client";

const client = createSearchClient();

interface GetSearchResultsParams extends SearchParams {}

export function getSearchResults(params: GetSearchResultsParams) {
	return client.collections(schema.name).documents().search(params);
}
