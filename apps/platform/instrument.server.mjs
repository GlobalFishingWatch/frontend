import * as Sentry from '@sentry/tanstackstart-react'

Sentry.init({
  dsn: 'https://f093e15df0145c6c0b1b9afe8f15fdba@o4510353401577472.ingest.us.sentry.io/4510462762942464',
  tracesSampleRate: 0.1,
  dataCollection: { userInfo: true, httpBodies: [] },
  ignoreErrors: [/Aborted due to condition callback returning false/],
})
