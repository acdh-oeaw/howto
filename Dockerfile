# syntax=docker/dockerfile:1

# build
# we don't use node:18-slim because we need `git` to get the last updated timestamps
FROM node:18 AS build

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

USER node

COPY --chown=node:node package.json yarn.lock ./
COPY --chown=node:node next.config.mjs tsconfig.json app-env.d.ts env.d.ts next-env.d.ts tailwind.config.cjs ./
COPY --chown=node:node scripts ./scripts
COPY --chown=node:node config ./config
COPY --chown=node:node public ./public
COPY --chown=node:node src ./src
COPY --chown=node:node content ./content
# currently the .git folder is used to retrieve last-updated timestamps
COPY --chown=node:node .git ./.git

RUN yarn install --frozen-lockfile --silent --no-audit --no-fund

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_GIT_REPO
ARG NEXT_PUBLIC_GIT_BRANCH
ARG NEXT_PUBLIC_MATOMO_BASE_URL
ARG NEXT_PUBLIC_MATOMO_ID
ARG NEXT_PUBLIC_ALGOLIA_APP_ID
ARG NEXT_PUBLIC_ALGOLIA_API_KEY
ARG NEXT_PUBLIC_ALGOLIA_INDEX_NAME

RUN yarn run build

# docker buildkit currently cannot mount secrets directly to env vars
# @see https://github.com/moby/buildkit/issues/2122
USER root
RUN --mount=type=secret,id=ALGOLIA_ADMIN_API_KEY \
  export ALGOLIA_ADMIN_API_KEY="$(cat /run/secrets/ALGOLIA_ADMIN_API_KEY)" && \
  yarn run create:search-index && \
  unset ALGOLIA_ADMIN_API_KEY
USER node

# serve
FROM node:18-slim AS serve

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

USER node

COPY --from=build --chown=node:node /app/next.config.mjs ./
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static

# Ensure folder is owned by node:node when mounted as volume.
RUN mkdir -p /app/.next/cache/images

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "server.js"]
