import { strapi } from '@strapi/client'

// Strapi base URL (without /api)
const STRAPI_BASE = import.meta.env.VITE_STRAPI_URL ?? 'http://localhost:1337'
const STRAPI_TOKEN = import.meta.env.VITE_STRAPI_TOKEN ?? ''

// Initialize the Strapi SDK with /api endpoint
const sdk = strapi({ baseURL: new URL('/api', STRAPI_BASE).href, auth: STRAPI_TOKEN })

export { sdk }
