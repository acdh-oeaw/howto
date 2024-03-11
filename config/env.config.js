import { log } from "@acdh-oeaw/lib";
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	shared: {
		NODE_ENV: z.enum(["development", "production", "test"]).default("production"),
	},
	server: {
		BUILD_MODE: z.enum(["export", "standalone"]).optional(),
		BUNDLE_ANALYZER: z.enum(["disabled", "enabled"]).optional(),
		ENV_VALIDATION: z.enum(["disabled", "enabled"]).optional(),
		KEYSTATIC_GITHUB_CLIENT_ID: z.string().min(1).optional(),
		KEYSTATIC_GITHUB_CLIENT_SECRET: z.string().min(1).optional(),
		KEYSTATIC_SECRET: z.string().min(1).optional(),
		TYPESENSE_ADMIN_API_KEY: z.string().min(1),
	},
	client: {
		NEXT_PUBLIC_APP_BASE_URL: z.string().url(),
		NEXT_PUBLIC_BOTS: z.enum(["disabled", "enabled"]).optional(),
		NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION: z.string().optional(),
		NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG: z.string().min(1).optional(),
		NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME: z.string().min(1).optional(),
		NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER: z.string().min(1).optional(),
		NEXT_PUBLIC_KEYSTATIC_MODE: z.enum(["github", "local"]).default("local"),
		NEXT_PUBLIC_MATOMO_BASE_URL: z.string().url().optional(),
		NEXT_PUBLIC_MATOMO_ID: z.coerce.number().int().positive().optional(),
		NEXT_PUBLIC_REDMINE_ID: z.coerce.number().int().positive(),
		NEXT_PUBLIC_TYPESENSE_API_KEY: z.string().min(1),
		NEXT_PUBLIC_TYPESENSE_HOST: z.string().min(1),
		NEXT_PUBLIC_TYPESENSE_PORT: z.coerce.number().int().positive(),
		NEXT_PUBLIC_TYPESENSE_PROTOCOL: z.string().min(1),
	},
	runtimeEnv: {
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
	skipValidation: process.env.ENV_VALIDATION === "disabled",
	onValidationError(validationError) {
		const message = "Invalid environment variables";
		log.error(`${message}:`, validationError.flatten().fieldErrors);
		const error = new Error(message);
		delete error.stack;
		throw error;
	},
});
