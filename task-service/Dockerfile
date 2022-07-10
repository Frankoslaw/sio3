FROM node:18-alpine

RUN npm i -g pnpm typescript

COPY ./pnpm-lock.yaml ./
COPY package*.json ./

RUN pnpm i

COPY . .

RUN tsc

EXPOSE 3000

ENTRYPOINT [ "pnpm", "start" ]