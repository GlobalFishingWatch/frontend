import { DataviewCategory } from '@globalfishingwatch/api-types/dist'
import { SelectOption } from '@globalfishingwatch/ui-components'
import { TimebarEvents, TimebarGraphs, TimebarVisualisations } from 'types'

export const SUPPORT_EMAIL = 'support@globalfishingwatch.org'

export const API_GATEWAY = process.env.API_GATEWAY || process.env.REACT_APP_API_GATEWAY || ''
export const CARRIER_PORTAL_URL =
  process.env.REACT_APP_CARRIER_PORTAL_URL || 'https://carrier-portal.dev.globalfishingwatch.org'

// TODO use it to retrieve it and store in workspace.default in deploy
export const DEFAULT_VERSION = 'v1'
export const APP_NAME = 'fishing-map'
export const PUBLIC_SUFIX = 'public'

// used when no url data and no workspace data
const now = new Date()
const end = new Date(
  Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes())
).toISOString()

export const DEFAULT_VIEWPORT = {
  latitude: 15,
  longitude: 21,
  zoom: 0,
}
export const DEFAULT_TIME_RANGE = {
  start: new Date(Date.UTC(2019, 0, 1)).toISOString(),
  end: end,
}
export const DEFAULT_WORKSPACE = {
  ...DEFAULT_VIEWPORT,
  ...DEFAULT_TIME_RANGE,
  query: undefined,
  sidebarOpen: true,
  availableStart: new Date(Date.UTC(2012, 0, 1)).toISOString(),
  availableEnd: end,
  dataviewInstances: undefined,
  timebarVisualisation: TimebarVisualisations.Heatmap,
  timebarEvents: TimebarEvents.None,
  timebarGraph: TimebarGraphs.None,
  bivariate: false,
  analysis: undefined,
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

export const sources: SelectOption[] = [
  {
    id: 'ais',
    label: 'AIS',
  },
  {
    id: 'vms-chile',
    label: 'VMS Chile',
  },
  {
    id: 'vms-indonesia',
    label: 'VMS Indonesia',
  },
  {
    id: 'vms-panama',
    label: 'VMS Panama',
  },
]

// TODO translate this
export const TIMEBAR_EVENT_OPTIONS: SelectOption[] = [
  {
    id: 'all',
    label: 'All events',
  },
  {
    id: 'fishing',
    label: 'Fishing',
  },
  {
    id: 'encounters',
    label: 'Encounters',
  },
  {
    id: 'loitering',
    label: 'Loitering',
  },
  {
    id: 'ports',
    label: 'Port visits',
  },
  {
    id: 'none',
    label: 'None',
  },
]

// TODO translate this
export const TIMEBAR_GRAPH_OPTIONS: SelectOption[] = [
  {
    id: 'speed',
    label: 'Speed',
  },
  {
    id: 'depth',
    label: 'Depth (Coming soon)',
    disabled: true,
  },
  {
    id: 'none',
    label: 'None',
  },
]

export const POPUP_CATEGORY_ORDER = [
  DataviewCategory.Activity,
  DataviewCategory.Events,
  DataviewCategory.Environment,
  DataviewCategory.Context,
]
