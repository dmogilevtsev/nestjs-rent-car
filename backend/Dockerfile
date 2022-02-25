FROM node:14-alpine AS builder
WORKDIR /app
COPY /*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:14-alpine
WORKDIR /app
COPY --from=builder /app ./
EXPOSE ${API_PORT}
CMD ["db-migrate", "up", "&&", "npm", "run", "start:prod"]