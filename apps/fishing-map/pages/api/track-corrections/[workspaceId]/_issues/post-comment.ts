import type {
  TrackCorrection,
  TrackCorrectionComment,
} from 'features/track-correction/track-correction.slice'
import { loadSpreadsheetDocByWorkspace } from 'pages/api/_utils/spreadsheets'
import {
  COMMENTS_SPREADSHEET_TITLE,
  getSheetTab,
  ISSUES_SPREADSHEET_TITLE,
} from 'pages/api/track-corrections/[workspaceId]/_issues/utils'

export async function addCommentToIssue(
  issueId: string,
  commentBody: TrackCorrectionComment,
  workspaceId: string
) {
  const spreadsheetDoc = await loadSpreadsheetDocByWorkspace(workspaceId)
  const issuesSheet = getSheetTab(ISSUES_SPREADSHEET_TITLE, spreadsheetDoc)
  const commentsSheet = getSheetTab(COMMENTS_SPREADSHEET_TITLE, spreadsheetDoc)

  const rows = await issuesSheet.getRows<TrackCorrection>()
  const issueRow = rows.find((row) => row.get('issueId') === issueId)

  if (!issueRow) {
    throw new Error(`Issue ${issueId} not found`)
  }

  try {
    await commentsSheet.addRow(commentBody)
  } catch (error) {
    console.error('Error adding row:', error)
    throw error
  }
}
