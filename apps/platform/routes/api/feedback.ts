import { createFileRoute } from '@tanstack/react-router'

import type { GUEST_USER_TYPE } from '@globalfishingwatch/api-client'

const FEEDBACK_SPREADSHEET_ID = process.env.FEEDBACK_SPREADSHEET_ID || ''
const ERRORS_SPREADSHEET_ID = process.env.MAP_ERRORS_SPREADSHEET_ID || ''
const DETECTIONS_FEEDBACK_SPREADSHEET_ID = process.env.DETECTIONS_FEEDBACK_SPREADSHEET_ID || ''
const FEEDBACK_SHEET_TITLE = 'new feedback'
const ERRORS_SHEET_TITLE = 'errors'
const CORRECTIONS_SHEET_TITLE = 'vessels corrections'

export type FeedbackDataType = 'feedback' | 'error' | 'corrections' | 'detections'
export type FeedbackForm = {
  type: FeedbackDataType
  data: {
    date: string
    userAgent?: string
    resolution?: string
    url?: string
    userId?: number | typeof GUEST_USER_TYPE
    name?: string
    email?: string
    organization?: string
    groups?: string
    role?: string
    feedbackType?: string
    issue?: string
    description?: string
    datasetId?: string
    detectionId?: string
  }
}

export type ApiResponse = {
  success: boolean
  message: string
  data?: FeedbackForm['data']
}

export const Route = createFileRoute('/api/feedback')({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const { isSameOrigin, forbiddenResponse } = await import('server/api/utils/request')
        if (!isSameOrigin(request)) {
          return forbiddenResponse()
        }
        const body = await request.json().catch(() => ({}))
        const { type, data }: FeedbackForm = body || {}

        if (!data || typeof data !== 'object' || !type) {
          return Response.json(
            { success: false, message: 'Feedback data is required' },
            { status: 400 }
          )
        }

        // Guests can send feedback, but every guest submission needs its own captcha
        const { getRequestUser, getUserFullName } = await import('server/user.server')
        const { CAPTCHA_ACTIONS, CAPTCHA_HEADER, GUEST_USER_TYPE } =
          await import('@globalfishingwatch/api-client')
        const user = await getRequestUser()
        if (!user) {
          const { assertCaptcha } = await import('server/captcha.server')
          try {
            await assertCaptcha(
              request.headers.get(CAPTCHA_HEADER) || undefined,
              CAPTCHA_ACTIONS.feedback,
              request.headers.get('cf-connecting-ip') || undefined
            )
          } catch (e: any) {
            return Response.json(
              { success: false, message: e.message },
              { status: e.status || 401 }
            )
          }
        }
        // The verified identity wins over whatever the body claims
        const row: FeedbackForm['data'] = user
          ? {
              ...data,
              userId: user.id,
              email: user.email,
              name: getUserFullName(user),
              organization: user.organization,
            }
          : { ...data, userId: GUEST_USER_TYPE }

        try {
          const spreadsheetId =
            type === 'detections'
              ? DETECTIONS_FEEDBACK_SPREADSHEET_ID
              : type === 'error' || type === 'corrections'
                ? ERRORS_SPREADSHEET_ID
                : FEEDBACK_SPREADSHEET_ID
          const spreadsheetTitle =
            type === 'error'
              ? ERRORS_SHEET_TITLE
              : type === 'corrections'
                ? CORRECTIONS_SHEET_TITLE
                : FEEDBACK_SHEET_TITLE
          const { loadSpreadsheetDoc } = await import('server/api/utils/spreadsheets')
          const { sanitizeSheetRow } = await import('server/api/utils/sanitize')
          const feedbackSpreadsheetDoc = await loadSpreadsheetDoc(spreadsheetId)
          // detections feedback is written to the first tab of its own spreadsheet
          const sheet =
            type === 'detections'
              ? feedbackSpreadsheetDoc.sheetsByIndex[0]
              : feedbackSpreadsheetDoc.sheetsByTitle[spreadsheetTitle]

          await sheet.addRow(sanitizeSheetRow(row))

          return Response.json({
            success: true,
            message: 'Feedback received successfully',
            data: row,
          })
        } catch (error: any) {
          console.error('Feedback submission error:', error.message)
          return Response.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
          )
        }
      },
    },
  },
})
