#https://hub.docker.com/_/node?tab=tags&page=1
FROM node:16.14.2-alpine3.15

WORKDIR /usr/src/app

COPY tsconfig.json .
COPY package*.json ./
COPY src ./src

RUN npm ci
RUN npm i -g pm2
RUN npm run build

CMD pm2-runtime dist/index.js
EXPOSE 3040
