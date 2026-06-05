import { createFileRoute } from '@tanstack/react-router'

const MIGRAMAR_SPREADSHEET_ID = process.env.MIGRAMAR_SPREADSHEET_ID || ''

export type MigramarRowYear =
  | '2000'
  | '2001'
  | '2002'
  | '2003'
  | '2004'
  | '2005'
  | '2006'
  | '2007'
  | '2008'
  | '2009'
  | '2010'
  | '2011'
  | '2012'
  | '2013'
  | '2014'
  | '2015'
  | '2016'
  | '2017'
  | '2018'
  | '2019'
  | '2020'
  | '2021'
  | '2022'
  | '2023'
  | '2024'
  | '2025'
  | '2026'

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
  significance_p: string
  slope: string
  intercept: string
  data_owner: string
  contact_info: string
} & Record<MigramarRowYear, string>

export type MigramarApiResponse = MigramarRow[] | { success: false; message: string }

export const Route = createFileRoute('/api/migramar/$areaId')({
  server: {
    handlers: {
      GET: async ({ params }: { request: Request; params: { areaId: string } }) => {
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
