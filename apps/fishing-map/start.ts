import {
  sentryGlobalFunctionMiddleware,
  sentryGlobalRequestMiddleware,
  wrapMiddlewaresWithSentry,
} from '@sentry/tanstackstart-react'
import { createCsrfMiddleware, createStart } from '@tanstack/react-start'

const isProduction = process.env.NODE_ENV === 'production'

const csrfMiddleware = createCsrfMiddleware({
  filter: (ctx) => ctx.handlerType === 'serverFn',
})

export const startInstance = createStart(() => {
  return {
    requestMiddleware: wrapMiddlewaresWithSentry({
      csrfMiddleware,
      ...(isProduction && { sentryGlobalRequestMiddleware }),
    }),
    functionMiddleware: isProduction ? [sentryGlobalFunctionMiddleware] : [],
  }
})
