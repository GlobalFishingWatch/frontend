import type {
  TrackCorrection,
  TrackCorrectionComment,
} from 'features/track-correction/track-correction.slice'
import { loadSpreadsheetDocByWorkspace } from 'pages/api/_utils/spreadsheets'
import {
  COMMENTS_SPREADSHEET_TITLE,
  ISSUES_SPREADSHEET_TITLE,
  parseIssueComment,
  parseIssueRow,
} from 'pages/api/track-corrections/[workspaceId]/_issues/utils'

export async function getWorkspaceIssues(
  workspaceId: string,
  { includeComments = true }: { includeComments?: boolean } = {}
) {
  const spreadsheetDoc = await loadSpreadsheetDocByWorkspace(workspaceId)
  const sheet = spreadsheetDoc.sheetsByTitle[ISSUES_SPREADSHEET_TITLE]

  if (!sheet) {
    throw new Error(
      `Spreadsheet tab (${ISSUES_SPREADSHEET_TITLE}) not found in spreadsheet ${workspaceId}`
    )
  }

  const rows = await sheet.getRows()
  const issues: TrackCorrection[] = rows.map(parseIssueRow)

  if (includeComments) {
    const commentsSheet = spreadsheetDoc.sheetsByTitle[COMMENTS_SPREADSHEET_TITLE]
    if (!commentsSheet) {
      throw new Error(
        `Spreadsheet tab (${COMMENTS_SPREADSHEET_TITLE}) not found in spreadsheet ${workspaceId}`
      )
    }

    const commentsRows = await commentsSheet.getRows<TrackCorrectionComment>()
    const allComments = commentsRows.map(parseIssueComment)

    return issues.map((issue) => {
      const comments = allComments.filter((comment) => comment.issueId === issue.issueId)
      return { ...issue, comments }
    })
  }

  return issues
}
