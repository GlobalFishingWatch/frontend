const TEMPLATE_SPREADSHEET_ID = process.env.NEXT_TURNING_TIDES_TEMPLATE_SPREADSHEET_ID || ''

export const TURNING_TIDES_WORKSPACES_IDS = ['turning_tides_testing-user-public'] as const

export type TurningTidesWorkspaceId = (typeof TURNING_TIDES_WORKSPACES_IDS)[number]

export const TRACK_CORRECTION_SPREADSHEET_ID_BY_WORKSPACE: Record<TurningTidesWorkspaceId, string> =
  {
    'turning_tides_testing-user-public': TEMPLATE_SPREADSHEET_ID,
  }
