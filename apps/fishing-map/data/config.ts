import ReactGA from 'react-ga'
import { DateTime } from 'luxon'
import { DataviewCategory, ThinningConfig } from '@globalfishingwatch/api-types'
import { TimebarGraphs, TimebarVisualisations } from 'types'

export const ROOT_DOM_ELEMENT = '__next'

export const SUPPORT_EMAIL = 'support@globalfishingwatch.org'
export const IS_PRODUCTION =
  process.env.NEXT_PUBLIC_WORKSPACE_ENV === 'production' || process.env.NODE_ENV === 'production'

// Never actually used?
export const API_GATEWAY = process.env.API_GATEWAY || process.env.NEXT_PUBLIC_API_GATEWAY || ''
export const CARRIER_PORTAL_URL =
  process.env.NEXT_PUBLIC_CARRIER_PORTAL_URL || 'https://carrier-portal.dev.globalfishingwatch.org'
export const LATEST_CARRIER_DATASET_ID =
  process.env.NEXT_PUBLIC_LATEST_CARRIER_DATASET_ID || 'carriers:latest'

export const GOOGLE_UNIVERSAL_ANALYTICS_ID = process.env.NEXT_PUBLIC_GOOGLE_UNIVERSAL_ANALYTICS_ID
export const GOOGLE_UNIVERSAL_ANALYTICS_INIT_OPTIONS: ReactGA.InitializeOptions = IS_PRODUCTION
  ? {}
  : { debug: true }

// TODO use it to retrieve it and store in workspace.default in deploy
export const API_VERSION = 'v2'
export const APP_NAME = 'fishing-map'
export const PUBLIC_SUFIX = 'public'
export const FULL_SUFIX = 'full'
export const USER_SUFIX = 'user'
export const PRIVATE_SUFIX = 'private'

// used when no url data and no workspace data
export const LAST_DATA_UPDATE = DateTime.fromObject(
  { hour: 0, minute: 0, second: 0 },
  { zone: 'utc' }
)
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

export const FIRST_YEAR_OF_DATA = 2012
export const CURRENT_YEAR = new Date().getFullYear()

export const DEFAULT_WORKSPACE = {
  ...DEFAULT_VIEWPORT,
  query: undefined,
  readOnly: false,
  daysFromLatest: undefined,
  sidebarOpen: true,
  availableStart: new Date(Date.UTC(FIRST_YEAR_OF_DATA, 0, 1)).toISOString(),
  availableEnd: new Date(Date.UTC(CURRENT_YEAR, 11, 31)).toISOString(),
  dataviewInstances: undefined,
  timebarVisualisation: TimebarVisualisations.HeatmapActivity,
  visibleEvents: 'all',
  timebarGraph: TimebarGraphs.None,
  bivariateDataviews: undefined,
  analysis: undefined,
}

export const EVENTS_COLORS: Record<string, string> = {
  encounterauthorized: '#FAE9A0',
  encounterauthorizedLabels: '#DCC76D',
  encounterpartially: '#F59E84',
  encounterunmatched: '#CE2C54',
  encounter: '#FAE9A0',
  loitering: '#cfa9f9',
  port_visit: '#99EEFF',
  fishing: '#6075A7',
  // fishing: '#C6D5E2',
  fishingLabels: '#163f89',
}

export enum ThinningLevels {
  Insane = 'Insane',
  VeryAggressive = 'VeryAggressive',
  Aggressive = 'aggressive',
  Default = 'default',
}

export const THINNING_LEVELS: Record<ThinningLevels, ThinningConfig> = {
  [ThinningLevels.Insane]: {
    'distance-fishing': 10000,
    'bearing-val-fishing': 20,
    'change-speed-fishing': 1000,
    'min-accuracy-fishing': 400,
    'distance-transit': 20000,
    'bearing-val-transit': 20,
    'change-speed-transit': 1000,
    'min-accuracy-transit': 800,
  },
  [ThinningLevels.VeryAggressive]: {
    'distance-fishing': 10000,
    'bearing-val-fishing': 10,
    'change-speed-fishing': 500,
    'min-accuracy-fishing': 100,
    'distance-transit': 20000,
    'bearing-val-transit': 10,
    'change-speed-transit': 500,
    'min-accuracy-transit': 200,
  },
  [ThinningLevels.Aggressive]: {
    'distance-fishing': 1000,
    'bearing-val-fishing': 5,
    'change-speed-fishing': 200,
    'min-accuracy-fishing': 50,
    'distance-transit': 2000,
    'bearing-val-transit': 5,
    'change-speed-transit': 200,
    'min-accuracy-transit': 100,
  },
  [ThinningLevels.Default]: {
    'distance-fishing': 500,
    'bearing-val-fishing': 1,
    'change-speed-fishing': 200,
    'min-accuracy-fishing': 30,
    'distance-transit': 500,
    'bearing-val-transit': 1,
    'change-speed-transit': 200,
    'min-accuracy-transit': 30,
  },
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

// Params to use replace instead of push for router history to make navigation easier
export const REPLACE_URL_PARAMS = ['latitude', 'longitude', 'zoom']

export const POPUP_CATEGORY_ORDER = [
  DataviewCategory.Activity,
  DataviewCategory.Detections,
  DataviewCategory.Events,
  DataviewCategory.Environment,
  DataviewCategory.Context,
]

export const FIT_BOUNDS_ANALYSIS_PADDING = 30
