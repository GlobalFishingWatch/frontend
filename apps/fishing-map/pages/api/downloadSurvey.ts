import type { NextApiRequest, NextApiResponse } from 'next'
import { loadSpreadsheetDoc } from 'server/api/utils/spreadsheets'

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

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    })
  }

  try {
    const data: FeedbackFormData = req.body || {}

    if (!data) {
      return res.status(400).json({
        success: false,
        message: 'Survey data is required',
      })
    }

    const feedbackSpreadsheetDoc = await loadSpreadsheetDoc(SURVEY_SPREADSHEET_ID)

    const sheet = feedbackSpreadsheetDoc.sheetsByTitle[SURVEY_SHEET_TITLE]

    await sheet.addRow(data)

    return res.status(200).json({
      success: true,
      message: 'Answer received successfully',
      data: data,
    })
  } catch (error: any) {
    console.error('Answer submission error:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}
