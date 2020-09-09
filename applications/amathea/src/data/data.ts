export const AOI_SOURCES = [
  { id: 'mpas', label: 'Marine Protected Areas' },
  { id: 'custom-shape', label: 'Custom Shape' },
]

export const MPAS = [
  { id: 'mpa1', label: 'Marine Protected Area 1' },
  { id: 'mpa2', label: 'Marine Protected Area 2' },
  { id: 'mpa3', label: 'Marine Protected Area 3' },
  { id: 'mpa4', label: 'Marine Protected Area 4' },
  { id: 'mpa5', label: 'Marine Protected Area 5' },
]

export const FLAG_FILTERS = [
  { id: 'AIA', label: 'Anguilla' },
  { id: 'CHN', label: 'China' },
  { id: 'COL', label: 'Colombia' },
  { id: 'ECU', label: 'Ecuador' },
]

export type DatasetSources = 'gfw' | 'user'
export const DATASET_SOURCE_IDS = {
  gfw: 'Global Fishing Watch',
  marineregions: 'Marine Regions',
  wdpa: 'World Database on Protected Areas (WDPA)',
  noaa: 'NOAA Physical Sciences Laboratory',
  copernicus: 'Copernicus Marine Service',
  nasa: 'NASA',
  user: 'user',
}

export const DATASET_SOURCE_OPTIONS = [
  { id: DATASET_SOURCE_IDS.gfw, label: 'Global Fishing Watch' },
  { id: DATASET_SOURCE_IDS.marineregions, label: 'Marine Regions' },
  { id: DATASET_SOURCE_IDS.wdpa, label: 'World Database on Protected Areas (WDPA)' },
  { id: DATASET_SOURCE_IDS.noaa, label: 'NOAA Physical Sciences Laboratory' },
  { id: DATASET_SOURCE_IDS.copernicus, label: 'Copernicus Marine Service' },
  { id: DATASET_SOURCE_IDS.nasa, label: 'NASA' },
  { id: DATASET_SOURCE_IDS.user, label: 'Your datasets' },
]

export const DATASET_TYPE_OPTIONS = [
  { id: 'user-context-layer:v1', label: 'Static Context Areas' },
  { id: 'user-tracks:v1', label: 'Spatiotemporal Tracks (Coming soon)' },
  { id: '4wings:v1', label: 'Spatiotemporal Grid (Coming soon)' },
]

export interface GraphData {
  date: string
  value: number
}

export const MONTHLY_DATES = [
  '2018-01',
  '2018-02',
  '2018-03',
  '2018-04',
  '2018-05',
  '2018-06',
  '2018-07',
  '2018-08',
  '2018-09',
  '2018-10',
  '2018-11',
  '2018-12',
  '2019-01',
  '2019-02',
  '2019-03',
  '2019-04',
  '2019-05',
  '2019-06',
  '2019-07',
  '2019-08',
  '2019-09',
  '2019-10',
  '2019-11',
  '2019-12',
]
