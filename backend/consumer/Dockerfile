FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json tsconfig.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist

# Entrypoint script will wait for required services, run seed and start the server
ENTRYPOINT ["node", "dist/scripts/wait-and-seed.js"]

