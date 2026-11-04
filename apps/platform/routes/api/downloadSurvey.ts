import { createFileRoute } from '@tanstack/react-router'

import type { DownloadSurveyPayload } from '@globalfishingwatch/ui-components/download-survey'

const SURVEY_SPREADSHEET_ID = process.env.DOWNLOAD_SURVEY_SPREADSHEET_ID || ''
const SURVEY_SHEET_TITLE = 'answers'

export type ApiResponse = {
  success: boolean
  message: string
  data?: DownloadSurveyPayload
}

export const Route = createFileRoute('/api/downloadSurvey')({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const { isSameOrigin, forbiddenResponse, unauthorizedResponse } =
          await import('server/api/utils/request')
        if (!isSameOrigin(request)) {
          return forbiddenResponse()
        }
        const { getRequestUser, getUserFullName } = await import('server/user.server')
        const user = await getRequestUser()
        if (!user) {
          return unauthorizedResponse()
        }
        const body: DownloadSurveyPayload = await request.json().catch(() => null)

        if (!body || typeof body !== 'object') {
          return Response.json(
            { success: false, message: 'Survey data is required' },
            { status: 400 }
          )
        }

        // The verified identity wins over whatever the body claims
        const data: DownloadSurveyPayload = {
          ...body,
          name: getUserFullName(user),
          email: user.email ?? '',
          organization: user.organization ?? '',
        }

        try {
          const { loadSpreadsheetDoc } = await import('server/api/utils/spreadsheets')
          const { sanitizeSheetRow } = await import('server/api/utils/sanitize')
          const feedbackSpreadsheetDoc = await loadSpreadsheetDoc(SURVEY_SPREADSHEET_ID)
          const sheet = feedbackSpreadsheetDoc.sheetsByTitle[SURVEY_SHEET_TITLE]

          await sheet.addRow(sanitizeSheetRow(data))

          return Response.json({
            success: true,
            message: 'Answer received successfully',
            data: data,
          })
        } catch (error: any) {
          console.error('Answer submission error:', error.message)
          return Response.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
          )
        }
      },
    },
  },
})
