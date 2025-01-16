import { JWT } from 'google-auth-library'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import type { NextApiRequest, NextApiResponse } from 'next'

import type { GUEST_USER_TYPE } from '@globalfishingwatch/api-client'

const FEEDBACK_CLIENT_EMAIL = process.env.NEXT_SPREADSHEET_CLIENT_EMAIL
const FEEDBACK_PRIVATE_KEY = process.env.NEXT_SPREADSHEET_PRIVATE_KEY?.replace(/\\n/gm, '\n') || ''

const FEEDBACK_SPREADSHEET_ID = process.env.NEXT_FEEDBACK_SPREADSHEET_ID || ''
const ERRORS_SPREADSHEET_ID = process.env.NEXT_MAP_ERRORS_SPREADSHEET_ID || ''
const FEEDBACK_SHEET_TITLE = 'new feedback'
const ERRORS_SHEET_TITLE = 'errors'

export const loadSpreadsheetDoc = async (id: string) => {
  if (!id) {
    throw new Error('Spreadsheet id is missing')
  }
  if (!FEEDBACK_CLIENT_EMAIL || !FEEDBACK_PRIVATE_KEY) {
    throw new Error('Spreadsheet service account email/key/id missing')
  }

  const serviceAccountAuth = new JWT({
    email: FEEDBACK_CLIENT_EMAIL,
    key: FEEDBACK_PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  const spreadsheetDoc = new GoogleSpreadsheet(id, serviceAccountAuth)
  await spreadsheetDoc.loadInfo()
  return spreadsheetDoc
}

export type FeedbackDataType = 'feedback' | 'error'
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

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    })
  }

  try {
    const { type, data }: FeedbackForm = req.body || {}
    if (!data || !type) {
      return res.status(400).json({
        success: false,
        message: 'Feedback data is required',
      })
    }
    const spreadsheetId = type === 'error' ? ERRORS_SPREADSHEET_ID : FEEDBACK_SPREADSHEET_ID
    const spreadsheetTitle = type === 'error' ? ERRORS_SHEET_TITLE : FEEDBACK_SHEET_TITLE
    const feedbackSpreadsheetDoc = await loadSpreadsheetDoc(spreadsheetId)

    const sheet = feedbackSpreadsheetDoc.sheetsByTitle[spreadsheetTitle]
    await sheet.addRow(data)

    return res.status(200).json({
      success: true,
      message: 'Feedback received successfully',
      data: data,
    })
  } catch (error: any) {
    console.error('Feedback submission error:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}
