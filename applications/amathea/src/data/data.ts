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
  gfw: 'gfw',
  user: 'user',
}

export const DATASET_SOURCE_OPTIONS = [
  { id: DATASET_SOURCE_IDS.gfw, label: 'Global Fishing Watch' },
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

export const TEST_DATAVIEW_MONTHLY_STATS: { [id: string]: GraphData[] } = {
  'dataview-62': [
    { date: '2018-01', value: 33.818 },
    { date: '2018-02', value: 32.976 },
    { date: '2018-03', value: 33.669 },
    { date: '2018-04', value: 33.961 },
    { date: '2018-05', value: 34.277 },
    { date: '2018-06', value: 34.283 },
    { date: '2018-07', value: 34.258 },
    { date: '2018-08', value: 34.173 },
    { date: '2018-09', value: 34.086 },
    { date: '2018-10', value: 33.995 },
    { date: '2018-11', value: 33.912 },
    { date: '2018-12', value: 33.828 },
    { date: '2019-01', value: 33.816 },
    { date: '2019-02', value: 33.786 },
    { date: '2019-03', value: 33.911 },
    { date: '2019-04', value: 33.998 },
    { date: '2019-05', value: 34.171 },
    { date: '2019-06', value: 34.254 },
    { date: '2019-07', value: 34.186 },
    { date: '2019-08', value: 34.176 },
    { date: '2019-09', value: 34.149 },
    { date: '2019-10', value: 34.046 },
    { date: '2019-11', value: 33.939 },
    { date: '2019-12', value: 33.864 },
  ],
  'dataview-48': [
    { date: '2018-01', value: 26.773 },
    { date: '2018-02', value: 26.126 },
    { date: '2018-03', value: 26.063 },
    { date: '2018-04', value: 26.513 },
    { date: '2018-05', value: 26.852 },
    { date: '2018-06', value: 27.095 },
    { date: '2018-07', value: 27.277 },
    { date: '2018-08', value: 27.869 },
    { date: '2018-09', value: 28.473 },
    { date: '2018-10', value: 28.491 },
    { date: '2018-11', value: 28.003 },
    { date: '2018-12', value: 27.077 },
    { date: '2019-01', value: 26.38 },
    { date: '2019-02', value: 26.129 },
    { date: '2019-03', value: 26.097 },
    { date: '2019-04', value: 26.608 },
    { date: '2019-05', value: 27.22 },
    { date: '2019-06', value: 27.739 },
    { date: '2019-07', value: 27.993 },
    { date: '2019-08', value: 28.519 },
    { date: '2019-09', value: 29.101 },
    { date: '2019-10', value: 29.039 },
    { date: '2019-11', value: 28.512 },
    { date: '2019-12', value: 27.731 },
  ],
}
