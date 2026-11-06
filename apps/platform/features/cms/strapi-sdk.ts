import { strapi } from '@strapi/client'

import { serverEnv } from 'server/env.server'

const STRAPI_BASE = serverEnv.STRAPI_URL ?? 'http://localhost:1337'
const STRAPI_TOKEN = serverEnv.STRAPI_TOKEN

// Initialize the Strapi SDK with /api endpoint
const sdk = strapi({
  baseURL: new URL('/api', STRAPI_BASE).href,
  ...(STRAPI_TOKEN && { auth: STRAPI_TOKEN }),
})

export { sdk }
