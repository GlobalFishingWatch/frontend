import type { GoogleSpreadsheet, GoogleSpreadsheetRow } from 'google-spreadsheet'

import type {
  TrackCorrection,
  TrackCorrectionComment,
} from 'features/track-correction/track-correction.slice'

export const ISSUES_SPREADSHEET_TITLE = 'issues'
export const COMMENTS_SPREADSHEET_TITLE = 'comments'

export function parseIssueResolved(value: string) {
  return value?.toLowerCase() === 'true'
}

export function parseIssueComment(
  row: GoogleSpreadsheetRow<TrackCorrectionComment>
): TrackCorrectionComment {
  return {
    issueId: row.get('issueId'),
    comment: row.get('comment'),
    user: row.get('user'),
    date: row.get('date'),
    datasetVersion: row.get('datasetVersion'),
    marksAsResolved: parseIssueResolved(row.get('marksAsResolved')),
  }
}

export function parseIssueRow(row: GoogleSpreadsheetRow<TrackCorrection>): TrackCorrection {
  return {
    workspaceLink: row.get('workspaceLink'),
    source: row.get('source'),
    issueId: row.get('issueId'),
    vesselId: row.get('vesselId'),
    vesselName: row.get('vesselName'),
    startDate: row.get('startDate'),
    endDate: row.get('endDate'),
    type: row.get('type'),
    lastUpdated: row.get('lastUpdated'),
    resolved: parseIssueResolved(row.get('resolved')),
    lat: parseFloat(row.get('lat')),
    lon: parseFloat(row.get('lon')),
    zoom: parseFloat(row.get('zoom')),
  }
}

export const getSheetTab = (title: string, spreadsheetDoc: GoogleSpreadsheet) => {
  const sheet = spreadsheetDoc.sheetsByTitle[title]
  if (!sheet) {
    throw new Error(`Spreadsheet tab (${title}) not found in spreadsheet.`)
  }
  return sheet
}
