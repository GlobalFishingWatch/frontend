import { CAPTCHA_ERRORS } from '@globalfishingwatch/api-client'

import { serverEnv } from 'server/env.server'

const isProduction = process.env.NODE_ENV === 'production'

// https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
const SITEVERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'
// Cloudflare's always-pass test secret, pairs with the test sitekey in .env.sample
const TEST_SECRET = '1x0000000000000000000000000000000AA'
const TURNSTILE_SECRET_KEY = serverEnv.TURNSTILE_SECRET_KEY || (isProduction ? '' : TEST_SECRET)

type SiteverifyResult = { success: boolean; action?: string; 'error-codes'?: string[] }

const captchaError = (message: string, status: number) =>
  Object.assign(new Error(message), { status })

/**
 * Throws the same errors as the gateway routes with validateCaptcha unless `token` is a valid
 * Turnstile token solved for `action`, so isCaptchaError matches both
 */
export async function assertCaptcha(token: string | undefined, action: string, remoteIp?: string) {
  if (!TURNSTILE_SECRET_KEY) {
    throw captchaError(CAPTCHA_ERRORS.unavailable, 503)
  }
  if (!token) {
    throw captchaError(CAPTCHA_ERRORS.invalid, 401)
  }
  let result: SiteverifyResult
  try {
    const response = await fetch(SITEVERIFY_URL, {
      method: 'POST',
      body: new URLSearchParams({
        secret: TURNSTILE_SECRET_KEY,
        response: token,
        ...(remoteIp && { remoteip: remoteIp }),
      }),
      signal: AbortSignal.timeout(10_000),
    })
    if (!response.ok) {
      throw new Error(`siteverify answered ${response.status}`)
    }
    result = await response.json()
  } catch (e) {
    console.error('Turnstile siteverify failed', e)
    throw captchaError(CAPTCHA_ERRORS.unavailable, 503)
  }
  // The test secret does not echo the widget action
  const actionMatches = result.action === action || TURNSTILE_SECRET_KEY === TEST_SECRET
  if (!result.success || !actionMatches) {
    console.warn('Turnstile token rejected', { action, errors: result['error-codes'] })
    throw captchaError(CAPTCHA_ERRORS.invalid, 401)
  }
}
