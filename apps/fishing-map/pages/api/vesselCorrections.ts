import { JWT } from 'google-auth-library'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import type { NextApiRequest, NextApiResponse } from 'next'

import type { InfoCorrectionSendFormat } from 'features/vessel/vesselCorrection/VesselCorrection.types'

const FEEDBACK_CLIENT_EMAIL = process.env.NEXT_SPREADSHEET_CLIENT_EMAIL
const FEEDBACK_PRIVATE_KEY = process.env.NEXT_SPREADSHEET_PRIVATE_KEY?.replace(/\\n/gm, '\n') || ''

const MASTER_SPREADSHEET_ID = process.env.NEXT_MASTER_SPREADSHEET_ID || ''

const CORRECTIONS_SHEET_TITLE = 'Vessel Identity Correction'

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

export type ApiResponse = {
  success: boolean
  message: string
  data?: InfoCorrectionSendFormat
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    })
  }

  try {
    const rawData = req.body || {}
    const data = {
      reviewer: rawData.reviewer || '',
      source: rawData.source || '',
      workspaceLink: rawData.workspaceLink || '',
      dateSubmitted: rawData.dateSubmitted || '',
      timeRange: rawData.timeRange || '',
      vesselId: rawData.vesselId || '',
      original_flag: rawData.originalValues?.flag || '',
      original_shipname: rawData.originalValues?.shipname || '',
      original_geartypes: rawData.originalValues?.geartypes || '',
      original_shiptypes: rawData.originalValues?.shiptypes || '',
      original_ssvid: rawData.originalValues?.ssvid || '',
      original_imo: rawData.originalValues?.imo || '',
      original_callsign: rawData.originalValues?.callsign || '',
      proposed_flag: rawData.proposedCorrections?.flag || '',
      proposed_shipname: rawData.proposedCorrections?.shipname || '',
      proposed_geartypes: rawData.proposedCorrections?.geartypes || '',
      proposed_shiptypes: rawData.proposedCorrections?.shiptypes || '',
      proposed_ssvid: rawData.proposedCorrections?.ssvid || '',
      proposed_imo: rawData.proposedCorrections?.imo || '',
      proposed_callsign: rawData.proposedCorrections?.callsign || '',
    }

    if (!data) {
      return res.status(400).json({
        success: false,
        message: 'Feedback data is required',
      })
    }

    const spreadsheetId: string = MASTER_SPREADSHEET_ID
    const spreadsheetTitle: string = CORRECTIONS_SHEET_TITLE

    const feedbackSpreadsheetDoc = await loadSpreadsheetDoc(spreadsheetId)

    const sheet = feedbackSpreadsheetDoc.sheetsByTitle[spreadsheetTitle]

    await sheet.addRow(data)

    return res.status(200).json({
      success: true,
      message: 'Feedback received successfully',
      //data: data,
    })
  } catch (error: any) {
    console.error('Feedback submission error:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}
