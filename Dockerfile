FROM node:lts-buster

WORKDIR /usr/app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

ENTRYPOINT ["/usr/app/dist/cli.js"]
