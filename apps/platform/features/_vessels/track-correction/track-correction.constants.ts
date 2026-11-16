export const TURNING_TIDES_WORKSPACES_IDS = [
  'tt-brazil-public',
  'tt-chile-public',
  'tt-peru-public',
  'tt_ais-public',
  'tt_ais_v_2_1-public',
  'tt_vms_v_2_1-public',
] as const

export type TurningTidesWorkspaceId = (typeof TURNING_TIDES_WORKSPACES_IDS)[number]
