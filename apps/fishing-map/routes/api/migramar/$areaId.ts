import { createFileRoute } from '@tanstack/react-router'

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

export const Route = createFileRoute('/api/migramar/$areaId')({
  server: {
    handlers: {
      GET: async ({
        params,
      }: {
        request: Request
        params: { areaId: string }
      }) => {
        const { areaId } = params

        try {
          const { loadSpreadsheetDoc } = await import('server/api/utils/spreadsheets')
          const doc = await loadSpreadsheetDoc(MIGRAMAR_SPREADSHEET_ID)
          const sheet = doc.sheetsByTitle['data']
          if (!sheet) {
            return Response.json(
              { success: false, message: 'Data sheet not found' },
              { status: 500 }
            )
          }

          const rows = await sheet.getRows()
          const filtered = rows
            .filter((row) => row.get('area') === areaId)
            .map((row) => row.toObject() as MigramarRow)

          return Response.json(filtered satisfies MigramarApiResponse)
        } catch (error: any) {
          console.error('Migramar API error:', error.message)
          return Response.json(
            { success: false, message: 'Internal server error' } satisfies MigramarApiResponse,
            { status: 500 }
          )
        }
      },
    },
  },
})
