import {
  sentryGlobalFunctionMiddleware,
  sentryGlobalRequestMiddleware,
  wrapMiddlewaresWithSentry,
} from '@sentry/tanstackstart-react'
import { createCsrfMiddleware, createMiddleware, createStart } from '@tanstack/react-start'

import { runRequestWithI18n } from 'features/i18n/request-i18n.server'

const isProduction = process.env.NODE_ENV === 'production'

const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === 'serverFn',
})

const i18nRequestMiddleware = createMiddleware({ type: 'request' }).server(({ request, next }) => {
  return runRequestWithI18n(request, () => next())
})

export const startInstance = createStart(() => {
  return {
    requestMiddleware: wrapMiddlewaresWithSentry({
      i18nRequestMiddleware,
      csrfMiddleware,
      ...(isProduction && { sentryGlobalRequestMiddleware }),
    }),
    functionMiddleware: isProduction ? [sentryGlobalFunctionMiddleware] : [],
  }
})
