#################################################################################
# Actual application to run
#################################################################################

# Production image, copy all the files and run next
FROM node:16-alpine AS production
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY ./public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --chown=nextjs:nodejs ./.next/standalone ./

# Had to change the dest dir to ./dist/.next/static since
# it's there where the server looks for the files
COPY --chown=nextjs:nodejs ./.next/static ./dist/.next/static

# For some reason the nextjs server build files
# are placed in apps/fishing-map inside the standalone folder
# so we need to include them too
COPY --chown=nextjs:nodejs ./.next/standalone/apps/fishing-map ./


USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
