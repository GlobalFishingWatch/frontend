import { JWT } from 'google-auth-library'
import { GoogleSpreadsheet } from 'google-spreadsheet'

import { TRACK_CORRECTION_SPREADSHEET_ID_BY_WORKSPACE } from '../../../features/track-correction/track-correction.constants'

const FEEDBACK_CLIENT_EMAIL = process.env.NEXT_SPREADSHEET_CLIENT_EMAIL
const FEEDBACK_PRIVATE_KEY = process.env.NEXT_SPREADSHEET_PRIVATE_KEY?.replace(/\\n/gm, '\n') || ''

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

export const loadSpreadsheetDocByWorkspace = async (workspaceId: string) => {
  const spreadsheetId =
    TRACK_CORRECTION_SPREADSHEET_ID_BY_WORKSPACE[
      workspaceId as keyof typeof TRACK_CORRECTION_SPREADSHEET_ID_BY_WORKSPACE
    ]
  if (!spreadsheetId) {
    throw new Error(`Spreadsheet ID not found for workspace ${workspaceId}`)
  }

  const spreadsheetDoc = await loadSpreadsheetDoc(spreadsheetId)
  return spreadsheetDoc
}
