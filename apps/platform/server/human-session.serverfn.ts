import { createServerFn } from '@tanstack/react-start'

import { CAPTCHA_ACTIONS } from '@globalfishingwatch/api-client'

import { captchaMiddleware } from 'server/captcha.middleware'
import {
  createHumanSession,
  getRequestUserId,
  hasHumanSession,
  HUMAN_SESSION_COOKIE_KEY,
  humanSessionCookieOptions,
} from 'server/human-session.server'

// No captcha: tells whether this browser session already passed one
export const getHumanSessionServerFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<boolean> => hasHumanSession()
)

// Marks the browser session as human for the logged user once the captcha passes
export const startHumanSessionServerFn = createServerFn({ method: 'POST' })
  .middleware([captchaMiddleware(CAPTCHA_ACTIONS.humanSession)])
  .handler(async (): Promise<boolean> => {
    const { setCookie } = await import('@tanstack/react-start/server')
    const userId = await getRequestUserId()
    if (userId === null) return false
    setCookie(HUMAN_SESSION_COOKIE_KEY, createHumanSession(userId), humanSessionCookieOptions)
    return true
  })
