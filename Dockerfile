FROM node:lts-slim AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM node:23-slim

WORKDIR /app
COPY --from=build /app/build ./build

EXPOSE 3000
CMD ["node", "build/index.js"]