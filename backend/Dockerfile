# ══════════════════════════════════════════════
# Stage 1 — Build
# ══════════════════════════════════════════════
FROM node:22-alpine AS build

WORKDIR /app

# Copy dependency manifests first (layer caching)
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies for build)
RUN npm ci

# Copy Prisma schema and config for client generation
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Generate Prisma Client
RUN npx prisma generate

# Copy application source
COPY src ./src/
COPY tsconfig.json ./

# Compile TypeScript
RUN npm run build

# ══════════════════════════════════════════════
# Stage 2 — Runtime
# ══════════════════════════════════════════════
FROM node:22-alpine AS runtime

# Install dumb-init for proper signal handling (PID 1)
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy dependency manifests
COPY package.json package-lock.json ./

# Install production dependencies only
RUN npm ci --omit=dev

# Copy Prisma schema, migrations, seed, and config (needed for migrate deploy + seed)
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Copy generated Prisma Client from build stage
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma

# Copy compiled JavaScript from build stage
COPY --from=build /app/dist ./dist/

# Copy entrypoint script
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Use non-root user (node user provided by node:alpine)
USER node

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/health || exit 1

# Use dumb-init to handle SIGTERM properly
CMD ["dumb-init", "node", "dist/server.js"]
