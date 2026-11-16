import { JWT } from 'google-auth-library'
import { GoogleSpreadsheet } from 'google-spreadsheet'

import type { TurningTidesWorkspaceId } from '../../../features/_vessels/track-correction/track-correction.constants'
import { serverEnv } from '../../env.server'

const FEEDBACK_CLIENT_EMAIL = serverEnv.SPREADSHEET_CLIENT_EMAIL
const FEEDBACK_PRIVATE_KEY = serverEnv.SPREADSHEET_PRIVATE_KEY

const TRACK_CORRECTION_SPREADSHEET_ID_BY_WORKSPACE: Record<
  TurningTidesWorkspaceId,
  string | undefined
> = {
  'tt-brazil-public': serverEnv.TURNING_TIDES_BRAZIL_ID,
  'tt-chile-public': serverEnv.TURNING_TIDES_CHILE_ID,
  'tt-peru-public': serverEnv.TURNING_TIDES_PERU_ID,
  'tt_ais-public': serverEnv.TURNING_TIDES_AIS_ID,
  'tt_ais_v_2_1-public': serverEnv.TURNING_TIDES_AIS_ID,
  'tt_vms_v_2_1-public': serverEnv.TURNING_TIDES_AIS_ID,
}

export const loadSpreadsheetDoc = async (id: string | undefined) => {
  if (!id) {
    throw new Error('Spreadsheet id is missing')
  }
  if (!FEEDBACK_CLIENT_EMAIL || !FEEDBACK_PRIVATE_KEY) {
    throw new Error('Spreadsheet service account email/key/id missing')
  }

  const serviceAccountAuth = new JWT({
    email: FEEDBACK_CLIENT_EMAIL,
    key: FEEDBACK_PRIVATE_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })
  const spreadsheetDoc = new GoogleSpreadsheet(id, serviceAccountAuth)
  await spreadsheetDoc.loadInfo()
  return spreadsheetDoc
}

export const loadSpreadsheetDocByWorkspace = async (workspaceId: string) => {
  const spreadsheetId =
    TRACK_CORRECTION_SPREADSHEET_ID_BY_WORKSPACE[
      workspaceId as keyof typeof TRACK_CORRECTION_SPREADSHEET_ID_BY_WORKSPACE
    ]
  if (!spreadsheetId) {
    throw new Error(`Spreadsheet ID not found for workspace ${workspaceId}`)
  }

  const spreadsheetDoc = await loadSpreadsheetDoc(spreadsheetId)
  return spreadsheetDoc
}
