FROM node:20-alpine AS base

FROM base AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# If you have a build step (e.g. tsc), run it here. 
# Since we are using tsx for dev, for prod we might want to compile or just run with tsx/ts-node.
# For simplicity and speed in this demo, we'll use tsx in production too, or compile.
# Let's compile to JS for better performance/standard practice.
RUN npm install -D typescript
RUN npx tsc

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
# Copy .env if needed, but usually env vars are set in the platform (Coolify)
# COPY .env .env 

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/index.js"]
