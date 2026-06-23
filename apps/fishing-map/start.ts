import {
  sentryGlobalFunctionMiddleware,
  sentryGlobalRequestMiddleware,
  wrapMiddlewaresWithSentry,
} from '@sentry/tanstackstart-react'
import { createCsrfMiddleware, createMiddleware, createStart } from '@tanstack/react-start'

import { runRequestWithI18n } from 'features/i18n/request-i18n.server'
import { runRequestWithAuthToken } from 'server-functions/gfw-api.server-config'

const isProduction = process.env.NODE_ENV === 'production'

const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === 'serverFn',
})

const i18nRequestMiddleware = createMiddleware({ type: 'request' }).server(({ request, next }) => {
  return runRequestWithI18n(request, () => next())
})

const authTokenRequestMiddleware = createMiddleware({ type: 'request' }).server(
  ({ request, next }) => {
    return runRequestWithAuthToken(request, () => next())
  }
)

export const startInstance = createStart(() => {
  return {
    requestMiddleware: wrapMiddlewaresWithSentry({
      i18nRequestMiddleware,
      authTokenRequestMiddleware,
      csrfMiddleware,
      ...(isProduction && { sentryGlobalRequestMiddleware }),
    }),
    functionMiddleware: isProduction ? [sentryGlobalFunctionMiddleware] : [],
  }
})
