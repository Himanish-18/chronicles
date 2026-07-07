# ══════════════════════════════════════════════
# Stage 1 — Build
# ══════════════════════════════════════════════
FROM node:22-alpine AS build

WORKDIR /app

# Copy dependency manifests first (layer caching)
COPY package.json package-lock.json ./

# Install dependencies reproducibly
RUN npm ci

# Copy application source
COPY . .

# Accept Firebase build-time variables as build args
ARG VITE_API_URL=/api
ARG VITE_FIREBASE_API_KEY
ARG VITE_FIREBASE_AUTH_DOMAIN
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_STORAGE_BUCKET
ARG VITE_FIREBASE_MESSAGING_SENDER_ID
ARG VITE_FIREBASE_APP_ID

# Build the production bundle
RUN npm run build

# ══════════════════════════════════════════════
# Stage 2 — Runtime (Nginx)
# ══════════════════════════════════════════════
FROM nginx:1.27-alpine AS runtime

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy compiled static assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
