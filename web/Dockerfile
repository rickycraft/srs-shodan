# Install dependencies only when needed
FROM node:20-slim AS builder
WORKDIR /app

# Install dependencies based on the preferred package manager
RUN corepack enable \
  && corepack prepare pnpm@latest-8 --activate \
  && pnpm config set store-dir .pnpm-store
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,target=/app/.pnpm-store,id=pnpm_cache pnpm install --frozen-lockfile

# Copy all files
COPY . .
RUN --mount=type=cache,target=/app/.next/cache,id=next_cache pnpm build

# Production image, copy all the files and run next
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV production
ENV TZ Europe/Rome

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 80
ENV PORT 80
CMD ["node", "server.js"]
