# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (Docker layer caching)
COPY package.json package-lock.json* ./

# Install all deps (dev deps needed for vite/tailwind/postcss build)
# Using npm install instead of npm ci — tolerant of lock file drift
RUN npm install --legacy-peer-deps --ignore-scripts

# Copy everything else (.dockerignore excludes node_modules, tests, etc.)
COPY . .

# Build production bundle
RUN npm run build

# ── Stage 2: Serve with nginx ────────────────────────────────────────────────
FROM nginx:1.27-alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets only — no source code in production
COPY --from=builder /app/dist /usr/share/nginx/html

# Cloud Run uses PORT env var; nginx listens on 8080
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
