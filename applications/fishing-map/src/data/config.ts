import { SelectOption } from '@globalfishingwatch/ui-components'

export const DEFAULT_WORKSPACE = {
  latitude: 0,
  longitude: 0,
  zoom: 1,
  start: new Date(2019, 0, 1).toISOString(),
  end: new Date(2019, 1, 1).toISOString(),
  availableStart: new Date(2012, 0, 1).toISOString(),
  availableEnd: new Date().toISOString(),
  dataviews: undefined,
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

export const flags: SelectOption[] = [
  { id: 'AIA', label: 'Anguilla' },
  { id: 'CHN', label: 'China' },
  { id: 'COL', label: 'Colombia' },
  { id: 'ECU', label: 'Ecuador' },
]
