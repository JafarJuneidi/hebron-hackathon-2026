# ---- Stage 1: Install all dependencies ----
FROM node:22-alpine AS deps
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Copy workspace config and package manifests (for layer caching)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY frontend/package.json frontend/
COPY backend/package.json backend/

# better-sqlite3 requires native build tools
RUN apk add --no-cache python3 make g++
RUN pnpm install --frozen-lockfile


# ---- Stage 2: Build frontend static assets ----
FROM deps AS frontend-build
COPY shared/ shared/
COPY frontend/ frontend/
ARG VITE_CLERK_PUBLISHABLE_KEY
ENV VITE_CLERK_PUBLISHABLE_KEY=$VITE_CLERK_PUBLISHABLE_KEY
RUN pnpm --filter frontend build


# ---- Stage 3: Serve frontend with nginx ----
FROM nginx:alpine AS frontend
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80


# ---- Stage 4: Backend production image ----
FROM deps AS backend
COPY shared/ shared/
COPY backend/ backend/
RUN mkdir -p backend/data
WORKDIR /app/backend
EXPOSE 3000
CMD ["pnpm", "exec", "tsx", "src/index.ts"]
