# base
FROM node:14-slim AS base

RUN mkdir /app && chown -R node:node /app
WORKDIR /app

USER node

COPY --chown=node:node package.json yarn.lock ./

RUN yarn install --frozen-lockfile --silent --production && yarn cache clean

# build
FROM base AS build

RUN yarn install --frozen-lockfile --silent

COPY --chown=node:node tsconfig.json next-env.d.ts next.config.js ./
COPY --chown=node:node scripts ./scripts
COPY --chown=node:node config ./config
COPY --chown=node:node tailwind.config.js ./
COPY --chown=node:node public ./public
COPY --chown=node:node src ./src
COPY --chown=node:node content ./content
# currently the .git folder is used to retrieve last-updated timestamps
COPY --chown=node:node .git ./.git

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_GIT_REPO
ARG NEXT_PUBLIC_GIT_BRANCH
ARG NEXT_PUBLIC_MATOMO_BASE_URL
ARG NEXT_PUBLIC_MATOMO_ID

RUN yarn build

# serve
FROM base AS serve

COPY --from=build --chown=node:node /app/next.config.js ./
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/.next ./.next

# Ensures folder is owned by node:node when mounted as volume.
RUN mkdir -p /app/.next/cache/images

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "node_modules/.bin/next", "start"]
