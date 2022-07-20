import { Workspace } from '@globalfishingwatch/api-types'
import { APP_NAME, DEFAULT_TIME_RANGE, DEFAULT_VIEWPORT } from 'data/config'
import {
  WorkspaceCategories,
  DEFAULT_WORKSPACE_ID,
  EEZ_DATAVIEW_ID,
  MPA_DATAVIEW_ID,
  RFMO_DATAVIEW_ID,
  HIGH_SEAS_DATAVIEW_ID,
  BASEMAP_DATAVIEW_ID,
  BASEMAP_LABELS_DATAVIEW_ID,
  FISHING_DATAVIEW_ID,
  PRESENCE_DATAVIEW_ID,
  VIIRS_MATCH_DATAVIEW_ID,
  CLUSTER_ENCOUNTER_EVENTS_DATAVIEW_ID,
  DEFAULT_BASEMAP_DATAVIEW_INSTANCE_ID,
  GRATICULES_DATAVIEW_ID,
  FAO_AREAS_DATAVIEW_ID,
  SAR_DATAVIEW_ID,
  PROTECTED_SEAS_DATAVIEW_ID,
} from 'data/workspaces'
import { ENCOUNTER_EVENTS_SOURCE_ID } from 'features/dataviews/dataviews.utils'
import { HIGHLIGHT_DATAVIEW_INSTANCE_ID } from 'features/workspace/highlight-panel/highlight-panel.content'
import { WorkspaceState } from 'types'

const workspace: Workspace<WorkspaceState> = {
  id: DEFAULT_WORKSPACE_ID,
  app: APP_NAME,
  name: 'Default public Fishing Map workspace',
  description: DEFAULT_WORKSPACE_ID,
  category: WorkspaceCategories.FishingActivity,
  startAt: DEFAULT_TIME_RANGE.start,
  endAt: DEFAULT_TIME_RANGE.end,
  viewport: DEFAULT_VIEWPORT,
  public: true,
  state: {
    // query: 'pepe',
    // bivariate: true,
    // sidebarOpen: false,
    // timebarVisualisation: '',
    // visibleEvents: 'all',
    // timebarGraph: '',
  },
  ownerId: 0,
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
      id: 'vms',
      config: {
        color: '#FFAA0D',
        colorRamp: 'orange',
        datasets: [
          'public-belize-fishing-effort:v20220304',
          'public-bra-onyxsat-fishing-effort:v20211126',
          'public-chile-fishing-effort:v20211126',
          'public-costa-rica-fishing-effort:v20211126',
          'public-ecuador-fishing-effort:v20211126',
          'public-indonesia-fishing-effort:v20200320',
          'public-panama-fishing-effort:v20211126',
          'public-peru-fishing-effort:v20211126',
        ],
      },
      dataviewId: FISHING_DATAVIEW_ID,
    },
    {
      id: 'presence',
      config: {
        color: '#FF64CE',
        colorRamp: 'magenta',
        visible: false,
      },
      dataviewId: PRESENCE_DATAVIEW_ID,
    },
    {
      id: 'viirs-match',
      config: {
        color: '#FFEA00',
        colorRamp: 'yellow',
        visible: false,
      },
      dataviewId: VIIRS_MATCH_DATAVIEW_ID,
      datasetsConfig: [],
    },
    {
      id: HIGHLIGHT_DATAVIEW_INSTANCE_ID,
      dataviewId: SAR_DATAVIEW_ID,
      config: {
        visible: false,
      },
    },
    {
      id: ENCOUNTER_EVENTS_SOURCE_ID,
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
    {
      id: 'context-layer-mpa',
      config: {
        color: '#1AFF6B',
        visible: false,
      },
      dataviewId: MPA_DATAVIEW_ID,
    },
    {
      id: 'context-layer-fao-areas',
      config: {
        visible: false,
      },
      dataviewId: FAO_AREAS_DATAVIEW_ID,
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
      id: 'context-layer-graticules',
      config: {
        visible: false,
      },
      dataviewId: GRATICULES_DATAVIEW_ID,
    },
    {
      id: 'context-layer-high-seas',
      config: {
        visible: false,
      },
      dataviewId: HIGH_SEAS_DATAVIEW_ID,
    },
    {
      id: 'context-layer-protected-seas',
      config: {
        visible: false,
      },
      dataviewId: PROTECTED_SEAS_DATAVIEW_ID,
    },
    {
      id: 'basemap-labels',
      config: {
        locale: 'en',
        visible: false,
      },
      dataviewId: BASEMAP_LABELS_DATAVIEW_ID,
    },
  ],
}

export default workspace
