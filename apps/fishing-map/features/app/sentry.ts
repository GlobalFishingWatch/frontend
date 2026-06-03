import * as Sentry from '@sentry/tanstackstart-react'

type ErrorBoundaryTag = 'router-loader' | 'router-render' | 'react-error-boundary'

export function reportRouteError(
  error: unknown,
  source: ErrorBoundaryTag,
  extra?: Record<string, unknown>
) {
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(error, {
      tags: { errorBoundary: source },
      ...(extra ? { extra } : {}),
    })
  }
}
