FROM node:lts-buster

WORKDIR /usr/app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

CMD ["npm","start"]
