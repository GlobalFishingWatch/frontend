import { SelectOption } from '@globalfishingwatch/ui-components'

// used when no url data and no workspace data
export const FALLBACK_VIEWPORT = {
  latitude: 7,
  longitude: -75,
  zoom: 3,
}

export const DEFAULT_WERSION = 'v1'

export const DEFAULT_WORKSPACE = {
  latitude: undefined,
  longitude: undefined,
  zoom: undefined,
  query: undefined,
  start: new Date(2019, 0, 1).toISOString(),
  end: new Date(2019, 1, 1).toISOString(),
  availableStart: new Date(2012, 0, 1).toISOString(),
  availableEnd: new Date().toISOString(),
  dataviewInstances: undefined,
  fishingFilters: [],
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
