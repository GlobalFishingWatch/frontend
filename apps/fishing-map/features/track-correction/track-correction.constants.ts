const TURNING_TIDES_BRAZIL_ID = process.env.TURNING_TIDES_BRAZIL_ID || ''
const TURNING_TIDES_CHILE_ID = process.env.TURNING_TIDES_CHILE_ID || ''
const TURNING_TIDES_PERU_ID = process.env.TURNING_TIDES_PERU_ID || ''
const TURNING_TIDES_AIS_ID = process.env.TURNING_TIDES_AIS_ID || ''

export const TURNING_TIDES_WORKSPACES_IDS = [
  'tt-brazil-public',
  'tt-chile-public',
  'tt-peru-public',
  'tt_ais-public',
  'tt_ais_v_2_1-public',
  'tt_vms_v_2_1-public',
] as const

export type TurningTidesWorkspaceId = (typeof TURNING_TIDES_WORKSPACES_IDS)[number]

export const TRACK_CORRECTION_SPREADSHEET_ID_BY_WORKSPACE: Record<TurningTidesWorkspaceId, string> =
  {
    'tt-brazil-public': TURNING_TIDES_BRAZIL_ID,
    'tt-chile-public': TURNING_TIDES_CHILE_ID,
    'tt-peru-public': TURNING_TIDES_PERU_ID,
    'tt_ais-public': TURNING_TIDES_AIS_ID,
    'tt_ais_v_2_1-public': TURNING_TIDES_AIS_ID,
    'tt_vms_v_2_1-public': TURNING_TIDES_AIS_ID,
  }
