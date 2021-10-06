import { Workspace } from '@globalfishingwatch/api-types'
import { APP_NAME, DEFAULT_TIME_RANGE, DEFAULT_VIEWPORT } from 'data/config'
import {
  WorkspaceCategories,
  DEFAULT_WORKSPACE_ID,
  EEZ_DATAVIEW_ID,
  MPA_DATAVIEW_ID,
  RFMO_DATAVIEW_ID,
  BASEMAP_DATAVIEW_ID,
  FISHING_DATAVIEW_ID,
  PRESENCE_DATAVIEW_ID,
  VIIRS_DATAVIEW_ID,
  CLUSTER_ENCOUNTER_EVENTS_DATAVIEW_ID,
  DEFAULT_BASEMAP_DATAVIEW_INSTANCE_ID,
  DEFAULT_HIGH_SEAS_DATAVIEW_ID,
} from 'data/workspaces'
import { WorkspaceState } from 'types'

const workspace: Workspace<WorkspaceState> = {
  id: DEFAULT_WORKSPACE_ID,
  app: APP_NAME,
  name: 'Default public Fishing Map workspace in production v1',
  description: DEFAULT_WORKSPACE_ID,
  category: WorkspaceCategories.FishingActivity,
  startAt: DEFAULT_TIME_RANGE.start,
  endAt: DEFAULT_TIME_RANGE.end,
  viewport: DEFAULT_VIEWPORT,
  public: true,
  state: {},
  ownerId: 0,
  dataviews: [],
  dataviewInstances: [
    {
      id: DEFAULT_BASEMAP_DATAVIEW_INSTANCE_ID,
      dataviewId: BASEMAP_DATAVIEW_ID,
    },
    {
      id: 'fishing-ais',
      config: {
        datasets: ['public-global-fishing-effort:v20201001'],
      },
      dataviewId: FISHING_DATAVIEW_ID,
    },
    {
      // This id is used for highlighting the dataview with a popup on the right
      // update it here if you want to show it again or go to
      // applications/fishing-map/src/features/workspace/highlight-panel/highlight-panel.content.ts
      // and update the `dataviewInstanceId`
      id: 'fishing-vms',
      config: {
        color: '#FFAA0D',
        colorRamp: 'orange',
        datasets: [
          'public-chile-fishing-effort:v20200331',
          'public-indonesia-fishing-effort:v20200320',
          'public-panama-fishing-effort:v20200331',
          'public-peru-fishing-effort:v20200324',
        ],
      },
      dataviewId: FISHING_DATAVIEW_ID,
    },
    {
      id: 'presence',
      config: {
        color: '#FF64CE',
        colorRamp: 'magenta',
      },
      dataviewId: PRESENCE_DATAVIEW_ID,
    },
    {
      id: 'viirs',
      config: {
        color: '#FFEA00',
        colorRamp: 'yellow',
        visible: false,
      },
      dataviewId: VIIRS_DATAVIEW_ID,
      datasetsConfig: [],
    },
    {
      id: 'encounter-events',
      dataviewId: CLUSTER_ENCOUNTER_EVENTS_DATAVIEW_ID,
      config: {
        visible: false,
      },
    },
    {
      id: 'context-layer-eez',
      config: {
        color: '#069688',
        visible: false,
      },
      dataviewId: EEZ_DATAVIEW_ID,
    },
    // {
    //   id: 'context-layer-mpa-no-take',
    //   config: {
    //     color: '#F4511F',
    //     visible: false,
    //   },
    //   dataviewId: MPA_NO_TAKE_DATAVIEW_ID,
    // },
    // {
    //   id: 'context-layer-mpa-restricted',
    //   config: {
    //     color: '#F09300',
    //     visible: false,
    //   },
    //   dataviewId: MPA_RESTRICTED_DATAVIEW_ID,
    // },
    {
      id: 'context-layer-mpa',
      config: {
        color: '#1AFF6B',
        visible: false,
      },
      dataviewId: MPA_DATAVIEW_ID,
    },
    {
      id: 'context-layer-rfmo',
      config: {
        color: '#6b67e5',
        visible: false,
      },
      dataviewId: RFMO_DATAVIEW_ID,
    },
    {
      id: 'context-layer-high-seas',
      config: {
        visible: false,
      },
      dataviewId: DEFAULT_HIGH_SEAS_DATAVIEW_ID,
    },
  ],
}

export default workspace
