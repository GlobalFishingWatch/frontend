import { createMiddleware } from '@tanstack/react-start'

import { CAPTCHA_HEADER, GFWAPI } from '@globalfishingwatch/api-client'

import { assertCaptcha } from 'server/captcha.server'

/**
 * Same contract as GFWAPI.fetch({ captcha }) for server functions: the browser solves a single-use
 * Turnstile token for `action` and sends it in the x-captcha-token header, the server verifies it
 */
export const captchaMiddleware = (action: string) =>
  createMiddleware({ type: 'function' })
    .client(async ({ next }) => {
      const token = await GFWAPI.getCaptchaToken(action)
      return next({ headers: token ? { [CAPTCHA_HEADER]: token } : {} })
    })
    .server(async ({ next }) => {
      const { getRequestHeader } = await import('@tanstack/react-start/server')
      await assertCaptcha(
        getRequestHeader(CAPTCHA_HEADER),
        action,
        getRequestHeader('cf-connecting-ip')
      )
      return next()
    })
