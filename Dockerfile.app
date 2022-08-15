# BASE

FROM --platform=linux/amd64 node:16-alpine AS base
WORKDIR /czapp
RUN apk add git


#BUILDER
FROM base AS builder
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
COPY .npmrc ./.npmrc
COPY *.json ./
COPY .yarnrc.yml ./
COPY .yarn/releases ./.yarn/releases
COPY yarn.lock ./
COPY api/*.json ./api/
COPY config/eslint/*.json ./config/eslint/
COPY packages/prisma ./packages/prisma
COPY packages/meta ./packages/meta
COPY packages/api-types ./packages/api-types
COPY app/expo/*.json ./app/expo/
COPY app/next/*.json ./app/next/
COPY app/app/*.json ./app/app/
COPY app/ui/*.json ./app/ui/
COPY app/config/*.json ./app/config/

RUN yarn install

COPY . .

RUN yarn app:next-build-prep
RUN yarn app:next-build

# RUNNNER

FROM base AS runner

ENV NODE_ENV production

WORKDIR /czapp

# MAIN
COPY --from=builder /czapp/.git ./.git
COPY --from=builder /czapp/yarn.lock ./
COPY --from=builder /czapp/node_modules ./node_modules
COPY --from=builder /czapp/package.json ./package.json
COPY --from=builder /czapp/turbo.json ./turbo.json

# APP
COPY --from=builder /czapp/app ./app

EXPOSE 3000

ENV PORT 3000

CMD ["yarn", "app:next-start"]
