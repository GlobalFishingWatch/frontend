import { createServerFn } from '@tanstack/react-start'

import { CAPTCHA_ACTIONS } from '@globalfishingwatch/api-client'

import { captchaMiddleware } from 'server/captcha.middleware'
import {
  createHumanSession,
  hasHumanSession,
  HUMAN_SESSION_COOKIE_KEY,
  humanSessionCookieOptions,
} from 'server/human-session.server'
import { getRequestUser } from 'server/user.server'

// No captcha: tells whether this browser session already passed one
export const getHumanSessionServerFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<boolean> => hasHumanSession()
)

// Marks the browser session as human for the logged user once the captcha passes
export const startHumanSessionServerFn = createServerFn({ method: 'POST' })
  .middleware([captchaMiddleware(CAPTCHA_ACTIONS.humanSession)])
  .handler(async (): Promise<boolean> => {
    const { setCookie } = await import('@tanstack/react-start/server')
    const user = await getRequestUser()
    if (!user) {
      return false
    }
    setCookie(HUMAN_SESSION_COOKIE_KEY, createHumanSession(user.id), humanSessionCookieOptions)
    return true
  })
