# syntax=docker/dockerfile:1

# using alpine base image to avoid `sharp` memory leaks.
# @see https://sharp.pixelplumbing.com/install#linux-memory-allocator

# build
FROM node:20-alpine AS build

RUN corepack enable

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

USER node

COPY --chown=node:node .npmrc package.json pnpm-lock.yaml ./
RUN sed -i "s/use-node-version/# use-node-version/" .npmrc

RUN pnpm fetch

COPY --chown=node:node ./ ./
RUN sed -i "s/use-node-version/# use-node-version/" .npmrc

ARG NEXT_PUBLIC_APP_BASE_URL
ARG NEXT_PUBLIC_BOTS
ARG NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG
ARG NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_NAME
ARG NEXT_PUBLIC_KEYSTATIC_GITHUB_REPO_OWNER
ARG NEXT_PUBLIC_KEYSTATIC_MODE
ARG NEXT_PUBLIC_MATOMO_BASE_URL
ARG NEXT_PUBLIC_MATOMO_ID
ARG NEXT_PUBLIC_REDMINE_ID
ARG NEXT_PUBLIC_TYPESENSE_API_KEY
ARG NEXT_PUBLIC_TYPESENSE_HOST
ARG NEXT_PUBLIC_TYPESENSE_PORT
ARG NEXT_PUBLIC_TYPESENSE_PROTOCOL

RUN pnpm install --frozen-lockfile --offline

ENV BUILD_MODE=standalone
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN --mount=type=secret,id=KEYSTATIC_GITHUB_CLIENT_ID,uid=1000 \
		--mount=type=secret,id=KEYSTATIC_GITHUB_CLIENT_SECRET,uid=1000 \
		--mount=type=secret,id=KEYSTATIC_SECRET,uid=1000 \
			KEYSTATIC_GITHUB_CLIENT_ID=$(cat /run/secrets/KEYSTATIC_GITHUB_CLIENT_ID) \
			KEYSTATIC_GITHUB_CLIENT_SECRET=$(cat /run/secrets/KEYSTATIC_GITHUB_CLIENT_SECRET) \
			KEYSTATIC_SECRET=$(cat /run/secrets/KEYSTATIC_SECRET) \
		pnpm run build

# serve
FROM node:20-alpine AS serve

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

USER node

COPY --from=build --chown=node:node /app/next.config.js ./
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/content ./content

# Ensure folder is owned by node:node when mounted as volume.
RUN mkdir -p /app/.next/cache/images

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "server.js"]
