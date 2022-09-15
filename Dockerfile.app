FROM node:16-alpine AS builder
WORKDIR /cz3
COPY .yarn ./
COPY package.json ./
COPY **/package.json ./
COPY yarn.lock ./
COPY .yarnrc.yml ./
COPY .npmrc ./
RUN corepack enable
RUN yarn install
COPY . .
RUN yarn app:build

FROM nginx:stable-alpine AS runner
COPY --from=builder /cz3/app/web-build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
