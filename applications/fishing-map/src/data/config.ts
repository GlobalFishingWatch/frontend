import { DataviewCategory } from '@globalfishingwatch/api-types/dist'
import { SelectOption } from '@globalfishingwatch/ui-components/dist/select'
import { ChoiceOption } from '@globalfishingwatch/ui-components/dist/choice'
import { TimebarEvents, TimebarGraphs, TimebarVisualisations } from 'types'
import { t } from 'features/i18n/i18n'

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
  latitude: 26,
  longitude: 12,
  zoom: 1,
}
export const DEFAULT_TIME_RANGE = {
  start: new Date(Date.UTC(2018, 0, 1)).toISOString(),
  end: end,
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
  bivariate: false,
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

export const ACTIVITY_OPTIONS: ChoiceOption[] = [
  {
    id: 'fishing',
    title: t('common.fishing', 'Fishing'),
  },
  {
    id: 'presence',
    title: t('common.presence', 'Presence'),
  },
]

export const TIMEBAR_EVENT_OPTIONS: SelectOption[] = [
  {
    id: 'all',
    label: t('timebarSettings.eventOptions', 'All events'),
  },
  {
    id: 'fishing',
    label: t('timebarSettings.eventOptions', 'Fishing'),
  },
  {
    id: 'encounters',
    label: t('timebarSettings.eventOptions', 'Encounters'),
  },
  {
    id: 'loitering',
    label: t('timebarSettings.eventOptions', 'Loitering'),
  },
  {
    id: 'ports',
    label: t('timebarSettings.eventOptions', 'Port visits'),
  },
  {
    id: 'none',
    label: t('timebarSettings.eventOptions', 'None'),
  },
]

export const TIMEBAR_GRAPH_OPTIONS: SelectOption[] = [
  {
    id: 'speed',
    label: t('timebarSettings.graphOptions.speed', 'Speed'),
  },
  {
    id: 'depth',
    label: t('timebarSettings.graphOptions.depth', 'Depth (Coming soon)'),
    disabled: true,
  },
  {
    id: 'none',
    label: t('timebarSettings.graphOptions.none', 'None'),
  },
]

export const POPUP_CATEGORY_ORDER = [
  DataviewCategory.Fishing,
  DataviewCategory.Presence,
  DataviewCategory.Events,
  DataviewCategory.Environment,
  DataviewCategory.Context,
]
