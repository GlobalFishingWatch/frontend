const FEEDBACK_CLIENT_EMAIL = process.env.NEXT_PUBLIC_SPREADSHEET_CLIENT_EMAIL
const FEEDBACK_PRIVATE_KEY = process.env.NEXT_PUBLIC_SPREADSHEET_PRIVATE_KEY

// let GoogleSpreadsheet: typeof import('google-spreadsheet').GoogleSpreadsheet
// let JWT: typeof import('google-auth-library').JWT

export const loadSpreadsheetDoc = async (id: string) => {
  // if (!GoogleSpreadsheet) {
  //   GoogleSpreadsheet = await import('google-spreadsheet').then(
  //     (module) => module.GoogleSpreadsheet
  //   )
  // }
  // if (!JWT) {
  //   JWT = await import('google-auth-library').then((module) => module.JWT)
  // }
  // if (!id) {
  //   throw new Error('Spreadsheet id is missing')
  // }
  // if (!FEEDBACK_CLIENT_EMAIL || !FEEDBACK_PRIVATE_KEY) {
  //   throw new Error('Spreadsheet service account email/key/id missing')
  // }
  // const serviceAccountAuth = new JWT({
  //   email: FEEDBACK_CLIENT_EMAIL,
  //   key: FEEDBACK_PRIVATE_KEY,
  //   scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  // })
  // const spreadsheetDoc = new GoogleSpreadsheet(id, serviceAccountAuth)
  // await spreadsheetDoc.loadInfo()
  // return spreadsheetDoc
}
