import { createFileRoute } from '@tanstack/react-router'

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

export const Route = createFileRoute('/api/migramar/options')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const { loadSpreadsheetDoc } = await import('server/api/utils/spreadsheets')
          const doc = await loadSpreadsheetDoc(MIGRAMAR_SPREADSHEET_ID)

          const [speciesSheet, indicatorsSheet] = [
            doc.sheetsByTitle['species'],
            doc.sheetsByTitle['indicators'],
          ]

          if (!speciesSheet || !indicatorsSheet) {
            return Response.json(
              {
                success: false,
                message: 'Required sheets not found',
              } satisfies MigramarOptionsApiResponse,
              { status: 500 }
            )
          }

          const [speciesRows, indicatorsRows] = await Promise.all([
            speciesSheet.getRows(),
            indicatorsSheet.getRows(),
          ])

          return Response.json({
            species: speciesRows
              .map((row) => row.toObject() as MigramarSpecies)
              .sort((a, b) => a.label_en.localeCompare(b.label_en)),
            indicators: indicatorsRows
              .map((row) => row.toObject() as MigramarIndicator)
              .sort((a, b) => a.label_en_long.localeCompare(b.label_en_long)),
          } satisfies MigramarOptionsApiResponse)
        } catch (error: any) {
          console.error('Migramar options API error:', error.message)
          return Response.json(
            {
              success: false,
              message: 'Internal server error',
            } satisfies MigramarOptionsApiResponse,
            { status: 500 }
          )
        }
      },
    },
  },
})
