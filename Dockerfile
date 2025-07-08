# Multi-stage build for combined frontend, backend, and nginx
FROM node:18-alpine AS base

# Install dependencies for both services and nginx
RUN apk add --no-cache wget supervisor nginx

# Create app directory
WORKDIR /app

# Copy package files for both services
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Install backend dependencies
WORKDIR /app/backend
RUN npm install

# Install frontend dependencies
WORKDIR /app/frontend
RUN npm install

# Copy backend source and build
WORKDIR /app/backend
COPY backend/ ./
RUN npx prisma generate

# Copy frontend source and build
WORKDIR /app/frontend
COPY frontend/ ./
ENV NEXT_PUBLIC_API_URL=/api
RUN npm run build

# Create production runtime
FROM node:18-alpine AS production

# Install supervisor and nginx for process management
RUN apk add --no-cache wget supervisor nginx

# Create supervisor log directory
RUN mkdir -p /var/log/supervisor /var/run/supervisor

# Create non-root user
RUN addgroup -g 1001 -S appgroup && adduser -S appuser -u 1001 -G appgroup

# Create app directory
WORKDIR /app

# Copy built applications
COPY --from=base /app/backend ./backend
COPY --from=base /app/backend/prisma ./backend/prisma
COPY --from=base /app/frontend/.next/standalone ./frontend
COPY --from=base /app/frontend/.next/static ./frontend/.next/static
COPY --from=base /app/frontend/public ./frontend/public

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy supervisor configuration
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Set proper permissions
RUN chown -R appuser:appgroup /app
RUN chown -R appuser:appgroup /var/log/supervisor /var/run/supervisor

# Set environment variables
ENV NODE_ENV=production
ENV DATABASE_URL=file:/app/backend/prisma/dev.db
ENV PORT=8080
ENV NEXT_PUBLIC_API_URL=/api

# Expose ports
EXPOSE 80 3000 8080

# Switch to non-root user
USER appuser

# Start supervisor to manage nginx, backend, and frontend
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"] 