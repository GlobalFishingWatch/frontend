import type { GoogleSpreadsheetRow } from 'google-spreadsheet'

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
    issueId: row.get('issueId'),
    vesselId: row.get('vesselId'),
    startDate: row.get('startDate'),
    endDate: row.get('endDate'),
    type: row.get('type'),
    createdAt: row.get('createdAt'),
    lastUpdated: row.get('lastUpdated'),
    resolved: parseIssueResolved(row.get('resolved')),
    lat: row.get('lat'),
    lon: row.get('lon'),
  }
}
