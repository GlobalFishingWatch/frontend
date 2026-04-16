import type { NextApiRequest, NextApiResponse } from 'next'
import { loadSpreadsheetDoc } from 'server/api/utils/spreadsheets'

const MIGRAMAR_SPREADSHEET_ID = process.env.NEXT_MIGRAMAR_SPREADSHEET_ID || ''

export type MigramarSpecies = {
  id: string
  label_en: string
  label_es: string
  label_scientific: string
}

export type MigramarIndicator = {
  id: string
  label_en_long: string
  label_es_long: string
  label_en_short: string
  label_es_short: string
}

export type MigramarOptionsApiResponse =
  | { species: MigramarSpecies[]; indicators: MigramarIndicator[] }
  | { success: false; message: string }

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MigramarOptionsApiResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed' })
  }

  try {
    const doc = await loadSpreadsheetDoc(MIGRAMAR_SPREADSHEET_ID)

    const [speciesSheet, indicatorsSheet] = [
      doc.sheetsByTitle['species'],
      doc.sheetsByTitle['indicators'],
    ]

    if (!speciesSheet || !indicatorsSheet) {
      return res.status(500).json({ success: false, message: 'Required sheets not found' })
    }

    const [speciesRows, indicatorsRows] = await Promise.all([
      speciesSheet.getRows(),
      indicatorsSheet.getRows(),
    ])
    return res.status(200).json({
      species: speciesRows
        .map((row) => row.toObject() as MigramarSpecies)
        .sort((a, b) => a.label_en.localeCompare(b.label_en)),
      indicators: indicatorsRows
        .map((row) => row.toObject() as MigramarIndicator)
        .sort((a, b) => a.label_en_long.localeCompare(b.label_en_long)),
    })
  } catch (error: any) {
    console.error('Migramar options API error:', error.message)
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
}
