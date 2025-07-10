import type { TrackCorrectionComment } from 'features/track-correction/track-correction.slice'
import { loadSpreadsheetDocByWorkspace } from 'pages/api/_utils/spreadsheets'
import {
  COMMENTS_SPREADSHEET_TITLE,
  getSheetTab,
} from 'pages/api/track-corrections/[workspaceId]/_issues/utils'

export async function addCommentToIssue(
  issueId: string,
  commentBody: TrackCorrectionComment,
  workspaceId: string
) {
  const spreadsheetDoc = await loadSpreadsheetDocByWorkspace(workspaceId)
  const commentsSheet = getSheetTab(COMMENTS_SPREADSHEET_TITLE, spreadsheetDoc)

  try {
    await commentsSheet.addRow(commentBody)
  } catch (error) {
    console.error('Error adding row:', error)
    throw error
  }
}
