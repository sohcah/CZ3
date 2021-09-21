FROM node:16-alpine

WORKDIR /usr/src/CuppaZeeAPI

COPY package*.json ./

RUN yarn install --prod

COPY lib lib

EXPOSE 80
CMD [ "node", "lib/server.js" ]

