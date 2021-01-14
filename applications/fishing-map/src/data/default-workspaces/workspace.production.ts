import { Workspace } from '@globalfishingwatch/api-types'
import { APP_NAME } from 'data/config'
import {
  DEFAULT_BASEMAP_DATAVIEW_ID,
  DEFAULT_FISHING_DATAVIEW_ID,
  DEFAULT_VESSEL_DATAVIEW_ID,
  DEFAULT_WORKSPACE_ID,
} from 'data/workspaces'
import { WorkspaceState } from 'types'

const workspace: Workspace<WorkspaceState> = {
  id: DEFAULT_WORKSPACE_ID,
  app: APP_NAME,
  name: 'Default public Fishing Map workspace in production v1',
  description: '',
  startAt: '2019-12-01T00:00:00.000Z',
  endAt: '2019-12-31T23:59:59.999Z',
  viewport: {
    zoom: 0,
    latitude: 30,
    longitude: -37,
  },
  public: true,
  state: {},
  ownerId: 0,
  dataviews: [{ id: DEFAULT_VESSEL_DATAVIEW_ID }], // Needed to fetch vessel information
  dataviewInstances: [
    {
      id: 'basemap',
      dataviewId: DEFAULT_BASEMAP_DATAVIEW_ID,
    },
    {
      id: 'fishing-1',
      config: {
        datasets: ['fishing_v4'],
        // filters: ['ESP'],
      },
      dataviewId: DEFAULT_FISHING_DATAVIEW_ID,
    },
    {
      id: 'fishing-2',
      config: {
        datasets: ['chile-fishing:v20200331'],
        color: '#FF64CE',
        colorRamp: 'magenta',
      },
      dataviewId: DEFAULT_FISHING_DATAVIEW_ID,
    },
    {
      id: 'fishing-3',
      config: {
        datasets: ['indonesia-fishing:v20200320'],
        color: '#9CA4FF',
        colorRamp: 'lilac',
      },
      dataviewId: DEFAULT_FISHING_DATAVIEW_ID,
    },
    {
      id: 'context-layer-eez',
      config: {
        color: '#069688',
        visible: false,
      },
      dataviewId: 177,
    },
    {
      id: 'context-layer-mpa',
      config: {
        color: '#1AFF6B',
        visible: false,
      },
      dataviewId: 176,
    },
    {
      id: 'context-layer-mpa-no-take',
      config: {
        color: '#F4511F',
        visible: false,
      },
      dataviewId: 179,
    },
    {
      id: 'context-layer-mpa-restricted',
      config: {
        color: '#F09300',
        visible: false,
      },
      dataviewId: 180,
    },
    {
      id: 'context-layer-rfmo',
      config: {
        color: '#6b67e5',
        visible: false,
      },
      dataviewId: 175,
    },
    {
      id: 'context-layer-wpp-nri',
      config: {
        visible: false,
      },
      dataviewId: 172,
    },
    {
      id: 'context-layer-high-seas',
      config: {
        visible: false,
      },
      dataviewId: 174,
    },
  ],
}

export default workspace
