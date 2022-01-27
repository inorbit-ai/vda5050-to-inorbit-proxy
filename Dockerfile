# Docker container to run vda5050-to-inorbit-proxy
FROM node:12.16.1-alpine3.11

WORKDIR /app

COPY package*.json ./
COPY .babelrc .

RUN npm install

COPY src src

CMD ["npm", "start"]
