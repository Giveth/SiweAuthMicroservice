#https://hub.docker.com/_/node?tab=tags&page=1
FROM node:16.14.2-alpine3.15

WORKDIR /usr/src/app

COPY tsconfig.json .
COPY tsoa.json .
COPY package*.json ./
COPY src ./src
COPY test ./test

RUN npm ci
RUN npm i -g pm2
RUN npm run build #It will run prebuild script for generating swagger spec by tsoa as well

CMD pm2-runtime dist/index.js
EXPOSE 3040
