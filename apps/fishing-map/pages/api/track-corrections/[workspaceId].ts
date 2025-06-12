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
  const { workspaceId } = req.query
  console.log('🚀 ~ handler ~ workspaceId:', workspaceId)

  if (req.method === 'POST') {
    return res.status(200).json({
      success: false,
      message: 'TODO: form submit',
    })
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      success: false,
      message: 'TODO: get issues',
    })
  }

  return res.status(405).json({
    success: false,
    message: 'Method not allowed',
  })
}
