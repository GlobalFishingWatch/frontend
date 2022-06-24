import ReactGA from 'react-ga'
import { DateTime } from 'luxon'
import { AppState } from 'types/redux.types'

export type WorkspaceEnv = 'development' | 'production'
export const API_VERSION = 'v2'

export const WORKSPACE_ENV =
  (process.env.NEXT_PUBLIC_WORKSPACE_ENV as WorkspaceEnv) ||
  (process.env.NODE_ENV as WorkspaceEnv) ||
  'production'
export const IS_PRODUCTION = WORKSPACE_ENV === 'production'
export const FLY_EFFECTS = {
  noFly: 0, // just change the center
  softFly: 1, // fly to without effects
  fly: 2, // nice fly to moving the camera
}
// enable / disable the effect for switch events in the map
export const ENABLE_FLYTO = FLY_EFFECTS.softFly //maybe we can move this to the settings
export const DEBUG_MODE =
  ((process.env.NEXT_PUBLIC_DEBUG_MODE ?? false) as boolean) ||
  (WORKSPACE_ENV === 'production' ? false : true)

export const FULL_SUFIX = 'full'
export const WORKSPACE_START_DATE = new Date()
WORKSPACE_START_DATE.setMonth(WORKSPACE_START_DATE.getMonth() - 6)

export const FIRST_YEAR_OF_DATA = 2012
export const CURRENT_YEAR = new Date().getFullYear()

export const DEFAULT_VERSION = 'v1'
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
}

export const DEFAULT_EMPTY_VALUE = ' --- '

export const LAST_POSITION_LAYERS_PREFIX = 'last-position'

export const AUTHORIZED_PERMISSION = {
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
export const GOOGLE_UNIVERSAL_ANALYTICS_ID =
  process.env.NEXT_PUBLIC_GOOGLE_UNIVERSAL_ANALYTICS_ID || 'UA-56517380-5'
export const GOOGLE_UNIVERSAL_ANALYTICS_INIT_OPTIONS: ReactGA.InitializeOptions = IS_PRODUCTION
  ? {}
  : { debug: true }

export const FEEDBACK_EN = process.env.NEXT_PUBLIC_FEEDBACK_FORM_EN
export const FEEDBACK_FR = process.env.NEXT_PUBLIC_FEEDBACK_FORM_FR

export const RISK_SUMMARY_SETTINGS = {
  // Time range to use when calculating indicators
  timeRange: { years: 1 },
  showIndicatorIconEventCount:
    !!process.env.NEXT_PUBLIC_RISK_SUMMARY_SHOW_ICON_EVENTS_COUNT || false,
}
