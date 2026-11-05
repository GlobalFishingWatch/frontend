import { SSR_REFERER } from 'features/app/app.config'

export const SSR_REFERER_HEADERS: HeadersInit = { referer: SSR_REFERER }

const FRONTEND_SECRET = process.env.GATEWAY_FRONTEND_SECRET ?? ''

if (process.env.NODE_ENV === 'production' && !FRONTEND_SECRET) {
  console.error('[gateway] GATEWAY_FRONTEND_SECRET is not set — SSR token refreshes need a captcha')
}

// Requests the server starts on its own, e.g. the SSR user and the loaders. Never send them on a
// request started in the browser: the gateway would skip the captcha the visitor had to solve
export const SSR_HEADERS: HeadersInit = {
  ...SSR_REFERER_HEADERS,
  ...(FRONTEND_SECRET && { 'x-frontend-origin': FRONTEND_SECRET }),
}
