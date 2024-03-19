import { isNonEmptyString } from "@acdh-oeaw/lib";
import { makeRouteHandler } from "@keystatic/next/route-handler";

import config from "@/keystatic.config";

const { GET: _GET, POST: _POST } = makeRouteHandler({ config });

/**
 * @see https://github.com/Thinkmill/keystatic/issues/978#issuecomment-2005730530
 * @see https://github.com/Thinkmill/keystatic/issues/1022
 */
function rewriteUrl(request: Request) {
	const forwardedHost = request.headers.get("x-forwarded-host");
	const forwardedProto = request.headers.get("x-forwarded-proto");

	if (isNonEmptyString(forwardedHost) && isNonEmptyString(forwardedProto)) {
		const url = new URL(request.url);

		url.hostname = forwardedHost;
		url.protocol = forwardedProto;

		return new Request(url, request);
	}

	return request;
}

export function GET(request: Request) {
	return _GET(rewriteUrl(request));
}

export function POST(request: Request) {
	return _POST(rewriteUrl(request));
}
