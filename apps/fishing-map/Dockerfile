#################################################################################
# Actual application to run
#################################################################################

# Production image, copy all the files and run next
FROM node:21-alpine AS production
WORKDIR /app

ARG APP_NAME=fishing-map
ARG NEXT_MAP_ERRORS_SPREADSHEET_ID
ARG NEXT_FEEDBACK_SPREADSHEET_ID
ARG NEXT_SPREADSHEET_CLIENT_EMAIL
ARG NEXT_SPREADSHEET_PRIVATE_KEY

ENV APP_NAME $APP_NAME
ENV NEXT_MAP_ERRORS_SPREADSHEET_ID=${NEXT_MAP_ERRORS_SPREADSHEET_ID}
ENV NEXT_FEEDBACK_SPREADSHEET_ID=${NEXT_FEEDBACK_SPREADSHEET_ID}
ENV NEXT_SPREADSHEET_CLIENT_EMAIL=${NEXT_SPREADSHEET_CLIENT_EMAIL}
ENV NEXT_SPREADSHEET_PRIVATE_KEY=${NEXT_SPREADSHEET_PRIVATE_KEY}

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# nx/next sets the distDir in the server.js standalone folder to
# a relative folder ./../../dist/apps/{$APP_NAME}/.next on
# build time it's necessary to adjust the dir structure of the
# output to it
COPY ./public ./apps/$APP_NAME/public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --chown=nextjs:nodejs ./.next/standalone ./

# Had to change the dest dir to ./dist/apps/$APP_NAME/.next/static since
# it's there where the server looks for the files
COPY --chown=nextjs:nodejs ./.next/static ./dist/apps/$APP_NAME/.next/static


USER nextjs

EXPOSE 3000

ENV PORT 3000

# this is also customized based on the output where the standalone
# next server files are placed
WORKDIR /app/apps/$APP_NAME

CMD ["node", "--max-http-header-size=40000", "server.js"]
