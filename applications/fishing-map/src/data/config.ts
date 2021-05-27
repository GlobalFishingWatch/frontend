import ReactGA from 'react-ga'
import { DataviewCategory } from '@globalfishingwatch/api-types/dist'
import { TimebarEvents, TimebarGraphs, TimebarVisualisations } from 'types'

export const SUPPORT_EMAIL = 'support@globalfishingwatch.org'
export const IS_PRODUCTION =
  (process.env.REACT_APP_WORKSPACE_ENV || process.env.NODE_ENV) === 'production'

export const API_GATEWAY = process.env.API_GATEWAY || process.env.REACT_APP_API_GATEWAY || ''
export const CARRIER_PORTAL_URL =
  process.env.REACT_APP_CARRIER_PORTAL_URL || 'https://carrier-portal.dev.globalfishingwatch.org'

export const GOOGLE_UNIVERSAL_ANALYTICS_ID = process.env.REACT_APP_GOOGLE_UNIVERSAL_ANALYTICS_ID
export const GOOGLE_UNIVERSAL_ANALYTICS_INIT_OPTIONS: ReactGA.InitializeOptions = IS_PRODUCTION
  ? {}
  : { debug: true }

// TODO use it to retrieve it and store in workspace.default in deploy
export const DEFAULT_VERSION = 'v1'
export const APP_NAME = 'fishing-map'
export const PUBLIC_SUFIX = 'public'
export const FULL_SUFIX = 'full'

// used when no url data and no workspace data
const now = new Date()
const end = new Date(Date.UTC(now.getFullYear(), 11, 31)).toISOString()

export const DEFAULT_VIEWPORT = {
  latitude: 26,
  longitude: 12,
  zoom: 1,
}
export const DEFAULT_TIME_RANGE = {
  start: new Date(Date.UTC(2018, 0, 1)).toISOString(),
  end,
}

export const DEFAULT_ACTIVITY_CATEGORY = 'fishing'

export const DEFAULT_WORKSPACE = {
  ...DEFAULT_VIEWPORT,
  query: undefined,
  sidebarOpen: true,
  availableStart: new Date(Date.UTC(2012, 0, 1)).toISOString(),
  availableEnd: end,
  dataviewInstances: undefined,
  timebarVisualisation: TimebarVisualisations.Heatmap,
  timebarEvents: TimebarEvents.None,
  timebarGraph: TimebarGraphs.None,
  bivariateDataviews: undefined,
  analysis: undefined,
  activityCategory: DEFAULT_ACTIVITY_CATEGORY,
  version: DEFAULT_VERSION,
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
