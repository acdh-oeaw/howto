import { z } from "zod";

import { type Locale, locales } from "@/config/i18n.config";

export function createResourceFiltersSearchParamsSchema(locale: Locale) {
	return z.object({
		limit: z.coerce.number().int().positive().max(100).optional().default(20).catch(20),
		locale: z
			.enum([...locales, "all"])
			.optional()
			.default(locale)
			.catch(locale),
		page: z.coerce.number().int().positive().optional().default(1).catch(1),
		q: z.string().optional().default("").catch(""),
		tag: z.array(z.string()).optional().default([]).catch([]),
	});
}
