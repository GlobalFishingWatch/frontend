import { createFileRoute } from '@tanstack/react-router'

import { VesselIdentitySourceEnum } from '@globalfishingwatch/api-types'

import type { InfoCorrectionSendFormat } from 'features/vessel/vesselCorrection/VesselCorrection.types'

const IDENTITY_REVIEW_SPREADSHEET_ID = process.env.NEXT_IDENTITY_REVIEW_SPREADSHEET_ID || ''

const REGISTRY_CORRECTIONS_SHEET_TITLE = 'Vessel Registry Corrections'
const GFW_SOURCE_CORRECTIONS_SHEET_TITLE = 'Vessel GFW Source Corrections'

function mapDataToHeader(header: string, data: any): string {
  const sharedMap: Record<string, any> = {
    Reviewer: data.reviewer,
    'Workspace Link': data.workspaceLink,
    'Date submitted': data.dateSubmitted,
    'Time Range': data.timeRange,
    'Analyst Comments': data.proposedCorrections?.comments,
  }

  const registryMap: Record<string, any> = {
    'Vessel Record ID': data.vesselId,
    'Vessel Name': data.originalValues?.shipname,
    CallSign: data.originalValues?.callsign,
    'SSVID/MMSI': data.originalValues?.ssvid,
    IMO: data.originalValues?.imo,
    Flag: data.originalValues?.flag,
    'Gear type': data.originalValues?.geartypes,
    'Vessel Name Corrected': data.proposedCorrections?.shipname,
    'CallSign Corrected': data.proposedCorrections?.callsign,
    'SSVID/MMSI Corrected': data.proposedCorrections?.ssvid,
    'IMO Corrected': data.proposedCorrections?.imo,
    'Flag Corrected': data.proposedCorrections?.flag,
    'Gear Type Corrected': data.proposedCorrections?.geartypes,
  }

  const selfReportedMap: Record<string, any> = {
    'SSVID/MMSI': data.originalValues?.ssvid,
    'Vessel ID': data.vesselId,
    'GFW Vessel Type': data.originalValues?.shiptypes,
    'GFW Gear Type': data.originalValues?.gfw_geartypes,
    'GFW Vessel Type Corrected': data.proposedCorrections?.shiptypes,
    'GFW Gear Type Corrected': data.proposedCorrections?.geartypes,
  }

  let map: Record<string, any> = { ...sharedMap }
  if (data.source === VesselIdentitySourceEnum.Registry) {
    map = { ...map, ...registryMap }
  } else if (data.source === VesselIdentitySourceEnum.SelfReported) {
    map = { ...map, ...selfReportedMap }
  } else {
    return ''
  }

  return map[header] || ''
}

export type ApiResponse = {
  success: boolean
  message: string
  data?: InfoCorrectionSendFormat
}

export const Route = createFileRoute('/api/corrections')({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const body = await request.json().catch(() => null)
        const rawData = body?.data

        if (!rawData || !rawData.source) {
          return Response.json(
            { success: false, message: 'Correction data with source is required' },
            { status: 400 }
          )
        }

        try {
          const spreadsheetId: string = IDENTITY_REVIEW_SPREADSHEET_ID
          const spreadsheetTitle: string =
            rawData.source === VesselIdentitySourceEnum.Registry
              ? REGISTRY_CORRECTIONS_SHEET_TITLE
              : GFW_SOURCE_CORRECTIONS_SHEET_TITLE

          const { loadSpreadsheetDoc } = await import('server/api/utils/spreadsheets')
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

          return Response.json({
            success: true,
            message: 'Feedback received successfully',
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
