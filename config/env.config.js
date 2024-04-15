import { log } from "@acdh-oeaw/lib";
import { createEnv } from "@acdh-oeaw/validate-env";
import * as v from "valibot";

export const env = createEnv({
	prefix: "NEXT_PUBLIC_",
	shared(input) {
		const Schema = v.object({
			NODE_ENV: v.optional(v.picklist(["development", "production", "test"]), "production"),
		});
		return v.parse(Schema, input);
	},
	server(input) {
		const Schema = v.object({
			BUILD_MODE: v.optional(v.picklist(["export", "standalone"])),
			BUNDLE_ANALYZER: v.optional(v.picklist(["disabled", "enabled"])),
			ENV_VALIDATION: v.optional(v.picklist(["disabled", "enabled"])),
			KEYSTATIC_GITHUB_CLIENT_ID: v.optional(v.string([v.minLength(1)])),
			KEYSTATIC_GITHUB_CLIENT_SECRET: v.optional(v.string([v.minLength(1)])),
			KEYSTATIC_SECRET: v.optional(v.string([v.minLength(1)])),
			TYPESENSE_ADMIN_API_KEY: v.optional(v.string([v.minLength(1)])),
		});
		return v.parse(Schema, input);
	},
	client(input) {
		const Schema = v.object({
			NEXT_PUBLIC_APP_BASE_URL: v.string([v.url()]),
			NEXT_PUBLIC_BOTS: v.optional(v.picklist(["disabled", "enabled"])),
			NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: v.optional(v.string()),
			NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG: v.optional(v.string([v.minLength(1)])),
			NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME: v.optional(v.string([v.minLength(1)])),
			NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER: v.optional(v.string([v.minLength(1)])),
			NEXT_PUBLIC_KEYSTATIC_MODE: v.optional(v.picklist(["github", "local"]), "local"),
			NEXT_PUBLIC_MATOMO_BASE_URL: v.optional(v.string([v.url()])),
			NEXT_PUBLIC_MATOMO_ID: v.optional(v.coerce(v.number([v.integer(), v.minValue(1)]), Number)),
			NEXT_PUBLIC_REDMINE_ID: v.coerce(v.number([v.integer(), v.minValue(1)]), Number),
			NEXT_PUBLIC_TYPESENSE_API_KEY: v.optional(v.string([v.minLength(1)])),
			NEXT_PUBLIC_TYPESENSE_HOST: v.optional(v.string([v.minLength(1)])),
			NEXT_PUBLIC_TYPESENSE_PORT: v.optional(
				v.coerce(v.number([v.integer(), v.minValue(1)]), Number),
			),
			NEXT_PUBLIC_TYPESENSE_PROTOCOL: v.optional(v.string([v.minLength(1)])),
		});
		return v.parse(Schema, input);
	},

	environment: {
		BUILD_MODE: process.env.BUILD_MODE,
		BUNDLE_ANALYZER: process.env.BUNDLE_ANALYZER,
		ENV_VALIDATION: process.env.ENV_VALIDATION,
		KEYSTATIC_GITHUB_CLIENT_ID: process.env.KEYSTATIC_GITHUB_CLIENT_ID,
		KEYSTATIC_GITHUB_CLIENT_SECRET: process.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
		KEYSTATIC_SECRET: process.env.KEYSTATIC_SECRET,
		NODE_ENV: process.env.NODE_ENV,
		NEXT_PUBLIC_APP_BASE_URL: process.env.NEXT_PUBLIC_APP_BASE_URL,
		NEXT_PUBLIC_BOTS: process.env.NEXT_PUBLIC_BOTS,
		NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
		NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG: process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG,
		NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME: process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME,
		NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER: process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER,
		NEXT_PUBLIC_KEYSTATIC_MODE: process.env.NEXT_PUBLIC_KEYSTATIC_MODE,
		NEXT_PUBLIC_MATOMO_BASE_URL: process.env.NEXT_PUBLIC_MATOMO_BASE_URL,
		NEXT_PUBLIC_MATOMO_ID: process.env.NEXT_PUBLIC_MATOMO_ID,
		NEXT_PUBLIC_REDMINE_ID: process.env.NEXT_PUBLIC_REDMINE_ID,
		NEXT_PUBLIC_TYPESENSE_API_KEY: process.env.NEXT_PUBLIC_TYPESENSE_API_KEY,
		NEXT_PUBLIC_TYPESENSE_HOST: process.env.NEXT_PUBLIC_TYPESENSE_HOST,
		NEXT_PUBLIC_TYPESENSE_PORT: process.env.NEXT_PUBLIC_TYPESENSE_PORT,
		NEXT_PUBLIC_TYPESENSE_PROTOCOL: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL,
		TYPESENSE_ADMIN_API_KEY: process.env.TYPESENSE_ADMIN_API_KEY,
	},
	skip: process.env.ENV_VALIDATION === "disabled",
	onError(error) {
		if (error instanceof v.ValiError) {
			const message = "Invalid environment variables";

			log.error(`${message}:`, v.flatten(error).nested);

			const validationError = new Error(message);
			delete validationError.stack;

			throw validationError;
		}

		throw error;
	},
});
