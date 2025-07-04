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

export async function getWorkspaceIssueDetail(workspaceId: string, issueId: string) {
  const spreadsheetDoc = await loadSpreadsheetDocByWorkspace(workspaceId)
  const issuesSheet = spreadsheetDoc.sheetsByTitle[ISSUES_SPREADSHEET_TITLE]

  if (!issuesSheet) {
    throw new Error(
      `Spreadsheet tab (${ISSUES_SPREADSHEET_TITLE}) not found in spreadsheet ${workspaceId}`
    )
  }

  const rows = await issuesSheet.getRows<TrackCorrection>()
  const issueRow = rows.find((row) => row.get('issueId') === issueId)
  const issue = issueRow ? parseIssueRow(issueRow) : null

  if (!issue) {
    throw new Error(`Issue ${issueId} not found`)
  }

  const commentsSheet = spreadsheetDoc.sheetsByTitle[COMMENTS_SPREADSHEET_TITLE]
  if (!commentsSheet) {
    throw new Error(
      `Spreadsheet tab (${COMMENTS_SPREADSHEET_TITLE}) not found in spreadsheet ${workspaceId}`
    )
  }

  const commentsRows = await commentsSheet.getRows<TrackCorrectionComment>()
  const comments = commentsRows.flatMap((row) => {
    const commentIssueId = row.get('issueId')
    if (commentIssueId !== issueId) {
      return []
    }
    return parseIssueComment(row)
  })

  return { ...issue, comments } as TrackCorrection
}
