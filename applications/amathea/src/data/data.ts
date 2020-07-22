import { Dataview } from '@globalfishingwatch/dataviews-client'

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

export const DATASET_TYPE_OPTIONS = [
  { id: 'context_areas', label: 'Static Context Areas' },
  { id: 'tracks', label: 'Spatiotemporal Tracks (Coming soon)' },
  { id: '4wings', label: 'Spatiotemporal Grid (Coming soon)' },
]

export const TEST_WORSPACE_DATAVIEWS: Dataview[] = [
  {
    id: 'dataview-1',
    name: 'Sea Surface Temperature',
    datasets: [{ id: '', label: '', description: '' }],
    description: '',
  },
  {
    id: 'dataview-2',
    name: 'Salinity',
    datasets: [{ id: '', label: '', description: '' }],
    description: '',
  },
]

export const TEST_DATAVIEW_MONTHLY_STATS: { [id: string]: { month: string; value: number }[] } = {
  'dataview-1': [
    { month: 'Jan 2018', value: 33.818 },
    { month: 'Feb 2018', value: 32.976 },
    { month: 'Mar 2018', value: 33.669 },
    { month: 'Apr 2018', value: 33.961 },
    { month: 'May 2018', value: 34.277 },
    { month: 'Jun 2018', value: 34.283 },
    { month: 'Jul 2018', value: 34.258 },
    { month: 'Aug 2018', value: 34.173 },
    { month: 'Sep 2018', value: 34.086 },
    { month: 'Oct 2018', value: 33.995 },
    { month: 'Nov 2018', value: 33.912 },
    { month: 'Dec 2018', value: 33.828 },
    { month: 'Jan 2019', value: 33.816 },
    { month: 'Feb 2019', value: 33.786 },
    { month: 'Mar 2019', value: 33.911 },
    { month: 'Apr 2019', value: 33.998 },
    { month: 'May 2019', value: 34.171 },
    { month: 'Jun 2019', value: 34.254 },
    { month: 'Jul 2019', value: 34.186 },
    { month: 'Aug 2019', value: 34.176 },
    { month: 'Sep 2019', value: 34.149 },
    { month: 'Oct 2019', value: 34.046 },
    { month: 'Nov 2019', value: 33.939 },
    { month: 'Dec 2019', value: 33.864 },
  ],
  'dataview-2': [
    { month: 'Jan 2018', value: 26.773 },
    { month: 'Feb 2018', value: 26.126 },
    { month: 'Mar 2018', value: 26.063 },
    { month: 'Apr 2018', value: 26.513 },
    { month: 'May 2018', value: 26.852 },
    { month: 'Jun 2018', value: 27.095 },
    { month: 'Jul 2018', value: 27.277 },
    { month: 'Aug 2018', value: 27.869 },
    { month: 'Sep 2018', value: 28.473 },
    { month: 'Oct 2018', value: 28.491 },
    { month: 'Nov 2018', value: 28.003 },
    { month: 'Dec 2018', value: 27.077 },
    { month: 'Jan 2019', value: 26.38 },
    { month: 'Feb 2019', value: 26.129 },
    { month: 'Mar 2019', value: 26.097 },
    { month: 'Apr 2019', value: 26.608 },
    { month: 'May 2019', value: 27.22 },
    { month: 'Jun 2019', value: 27.739 },
    { month: 'Jul 2019', value: 27.993 },
    { month: 'Aug 2019', value: 28.519 },
    { month: 'Sep 2019', value: 29.101 },
    { month: 'Oct 2019', value: 29.039 },
    { month: 'Nov 2019', value: 28.512 },
    { month: 'Dec 2019', value: 27.731 },
  ],
}
