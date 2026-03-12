import { createFileRoute } from '@tanstack/react-router'

import type { GUEST_USER_TYPE } from '@globalfishingwatch/api-client'

const FEEDBACK_SPREADSHEET_ID = process.env.NEXT_FEEDBACK_SPREADSHEET_ID || ''
const ERRORS_SPREADSHEET_ID = process.env.NEXT_MAP_ERRORS_SPREADSHEET_ID || ''
const FEEDBACK_SHEET_TITLE = 'new feedback'
const ERRORS_SHEET_TITLE = 'errors'
const CORRECTIONS_SHEET_TITLE = 'vessels corrections'

export type FeedbackDataType = 'feedback' | 'error' | 'corrections'
export type FeedbackForm = {
  type: FeedbackDataType
  data: {
    date: string
    userAgent: string
    resolution: string
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
        const body = await request.json().catch(() => ({}))
        const { type, data }: FeedbackForm = body || {}

        if (!data || !type) {
          return Response.json(
            { success: false, message: 'Feedback data is required' },
            { status: 400 }
          )
        }

        try {
          const spreadsheetId =
            type === 'error' || type === 'corrections'
              ? ERRORS_SPREADSHEET_ID
              : FEEDBACK_SPREADSHEET_ID
          const spreadsheetTitle =
            type === 'error'
              ? ERRORS_SHEET_TITLE
              : type === 'corrections'
                ? CORRECTIONS_SHEET_TITLE
                : FEEDBACK_SHEET_TITLE
          const { loadSpreadsheetDoc } = await import('server/api/utils/spreadsheets')
          const feedbackSpreadsheetDoc = await loadSpreadsheetDoc(spreadsheetId)
          const sheet = feedbackSpreadsheetDoc.sheetsByTitle[spreadsheetTitle]

          await sheet.addRow(data)

          return Response.json({
            success: true,
            message: 'Feedback received successfully',
            data: data,
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
