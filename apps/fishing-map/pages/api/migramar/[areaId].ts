import type { NextApiRequest, NextApiResponse } from 'next'
import { loadSpreadsheetDoc } from 'server/api/utils/spreadsheets'

const MIGRAMAR_SPREADSHEET_ID = process.env.NEXT_MIGRAMAR_SPREADSHEET_ID || ''

export type MigramarRow = {
  species: string
  indicator: string
  area: string
  scenario: string
  baseline_years: string
  baseline_value: string
  P20: string
  P40: string
  P60: string
  P80: string
  [year: string]: string
  significance_p: string
  slope: string
  intercept: string
  data_owner: string
  contact_info: string
}

export type MigramarApiResponse = MigramarRow[] | { success: false; message: string }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MigramarApiResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  const { areaId } = req.query as { areaId: string }
  if (!areaId) {
    return res.status(400).json({ success: false, message: 'Area ID is required' })
  }

  try {
    const doc = await loadSpreadsheetDoc(MIGRAMAR_SPREADSHEET_ID)
    const sheet = doc.sheetsByTitle['data']
    if (!sheet) {
      return res.status(500).json({ success: false, message: 'Data sheet not found' })
    }

    const rows = await sheet.getRows()
    const filtered = rows
      .filter((row) => row.get('area') === areaId)
      .map((row) => row.toObject() as MigramarRow)

    return res.status(200).json(filtered)
  } catch (error: any) {
    console.error('Migramar API error:', error.message)
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
}
