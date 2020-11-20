import { Workspace } from '@globalfishingwatch/api-types'
import { APP_NAME } from 'data/config'
import { DEFAULT_FISHING_DATAVIEW_ID, DEFAULT_VESSEL_DATAVIEW_ID } from 'data/datasets'
import { WorkspaceState } from 'types'

const workspace: Workspace<WorkspaceState> = {
  id: 'default',
  app: APP_NAME,
  name: 'Default public Fishing Map workspace',
  description: '',
  startAt: new Date(2019, 0).toISOString(),
  endAt: new Date(2020, 0).toISOString(),
  viewport: {
    zoom: 4.4,
    latitude: 43,
    longitude: -3,
  },
  state: {
    // query: 'pepe',
    // bivariate: true,
    // sidebarOpen: false,
    // timebarVisualisation: '',
    // timebarEvents: '',
    // timebarGraph: '',
  },
  dataviews: [{ id: DEFAULT_VESSEL_DATAVIEW_ID }], // Needed to fetch vessel information
  dataviewInstances: [
    {
      id: 'basemap',
      dataviewId: 90,
    },
    {
      id: 'fishing-1',
      config: {
        // filters: ['ESP'],
      },
      dataviewId: DEFAULT_FISHING_DATAVIEW_ID,
    },
    {
      id: 'fishing-2',
      config: {
        color: '#FF64CE',
        filters: ['FRA'],
        colorRamp: 'magenta',
      },
      dataviewId: DEFAULT_FISHING_DATAVIEW_ID,
    },
    {
      id: 'context-layer-eez',
      config: {
        color: '#069688',
        visible: true,
      },
      dataviewId: 94,
    },
    {
      id: 'context-layer-mpa',
      config: {
        color: '#1AFF6B',
        visible: false,
      },
      dataviewId: 98,
    },
    {
      id: 'context-layer-mpa-no-take',
      config: {
        color: '#F4511F',
        visible: false,
      },
      dataviewId: 99,
    },
    {
      id: 'context-layer-mpa-restricted',
      config: {
        color: '#F09300',
        visible: false,
      },
      dataviewId: 100,
    },
    {
      id: 'context-layer-rfmo',
      config: {
        color: '#6b67e5',
        visible: false,
      },
      dataviewId: 95,
    },
    {
      id: 'context-layer-wpp-nri',
      config: {
        visible: false,
      },
      dataviewId: 96,
    },
    {
      id: 'context-layer-high-seas',
      config: {
        visible: false,
      },
      dataviewId: 97,
    },
  ],
}

export default workspace
