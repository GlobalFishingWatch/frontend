import ReactGA from 'react-ga'
import { DateTime } from 'luxon'
import { DataviewCategory } from '@globalfishingwatch/api-types/dist'
import { TimebarGraphs, TimebarVisualisations } from 'types'

export const SUPPORT_EMAIL = 'support@globalfishingwatch.org'
export const IS_PRODUCTION =
  (process.env.REACT_APP_WORKSPACE_ENV || process.env.NODE_ENV) === 'production'

export const API_GATEWAY = process.env.API_GATEWAY || process.env.REACT_APP_API_GATEWAY || ''
export const CARRIER_PORTAL_URL =
  process.env.REACT_APP_CARRIER_PORTAL_URL || 'https://carrier-portal.dev.globalfishingwatch.org'
export const LATEST_CARRIER_DATASET_ID =
  process.env.REACT_APP_LATEST_CARRIER_DATASET_ID || 'carriers:latest'

export const GOOGLE_UNIVERSAL_ANALYTICS_ID = process.env.REACT_APP_GOOGLE_UNIVERSAL_ANALYTICS_ID
export const GOOGLE_UNIVERSAL_ANALYTICS_INIT_OPTIONS: ReactGA.InitializeOptions = IS_PRODUCTION
  ? {}
  : { debug: true }

// TODO use it to retrieve it and store in workspace.default in deploy
export const DEFAULT_VERSION = 'v1'
export const APP_NAME = 'fishing-map'
export const PUBLIC_SUFIX = 'public'
export const FULL_SUFIX = 'full'
export const PRIVATE_SUFIX = 'private'

// used when no url data and no workspace data
export const LAST_DATA_UPDATE = DateTime.fromObject({ hour: 0, minute: 0, second: 0, zone: 'utc' })
  .minus({ days: 3 })
  .toISO()

export const DEFAULT_VIEWPORT = {
  zoom: 1.5,
  latitude: 19,
  longitude: 26,
}
export const DEFAULT_TIME_RANGE = {
  start: DateTime.fromISO(LAST_DATA_UPDATE).minus({ months: 3 }).toISO(),
  end: LAST_DATA_UPDATE,
}

export const DEFAULT_ACTIVITY_CATEGORY = 'fishing'

export const DEFAULT_WORKSPACE = {
  ...DEFAULT_VIEWPORT,
  query: undefined,
  readOnly: false,
  daysFromLatest: undefined,
  sidebarOpen: true,
  availableStart: new Date(Date.UTC(2012, 0, 1)).toISOString(),
  availableEnd: new Date(Date.UTC(new Date().getFullYear(), 11, 31)).toISOString(),
  dataviewInstances: undefined,
  timebarVisualisation: TimebarVisualisations.Heatmap,
  visibleEvents: 'all',
  timebarGraph: TimebarGraphs.None,
  bivariateDataviews: undefined,
  analysis: undefined,
  activityCategory: DEFAULT_ACTIVITY_CATEGORY,
  version: DEFAULT_VERSION,
}

export const EVENTS_COLORS: Record<string, string> = {
  encounterauthorized: '#FAE9A0',
  encounterauthorizedLabels: '#DCC76D',
  encounterpartially: '#F59E84',
  encounterunmatched: '#CE2C54',
  encounter: '#FAE9A0',
  loitering: '#cfa9f9',
  port: '#99EEFF',
  fishing: '#fff',
  fishingLabels: '#163f89',
}

export enum ThinningLevels {
  Aggressive = 'aggressive',
  Default = 'default',
}

export const THINNING_LEVELS = {
  [ThinningLevels.Aggressive]: {
    distanceFishing: 1000,
    bearingValFishing: 5,
    changeSpeedFishing: 200,
    minAccuracyFishing: 50,
    distanceTransit: 2000,
    bearingValTransit: 5,
    changeSpeedTransit: 200,
    minAccuracyTransit: 100,
  },
  [ThinningLevels.Default]: {
    distanceFishing: 500,
    bearingValFishing: 1,
    changeSpeedFishing: 200,
    minAccuracyFishing: 30,
    distanceTransit: 500,
    bearingValTransit: 1,
    changeSpeedTransit: 200,
    minAccuracyTransit: 30,
  },
}

// Params to use replace instead of push for router history to make navigation easier
export const REPLACE_URL_PARAMS = ['latitude', 'longitude', 'zoom']

export const POPUP_CATEGORY_ORDER = [
  DataviewCategory.Fishing,
  DataviewCategory.Presence,
  DataviewCategory.Events,
  DataviewCategory.Environment,
  DataviewCategory.Context,
]
