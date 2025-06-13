import type { TrackCorrection } from 'features/track-correction/track-correction.slice'
import { loadSpreadsheetDocByWorkspace } from 'pages/api/_utils/spreadsheets'
import {
  ISSUES_SPREADSHEET_TITLE,
  parseIssueRow,
} from 'pages/api/track-corrections/[workspaceId]/_issues/utils'

export async function getWorkspaceIssues(workspaceId: string) {
  const spreadsheetDoc = await loadSpreadsheetDocByWorkspace(workspaceId)
  const sheet = spreadsheetDoc.sheetsByTitle[ISSUES_SPREADSHEET_TITLE]

  if (!sheet) {
    throw new Error(
      `Spreadsheet tab (${ISSUES_SPREADSHEET_TITLE}) not found in spreadsheet ${workspaceId}`
    )
  }

  const rows = await sheet.getRows()
  const issues: TrackCorrection[] = rows.map(parseIssueRow)

  return issues
}
