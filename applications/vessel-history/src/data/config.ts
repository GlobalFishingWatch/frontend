import { DateTime } from 'luxon'
import { AppState } from 'types/redux.types'

export type WorkspaceEnv = 'development' | 'production'
export const WORKSPACE_ENV =
  (process.env.REACT_APP_WORKSPACE_ENV as WorkspaceEnv) ||
  (process.env.NODE_ENV as WorkspaceEnv) ||
  'production'

export const FLY_EFFECTS = {
  noFly: 0, // just change the center
  softFly: 1, // fly to without effects
  fly: 2 // nice fly to moving the camera
}
// enable / disable the effect for switch events in the map
export const ENABLE_FLYTO = FLY_EFFECTS.fly
export const DEBUG_MODE =
  ((process.env.REACT_APP_DEBUG_MODE ?? false) as boolean) ||
  (WORKSPACE_ENV === 'production' ? false : true)

export const FULL_SUFIX = 'full'

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
  start: '2017-12-01T00:00:00.000Z',
  end: DateTime.utc().toISO(),
  timebarMode: 'speed',
  filterMode: 'speed',
  minDistanceFromPort: 0,
  maxDistanceFromPort: 10000,
  importView: false,
  satellite: '',
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
