import { Workspace } from '@globalfishingwatch/api-types'
import { APP_NAME } from 'data/config'
import {
  WorkspaceCategories,
  DEFAULT_WORKSPACE_ID,
  DEFAULT_EEZ_DATAVIEW_ID,
  DEFAULT_MPA_DATAVIEW_ID,
  DEFAULT_RFMO_DATAVIEW_ID,
  DEFAULT_VESSEL_DATAVIEW_ID,
  DEFAULT_BASEMAP_DATAVIEW_ID,
  DEFAULT_CONTEXT_DATAVIEW_ID,
  DEFAULT_FISHING_DATAVIEW_ID,
  DEFAULT_PRESENCE_DATAVIEW_ID,
  DEFAULT_MPA_NO_TAKE_DATAVIEW_ID,
  DEFAULT_ENVIRONMENT_DATAVIEW_ID,
  DEFAULT_MPA_RESTRICTED_DATAVIEW_ID,
} from 'data/workspaces'
import { WorkspaceState } from 'types'

const workspace: Workspace<WorkspaceState> = {
  id: DEFAULT_WORKSPACE_ID,
  app: APP_NAME,
  name: 'Default public Fishing Map workspace in production v1',
  description: DEFAULT_WORKSPACE_ID,
  category: WorkspaceCategories.FishingActivity,
  startAt: new Date(Date.UTC(2018, 0, 1)).toISOString(),
  endAt: new Date(Date.UTC(2019, 11, 31, 23, 59)).toISOString(),
  viewport: {
    zoom: 0,
    latitude: 30,
    longitude: -37,
  },
  public: true,
  state: {},
  ownerId: 0,
  dataviews: [
    { id: DEFAULT_VESSEL_DATAVIEW_ID }, // Fetch vessel information
    { id: DEFAULT_CONTEXT_DATAVIEW_ID }, // Default context dataview for new layers
    { id: DEFAULT_PRESENCE_DATAVIEW_ID }, // If not present the add activity tooltip layer won't appear
    { id: DEFAULT_ENVIRONMENT_DATAVIEW_ID }, // Default environmet dataview for new layers
  ],
  dataviewInstances: [
    {
      id: 'basemap',
      dataviewId: DEFAULT_BASEMAP_DATAVIEW_ID,
    },
    {
      id: 'fishing-1',
      config: {
        // datasets: [`${PUBLIC_SUFIX}-fishing_v4`],
        // filters: ['ESP'],
      },
      dataviewId: DEFAULT_FISHING_DATAVIEW_ID,
    },
    {
      id: 'context-layer-eez',
      config: {
        color: '#069688',
        visible: false,
      },
      dataviewId: DEFAULT_EEZ_DATAVIEW_ID,
    },
    {
      id: 'context-layer-mpa-no-take',
      config: {
        color: '#F4511F',
        visible: false,
      },
      dataviewId: DEFAULT_MPA_NO_TAKE_DATAVIEW_ID,
    },
    {
      id: 'context-layer-mpa-restricted',
      config: {
        color: '#F09300',
        visible: false,
      },
      dataviewId: DEFAULT_MPA_RESTRICTED_DATAVIEW_ID,
    },
    {
      id: 'context-layer-mpa',
      config: {
        color: '#1AFF6B',
        visible: false,
      },
      dataviewId: DEFAULT_MPA_DATAVIEW_ID,
    },
    {
      id: 'context-layer-rfmo',
      config: {
        color: '#6b67e5',
        visible: false,
      },
      dataviewId: DEFAULT_RFMO_DATAVIEW_ID,
    },
  ],
}

export default workspace
