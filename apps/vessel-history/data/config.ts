import { DateTime } from 'luxon'
import { ThinningConfig } from '@globalfishingwatch/api-types'
import { ThinningLevels, THINNING_LEVELS } from '@globalfishingwatch/api-client'
import { AppState } from 'types/redux.types'
import { TimebarGraphs } from 'types'

export type WorkspaceEnv = 'development' | 'production'
export const API_VERSION = 'v2'

export const WORKSPACE_ENV =
  (process.env.NEXT_PUBLIC_WORKSPACE_ENV as WorkspaceEnv) ||
  (process.env.NODE_ENV as WorkspaceEnv) ||
  'production'
export const IS_PRODUCTION =
  process.env.NEXT_PUBLIC_WORKSPACE_ENV === 'production' || process.env.NODE_ENV === 'production'

export const FLY_EFFECTS = {
  noFly: 0, // just change the center
  softFly: 1, // fly to without effects
  fly: 2, // nice fly to moving the camera
}
// enable / disable the effect for switch events in the map
export const ENABLE_FLYTO = FLY_EFFECTS.noFly //maybe we can move this to the settings
export const DEBUG_MODE =
  ((process.env.NEXT_PUBLIC_DEBUG_MODE ?? false) as boolean) ||
  (WORKSPACE_ENV === 'production' ? false : true)

export const FULL_SUFIX = 'full'
export const WORKSPACE_START_DATE = new Date()
WORKSPACE_START_DATE.setMonth(WORKSPACE_START_DATE.getMonth() - 6)

export const FIRST_YEAR_OF_DATA = 2012
export const LAST_YEAR_FORCED_LABOR = 2020
export const CURRENT_YEAR = new Date().getFullYear()

export const DEFAULT_WORKSPACE: AppState = {
  zoom: 3,
  colorMode: 'all',
  minSpeed: 0,
  maxSpeed: 12,
  minElevation: -4000,
  maxElevation: 500,
  fromHour: 0,
  toHour: 24,
  latitude: -25.54035,
  fishingPositions: 15,
  longitude: -35.97144,
  project: '1',
  start: WORKSPACE_START_DATE.toISOString(),
  end: DateTime.utc().toISO(),
  timebarMode: 'speed',
  filterMode: 'speed',
  minDistanceFromPort: 0,
  maxDistanceFromPort: 10000,
  importView: false,
  satellite: '',
  availableStart: new Date(Date.UTC(FIRST_YEAR_OF_DATA, 0, 1)).toISOString(),
  availableEnd: new Date(Date.UTC(CURRENT_YEAR, 11, 31)).toISOString(),
  profileView: undefined,
  timebarGraph: TimebarGraphs.None,
}

export const DEFAULT_VIEWPORT = {
  latitude: 26,
  longitude: 12,
  zoom: 1,
}

export const DEFAULT_VESSEL_MAP_ZOOM = 8

export const EVENTS_COLORS: Record<string, string> = {
  encounterauthorized: '#FAE9A0',
  encounterauthorizedLabels: '#DCC76D',
  encounterpartially: '#F59E84',
  encounterunmatched: '#CE2C54',
  encounter: '#FAE9A0',
  loitering: '#cfa9f9',
  port: '#99EEFF',
  port_visit: '#99EEFF',
  fishing: '#fff',
  fishingLabels: '#163f89',
  gap: '#f7b500',
}

export const DEFAULT_EMPTY_VALUE = ' --- '

export const LAST_POSITION_LAYERS_PREFIX = 'last-position'

export const PORT_INSPECTOR_PERMISSION = {
  type: 'application',
  value: 'vessel-viewer',
  action: 'ui.load',
}
export const INSURER_PERMISSION = {
  type: 'application',
  value: 'risk-assessment',
  action: 'ui.load',
}

// forced laboud risk model permission
export const FLRM_PERMISSION = {
  type: 'vessel-info',
  value: 'forced-labour',
  action: 'read',
}

export const RISK_SUMMARY_IDENTITY_INDICATORS_PERMISSION = {
  type: 'vessel-info',
  value: 'risk-summary.identity.indicators',
  action: 'read',
}

export const DOWNLOAD_ACTIVITY_PERMISSION = {
  type: 'vessel-info',
  value: 'events-activity',
  action: 'download',
}

export const GOOGLE_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID || 'G-R3PWRQW70G'
export const GOOGLE_TAG_MANAGER_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID || 'GTM-KK5ZFST'

export const FEEDBACK_EN = process.env.NEXT_PUBLIC_FEEDBACK_FORM_EN
export const FEEDBACK_FR = process.env.NEXT_PUBLIC_FEEDBACK_FORM_FR

export const AIS_DATA_DELAY_DAYS = 3
export const RISK_SUMMARY_SETTINGS = {
  // Time range to use when calculating indicators
  timeRange: { years: 1 },
  showIndicatorIconEventCount:
    !!process.env.NEXT_PUBLIC_RISK_SUMMARY_SHOW_ICON_EVENTS_COUNT || false,
}

export const APP_PROFILE_VIEWS = [
  {
    id: 'port-inspector',
    name: 'Port Inspector',
    required_permission: PORT_INSPECTOR_PERMISSION,
    propagate_events_query_params: ['confidences'],
    events_query_params: {
      start_date: undefined,
    },
  },
  {
    id: 'insurance-underwriter',
    name: 'Insurance Underwriter',
    required_permission: INSURER_PERMISSION,
    propagate_events_query_params: ['confidences'],
    events_query_params: {
      start_date: DateTime.utc().minus({ months: 12 }).toISO(),
    },
  },
]

export const DEFAULT_PAGINATION_PARAMS = {
  limit: 99999,
  offset: 0,
}

export const THINNING_LEVEL_BY_ZOOM: Record<
  number,
  { user: ThinningConfig; guest: ThinningConfig }
> = {
  0: {
    user: THINNING_LEVELS[ThinningLevels.Insane],
    guest: THINNING_LEVELS[ThinningLevels.Insane],
  },
  3: {
    user: THINNING_LEVELS[ThinningLevels.VeryAggressive],
    guest: THINNING_LEVELS[ThinningLevels.VeryAggressive],
  },
  6: {
    user: THINNING_LEVELS[ThinningLevels.Default],
    guest: THINNING_LEVELS[ThinningLevels.Aggressive],
  },
}

export const THINNING_LEVEL_ZOOMS = Object.keys(THINNING_LEVEL_BY_ZOOM) as unknown as number[]
