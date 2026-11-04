import { CAPTCHA_ACTIONS, CAPTCHA_HEADER, GFWAPI } from '@globalfishingwatch/api-client'

import { PATH_BASENAME } from 'data/map/config'
import type { FeedbackDataType } from 'routes/api/feedback'

/**
 * Logged users are verified by their token cookie. Guests solve a captcha for every
 * submission: /api/feedback rejects a guest request without a valid token
 */
export async function postFeedback({
  type,
  data,
  isGuest,
}: {
  type: FeedbackDataType
  data: object
  isGuest: boolean
}) {
  const captchaToken = isGuest ? await GFWAPI.getCaptchaToken(CAPTCHA_ACTIONS.feedback) : undefined
  const response = await fetch(`${PATH_BASENAME}/api/feedback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(captchaToken && { [CAPTCHA_HEADER]: captchaToken }),
    },
    body: JSON.stringify({ type, data }),
  })
  const responseData = await response.json().catch(() => null)
  if (!response.ok) {
    throw new Error(responseData?.message || 'Something went wrong')
  }
  return responseData
}
