FROM node:20-alpine AS base
WORKDIR /app
RUN npm install -g pnpm@8

# ---- Dependencies ----
FROM base AS deps
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/core/package.json ./packages/core/
COPY packages/sdk/package.json ./packages/sdk/
COPY packages/cli/package.json ./packages/cli/
RUN pnpm install --frozen-lockfile --prod

# ---- Builder ----
FROM base AS builder
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml turbo.json tsconfig.json ./
COPY packages/ ./packages/
RUN pnpm install --frozen-lockfile
RUN pnpm build

# ---- Runner ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 synthocore && \
    adduser --system --uid 1001 synthocore

COPY --from=builder --chown=synthocore:synthocore /app/packages/core/dist ./packages/core/dist
COPY --from=builder --chown=synthocore:synthocore /app/packages/sdk/dist ./packages/sdk/dist
COPY --from=deps --chown=synthocore:synthocore /app/node_modules ./node_modules
COPY --from=deps --chown=synthocore:synthocore /app/packages/core/node_modules ./packages/core/node_modules

USER synthocore

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:3000/v1/agent/status || exit 1

CMD ["node", "packages/core/dist/index.js"]
