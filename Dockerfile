# syntax=docker/dockerfile:1

FROM node:22.12.0-alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

# Copy everything (including schema, .env, etc.)
COPY . .

# Install only production dependencies
RUN npm ci --omit=dev

# Generate Prisma client (after schema is in place)
RUN npx prisma generate

# Expose the port
EXPOSE 80

# Run as non-root user
USER node

# Start the app
CMD ["npm", "start"]
