import * as v from "valibot";

import { type Locale, locales } from "@/config/i18n.config";

export function createResourceFiltersSearchParamsSchema(locale: Locale) {
	return v.object({
		limit: v.fallback(
			v.optional(v.coerce(v.number([v.integer(), v.minValue(1), v.maxValue(100)]), Number), 20),
			20,
		),
		locale: v.fallback(v.optional(v.picklist([...locales, "all"]), locale), locale),
		page: v.fallback(v.optional(v.coerce(v.number([v.integer(), v.minValue(1)]), Number), 1), 1),
		q: v.fallback(v.optional(v.string(), ""), ""),
		tag: v.fallback(v.optional(v.array(v.string()), []), []),
	});
}
