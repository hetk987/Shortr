# Multi-stage build for combined frontend and backend
FROM node:18-alpine AS base

# Install dependencies for both services
RUN apk add --no-cache wget supervisor

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
RUN npm run build

# Create production runtime
FROM node:18-alpine AS production

# Install supervisor for process management
RUN apk add --no-cache wget supervisor

# Create non-root user
RUN addgroup -g 1001 -S appgroup && adduser -S appuser -u 1001 -G appgroup

# Create app directory
WORKDIR /app

# Copy built applications
COPY --from=base /app/backend ./backend
COPY --from=base /app/frontend/.next ./frontend/.next
COPY --from=base /app/frontend/public ./frontend/public
COPY --from=base /app/frontend/package*.json ./frontend/

# Copy supervisor configuration
COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Set proper permissions
RUN chown -R appuser:appgroup /app

# Set environment variables
ENV NODE_ENV=production
ENV DATABASE_URL=file:/app/backend/prisma/dev.db
ENV PORT=80
ENV NEXT_PUBLIC_API_URL=http://localhost:80

# Expose ports
EXPOSE 80 3000

# Switch to non-root user
USER appuser

# Start supervisor to manage both services
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"] 