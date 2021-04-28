import { GoogleSpreadsheet } from 'google-spreadsheet'

const FEEDBACK_CLIENT_EMAIL = process.env.REACT_APP_SPREADSHEET_CLIENT_EMAIL
const FEEDBACK_PRIVATE_KEY = process.env.REACT_APP_SPREADSHEET_PRIVATE_KEY

export const loadSpreadsheetDoc = async (id: string) => {
  if (!id) {
    throw new Error('Spreadsheet id is missing')
  }
  if (!FEEDBACK_CLIENT_EMAIL || !FEEDBACK_PRIVATE_KEY) {
    throw new Error('Spreadsheet service account email/key/id missing')
  }
  const spreadsheetDoc = new GoogleSpreadsheet(id)
  await spreadsheetDoc.useServiceAccountAuth({
    client_email: FEEDBACK_CLIENT_EMAIL,
    private_key: FEEDBACK_PRIVATE_KEY,
  })
  await spreadsheetDoc.loadInfo()
  return spreadsheetDoc
}
