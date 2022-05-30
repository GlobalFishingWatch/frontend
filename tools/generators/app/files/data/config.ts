import { DateObject, DateTime } from 'luxon'
import ReactGA from 'react-ga'

export type WorkspaceEnv = 'development' | 'production'
export const WORKSPACE_ENV =
  (process.env.NEXT_PUBLIC_WORKSPACE_ENV as WorkspaceEnv) ||
  (process.env.NODE_ENV as WorkspaceEnv) ||
  'production'
export const IS_PRODUCTION = WORKSPACE_ENV === 'production'

export const ROOT_DOM_ELEMENT = '__next'

export const GOOGLE_UNIVERSAL_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_UNIVERSAL_ANALYTICS_ID
export const GOOGLE_UNIVERSAL_ANALYTICS_INIT_OPTIONS: ReactGA.InitializeOptions = IS_PRODUCTION
  ? {}
  : { debug: true }

// Params to use replace instead of push for router history to make navigation easier
export const REPLACE_URL_PARAMS = ['latitude', 'longitude', 'zoom']

export const FIRST_YEAR_OF_DATA = 2012
export const CURRENT_YEAR = new Date().getFullYear()
export const DEFAULT_WORKSPACE = {
  latitude: 0,
  longitude: 0,
  zoom: 1,
  start: '2017-01-01T00:00:00.000Z',
  end: new Date().toISOString(),
  availableStart: new Date(Date.UTC(FIRST_YEAR_OF_DATA, 0, 1)).toISOString(),
  availableEnd: new Date(Date.UTC(CURRENT_YEAR, 11, 31)).toISOString(),
}

export const DEFAULT_VIEWPORT = {
  zoom: 1.5,
  latitude: 19,
  longitude: 26,
}
