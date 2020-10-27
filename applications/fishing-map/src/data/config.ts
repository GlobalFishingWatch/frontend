import { TimebarEvents, TimebarGraphs } from 'types'
import { SelectOption } from '@globalfishingwatch/ui-components'

// used when no url data and no workspace data
export const FALLBACK_VIEWPORT = {
  latitude: 7,
  longitude: -75,
  zoom: 3,
}

// TODO use it to retrieve it and store in workspace.default in deploy
export const DEFAULT_WORKSPACE_ID = 31
export const DEFAULT_WERSION = 'v1'

// TODO rethink this as most of the values comes from the workspace now
export const DEFAULT_WORKSPACE = {
  latitude: undefined,
  longitude: undefined,
  zoom: undefined,
  query: undefined,
  sidebarOpen: true,
  start: undefined,
  end: undefined,
  availableStart: new Date(2012, 0, 1).toISOString(),
  availableEnd: new Date().toISOString(),
  dataviewInstances: undefined,
  fishingFilters: [],
  timebarVisualisation: undefined,
  timebarEvents: TimebarEvents.None,
  timebarGraph: TimebarGraphs.None,
  bivariate: false,
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

export const TIMEBAR_GRAPH_OPTIONS: SelectOption[] = [
  {
    id: 'speed',
    label: 'Speed',
  },
  {
    id: 'depth',
    label: 'Depth',
  },
  {
    id: 'none',
    label: 'None',
  },
]
