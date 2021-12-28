FROM node:16 AS build

WORKDIR /usr/src/CuppaZeeAPI

COPY package*.json ./

RUN npm install

COPY src/ src/
COPY tsconfig.json ./
COPY prisma/ prisma/

RUN ./node_modules/prisma/build/index.js generate

RUN ./node_modules/typescript/bin/tsc


FROM node:16-alpine

WORKDIR /usr/src/CuppaZeeAPI

COPY --from=build /usr/src/CuppaZeeAPI/package.json ./

RUN yarn install --prod

COPY --from=build /usr/src/CuppaZeeAPI/lib/ lib/
COPY --from=build /usr/src/CuppaZeeAPI/prisma/schema.prisma prisma/schema.prisma

RUN ./node_modules/prisma/build/index.js generate

EXPOSE 80
CMD [ "node", "lib/server.js", "--enable-source-maps" ]
