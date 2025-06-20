import { JWT } from 'google-auth-library'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import type { NextApiRequest, NextApiResponse } from 'next'

import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'

import type { InfoCorrectionSendFormat } from 'features/vessel/vesselCorrection/VesselCorrection.types'

const FEEDBACK_CLIENT_EMAIL = process.env.NEXT_SPREADSHEET_CLIENT_EMAIL
const FEEDBACK_PRIVATE_KEY = process.env.NEXT_SPREADSHEET_PRIVATE_KEY?.replace(/\\n/gm, '\n') || ''

const IDENTITY_REVIEW_SPREADSHEET_ID = process.env.NEXT_IDENTITY_REVIEW_SPREADSHEET_ID || ''

const REGISTRY_CORRECTIONS_SHEET_TITLE = 'Vessel Registry Corrections'
const GFW_SOURCE_CORRECTIONS_SHEET_TITLE = 'Vessel GFW Source Corrections'

function mapDataToHeader(header: string, data: any): string {
  let map: Record<string, any>
  if (data.source === VesselIdentitySourceEnum.Registry) {
    map = {
      Reviewer: data.reviewer,
      'Workspace Link': data.workspaceLink,
      'Date submitted': data.dateSubmitted,
      'Time Range': data.timeRange,
      'Vessel Record ID': data.vesselId,
      'Vessel Name': data.originalValues?.shipname,
      CallSign: data.originalValues?.callsign,
      'SSVID/MMSI': data.originalValues?.ssvid,
      IMO: data.originalValues?.imo,
      Flag: data.originalValues?.flag,
      'Gear type': data.originalValues?.geartypes,
      'Vessel Name Corrected': data.proposedCorrections?.shipname,
      'CallSign Corrected': data.proposedCorrections?.callsign,
      'Ssvid/MMSI Corrected': data.proposedCorrections?.ssvid,
      'IMO Corrected': data.proposedCorrections?.imo,
      'Flag Corrected': data.proposedCorrections?.flag,
      'Analyst Comments': data.proposedCorrections?.comments,
      'Gear Type Corrected': data.proposedCorrections?.geartypes,
    }
  } else if (data.source === VesselIdentitySourceEnum.SelfReported) {
    map = {
      Reviewer: data.reviewer,
      'Workspace Link': data.workspaceLink,
      'Date submitted': data.dateSubmitted,
      // 'Time Range': data.timeRange,

      'Vessel ID': data.vesselId,
      'GFW Vessel Type': data.originalValues?.shiptypes,
      'GFW Gear Type': data.originalValues?.gfw_geartypes,

      'GFW Vessel Type Corrected': data.proposedCorrections?.shiptypes,
      'GFW Gear Type Corrected': data.proposedCorrections?.geartypes,

      'Analyst Comments': data.proposedCorrections?.comments,
    }
  } else return ''

  return map[header] || ''
}

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
    const spreadsheetTitle: string =
      rawData.source === VesselIdentitySourceEnum.Registry
        ? REGISTRY_CORRECTIONS_SHEET_TITLE
        : GFW_SOURCE_CORRECTIONS_SHEET_TITLE

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
