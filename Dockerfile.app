FROM node:16-alpine AS builder
WORKDIR /cz3
COPY . .
RUN corepack enable
RUN yarn install
RUN yarn app:web-build

FROM nginx:stable-alpine AS runner
COPY --from=builder /cz3/app/web-build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
