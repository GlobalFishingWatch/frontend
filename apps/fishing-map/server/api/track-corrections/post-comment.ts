import type { TrackCorrectionComment } from 'features/track-correction/track-correction.slice'
import { COMMENTS_SPREADSHEET_TITLE, getSheetTab } from 'server/api/track-corrections/utils'
import { sanitizeSheetRow } from 'server/api/utils/sanitize'
import { loadSpreadsheetDocByWorkspace } from 'server/api/utils/spreadsheets'

export async function addCommentToIssue(
  issueId: string,
  commentBody: TrackCorrectionComment,
  workspaceId: string
) {
  const spreadsheetDoc = await loadSpreadsheetDocByWorkspace(workspaceId)
  const commentsSheet = getSheetTab(COMMENTS_SPREADSHEET_TITLE, spreadsheetDoc)

  try {
    await commentsSheet.addRow(sanitizeSheetRow(commentBody))
  } catch (error) {
    console.error('Error adding row:', error)
    throw error
  }
}
