import type { NextApiRequest, NextApiResponse } from 'next'

import type { InfoCorrectionSendFormat } from 'features/vessel/vesselCorrection/VesselCorrection.types'
import { loadSpreadsheetDoc } from 'pages/api/_utils/spreadsheets'

const IDENTITY_REVIEW_SPREADSHEET_ID = process.env.NEXT_IDENTITY_REVIEW_SPREADSHEET_ID || ''

const CORRECTIONS_SHEET_TITLE = 'Vessel Identity Correction'

function mapDataToHeader(header: string, data: any): string {
  const map: Record<string, any> = {
    Reviewer: data.reviewer,
    Source: data.source,
    'Workspace Link': data.workspaceLink,
    'Date submitted': data.dateSubmitted,
    'Time Range': data.timeRange,
    'Vessel ID': data.vesselId,
    Flag: data.originalValues?.flag,
    'Vessel Name': data.originalValues?.shipname,
    'Gear type': data.originalValues?.geartypes,
    MMSI: data.originalValues?.ssvid,
    IMO: data.originalValues?.imo,
    CallSign: data.originalValues?.callsign,
    'GFW Gear Type': data.originalValues?.gfw_geartypes,
    'GFW Vessel Type': data.originalValues?.shiptypes,
    'Ssvid/MMSI Corrected': data.proposedCorrections?.ssvid,
    'Vessel Name Corrected': data.proposedCorrections?.shipname,
    'Gear Type Corrected': data.proposedCorrections?.geartypes,
    'Vessel Type Corrected': data.proposedCorrections?.shiptypes,
    'Flag Corrected': data.proposedCorrections?.flag,
    'IMO Corrected': data.proposedCorrections?.imo,
    'CallSign Corrected': data.proposedCorrections?.callsign,
    'Analyst Comments': data.proposedCorrections?.comments,
  }

  return map[header] || ''
}

export type ApiResponse = {
  success: boolean
  message: string
  data?: InfoCorrectionSendFormat
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  const rawData = req.body.data || {}

  if (!rawData) {
    return res.status(400).json({
      success: false,
      message: 'Feedback data is required',
    })
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    })
  }

  try {
    const spreadsheetId: string = IDENTITY_REVIEW_SPREADSHEET_ID
    const spreadsheetTitle: string = CORRECTIONS_SHEET_TITLE

    const feedbackSpreadsheetDoc = await loadSpreadsheetDoc(spreadsheetId)
    const sheet = feedbackSpreadsheetDoc.sheetsByTitle[spreadsheetTitle]

    if (!sheet) {
      console.error('Sheet not found:', spreadsheetTitle)
      throw new Error(`Sheet "${spreadsheetTitle}" not found in spreadsheet`)
    }

    try {
      await sheet.loadHeaderRow(3)
      const headers = sheet.headerValues

      const rowToAdd: Record<string, any> = {}
      for (const header of headers) {
        rowToAdd[header] = mapDataToHeader(header, rawData)
      }

      await sheet.addRow(rowToAdd)
    } catch (error) {
      console.error('Error adding row:', error)
      throw error
    }

    return res.status(200).json({
      success: true,
      message: 'Feedback received successfully',
    })
  } catch (error: any) {
    console.error('Feedback submission error:', error.message)
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
}
