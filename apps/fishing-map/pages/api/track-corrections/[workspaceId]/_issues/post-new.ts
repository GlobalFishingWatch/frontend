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

export async function createNewIssue(
  issueBody: TrackCorrection,
  commentBody: TrackCorrectionComment,
  workspaceId: string
) {
  const spreadsheetDoc = await loadSpreadsheetDocByWorkspace(workspaceId)

  const issuesSheet = getSheetTab(ISSUES_SPREADSHEET_TITLE, spreadsheetDoc)
  const commentsSheet = getSheetTab(COMMENTS_SPREADSHEET_TITLE, spreadsheetDoc)

  try {
    const commentResponse = await commentsSheet.addRow(commentBody)
    const commentRowNumber = commentResponse.rowNumber
    const commentRowLink = `https://docs.google.com/spreadsheets/d/${spreadsheetDoc.spreadsheetId}/edit#gid=${commentsSheet.sheetId}&range=A${commentRowNumber}`

    const rowData = {
      ...issueBody,
      issueId: commentBody.issueId,
      comments: `=HYPERLINK("${commentRowLink}", "See comments")`,
    }
    await issuesSheet.addRow(rowData)
  } catch (error) {
    console.error('Error adding row:', error)
    throw error
  }
}
