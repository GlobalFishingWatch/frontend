import { strapi } from '@strapi/client'

const STRAPI_BASE = process.env.STRAPI_URL ?? 'http://localhost:1337'
const STRAPI_TOKEN = process.env.STRAPI_TOKEN ?? ''

if (process.env.NODE_ENV === 'production' && !STRAPI_TOKEN) {
  console.error('[strapi] STRAPI_TOKEN is not set — CMS requests will be unauthenticated')
}

// Initialize the Strapi SDK with /api endpoint
const sdk = strapi({ baseURL: new URL('/api', STRAPI_BASE).href, auth: STRAPI_TOKEN })

export { sdk }
