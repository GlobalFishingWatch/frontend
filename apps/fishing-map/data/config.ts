import { DateTime } from 'luxon'
import { DataviewCategory, ThinningConfig } from '@globalfishingwatch/api-types'
import { ThinningLevels, THINNING_LEVELS } from '@globalfishingwatch/api-client'
import { AppState, TimebarGraphs, TimebarVisualisations, UserTab, WorkspaceState } from 'types'
import { getUTCDateTime } from 'utils/dates'

export const ROOT_DOM_ELEMENT = '__next'

export const SUPPORT_EMAIL = 'support@globalfishingwatch.org'

export const IS_DEVELOPMENT_ENV = process.env.NODE_ENV === 'development'
export const IS_PRODUCTION_BUILD = process.env.NODE_ENV === 'production'
export const PUBLIC_WORKSPACE_ENV = process.env.NEXT_PUBLIC_WORKSPACE_ENV
export const IS_PRODUCTION_WORKSPACE_ENV =
  PUBLIC_WORKSPACE_ENV === 'production' || PUBLIC_WORKSPACE_ENV === 'staging'
export const IS_PRODUCTION = IS_PRODUCTION_WORKSPACE_ENV || IS_PRODUCTION_BUILD
export const PATH_BASENAME = process.env.NEXT_PUBLIC_URL || (IS_PRODUCTION ? '/map' : '')

export const REPORT_DAYS_LIMIT =
  typeof process.env.NEXT_PUBLIC_REPORT_DAYS_LIMIT !== 'undefined'
    ? parseInt(process.env.NEXT_PUBLIC_REPORT_DAYS_LIMIT)
    : 366 // 1 year

// Never actually used?
export const API_GATEWAY = process.env.API_GATEWAY || process.env.NEXT_PUBLIC_API_GATEWAY || ''
export const CARRIER_PORTAL_API_URL =
  process.env.NEXT_PUBLIC_CARRIER_PORTAL_API_URL || 'https://gateway.api.globalfishingwatch.org'
export const CARRIER_PORTAL_URL =
  process.env.NEXT_PUBLIC_CARRIER_PORTAL_URL || 'https://carrier-portal.globalfishingwatch.org'
export const LATEST_CARRIER_DATASET_ID =
  process.env.NEXT_PUBLIC_LATEST_CARRIER_DATASET_ID || 'carriers:latest'

export const GOOGLE_TAG_MANAGER_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID
export const GOOGLE_MEASUREMENT_ID = process.env.NEXT_PUBLIC_NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID

export const REPORT_VESSELS_PER_PAGE = 10
export const REPORT_SHOW_MORE_VESSELS_PER_PAGE = REPORT_VESSELS_PER_PAGE * 5
export const REPORT_VESSELS_GRAPH_GEARTYPE = 'geartype'
export const REPORT_VESSELS_GRAPH_VESSELTYPE = 'vesselType'
export const REPORT_VESSELS_GRAPH_FLAG = 'flag'
export const REPORT_ACTIVITY_GRAPH_EVOLUTION = 'evolution'
export const REPORT_ACTIVITY_GRAPH_BEFORE_AFTER = 'beforeAfter'
export const REPORT_ACTIVITY_GRAPH_PERIOD_COMPARISON = 'periodComparison'

// TODO use it to retrieve it and store in workspace.default in deploy
export const APP_NAME = 'fishing-map'
export const PUBLIC_SUFIX = 'public'
export const FULL_SUFIX = 'full'
export const USER_SUFIX = 'user'
export const PRIVATE_SUFIX = 'private'

export const DEFAULT_DATA_DELAY_DAYS = 3
// used when no url data and no workspace data
const LAST_DATA_UPDATE = DateTime.fromObject({ hour: 0, minute: 0, second: 0 }, { zone: 'utc' })
  .minus({ days: DEFAULT_DATA_DELAY_DAYS })
  .toISO() as string

export const DEFAULT_VIEWPORT = {
  zoom: 1.5,
  latitude: 19,
  longitude: 26,
}

export const DEFAULT_WORKSPACE_LIST_VIEWPORT = {
  latitude: 10,
  longitude: -90,
  zoom: 1,
}

export const DEFAULT_TIME_RANGE = {
  start: getUTCDateTime(LAST_DATA_UPDATE)?.minus({ months: 3 }).toISO() as string,
  end: LAST_DATA_UPDATE,
}

export const DEFAULT_PAGINATION_PARAMS = {
  limit: 999999,
  offset: 0,
}

export const BUFFER_PREVIEW_COLOR = '#F95E5E'

export const DEFAULT_ACTIVITY_CATEGORY = 'fishing'

export const FIRST_YEAR_OF_DATA = 2012
export const CURRENT_YEAR = new Date().getFullYear()

export const AVAILABLE_START = new Date(Date.UTC(FIRST_YEAR_OF_DATA, 0, 1)).toISOString() as string
export const AVAILABLE_END = new Date(Date.UTC(CURRENT_YEAR, 11, 31)).toISOString() as string

export const DEFAULT_WORKSPACE: WorkspaceState & AppState = {
  ...DEFAULT_VIEWPORT,
  readOnly: false,
  daysFromLatest: undefined,
  sidebarOpen: true,
  mapAnnotationsVisible: true,
  mapRulersVisible: true,
  dataviewInstances: undefined,
  timebarVisualisation: TimebarVisualisations.HeatmapActivity,
  visibleEvents: 'all',
  timebarGraph: TimebarGraphs.None,
  bivariateDataviews: undefined,
  reportActivityGraph: REPORT_ACTIVITY_GRAPH_EVOLUTION,
  reportCategory: undefined,
  reportVesselFilter: '',
  reportVesselGraph: REPORT_VESSELS_GRAPH_FLAG,
  reportVesselPage: 0,
  reportResultsPerPage: REPORT_VESSELS_PER_PAGE,
  userTab: UserTab.Info,
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

export const FIT_BOUNDS_REPORT_PADDING = 30
