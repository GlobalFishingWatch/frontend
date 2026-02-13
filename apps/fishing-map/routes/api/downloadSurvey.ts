import { createFileRoute } from '@tanstack/react-router'

const SURVEY_SPREADSHEET_ID = process.env.NEXT_DOWNLOAD_SURVEY_SPREADSHEET_ID || ''
const SURVEY_SHEET_TITLE = 'answers'

export type ContactConsent = 'yes' | 'no'

export type FeedbackFormData = {
  date: string
  name?: string
  email: string
  organization?: string
  groups?: string
  usageIntent?: string
  contactConsent?: ContactConsent
}

export type ApiResponse = {
  success: boolean
  message: string
  data?: FeedbackFormData
}

type RouteOptions = Parameters<
  ReturnType<typeof createFileRoute<'/api/downloadSurvey'>>
>[0]

export const Route = createFileRoute('/api/downloadSurvey')(
  {
    server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const data: FeedbackFormData = await request.json().catch(() => null)

        if (!data || !data.email) {
          return Response.json(
            { success: false, message: 'Survey data is required' },
            { status: 400 }
          )
        }

        try {
          const { loadSpreadsheetDoc } = await import('server/api/utils/spreadsheets')
          const feedbackSpreadsheetDoc = await loadSpreadsheetDoc(SURVEY_SPREADSHEET_ID)
          const sheet = feedbackSpreadsheetDoc.sheetsByTitle[SURVEY_SHEET_TITLE]

          await sheet.addRow(data)

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
  } as RouteOptions
)
