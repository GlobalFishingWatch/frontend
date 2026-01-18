import { sentryVitePlugin } from '@sentry/vite-plugin'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    sentryVitePlugin({
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: 'global-fishing-watch',
      project: 'frontend',
    }),
    sentryVitePlugin({
      org: 'global-fishing-watch',
      project: 'frontend',
    }),
  ],
})
