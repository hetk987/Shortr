# syntax=docker/dockerfile:1

# 🛠 Stage 1: Build
FROM node:22.12.0-alpine AS builder

WORKDIR /app

# Only install prod dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy only schema, generate client early
COPY prisma ./prisma/
RUN npx prisma generate

# Copy the rest
COPY . .

# 🧼 Stage 2: Run (clean + tiny)
FROM node:22.12.0-alpine AS runner

# Create non-root user
RUN addgroup -g 1001 -S appgroup && adduser -S appuser -u 1001 -G appgroup

WORKDIR /app

COPY --from=builder /app /app

ENV NODE_ENV=production

EXPOSE 80

USER appuser

CMD ["node", "src/index.js"]
