import { SSR_REFERER } from 'features/app/app.config'
import { serverEnv } from 'server/env.server'

export const SSR_REFERER_HEADERS: HeadersInit = { referer: SSR_REFERER }

// Requests the server starts on its own, e.g. the SSR user and the loaders. Never send them on a
// request started in the browser: the gateway would skip the captcha the visitor had to solve
export const SSR_HEADERS: HeadersInit = {
  ...SSR_REFERER_HEADERS,
  ...(serverEnv.GATEWAY_FRONTEND_SECRET && {
    'x-frontend-origin': serverEnv.GATEWAY_FRONTEND_SECRET,
  }),
}
