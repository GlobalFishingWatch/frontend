import { definePlugin } from 'nitro'

import { serverEnv, serverEnvSchema } from './env.server'

export default definePlugin(() => {
  if (process.env.NODE_ENV !== 'production') {
    return
  }
  const missing = Object.keys(serverEnvSchema.shape).filter(
    (key) => serverEnv[key as keyof typeof serverEnv] === undefined
  )
  if (!missing.length) {
    return
  }
  const message = `[env] Missing required server env: ${missing.join(', ')}`
  // The smoke test and scripts/serve-ssr.mjs boot the production build without secrets
  if (process.env.ALLOW_MISSING_SERVER_ENV === 'true') {
    console.warn(message)
    return
  }
  throw new Error(message)
})
