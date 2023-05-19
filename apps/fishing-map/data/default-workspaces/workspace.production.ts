import { Workspace } from '@globalfishingwatch/api-types'
import { APP_NAME, DEFAULT_TIME_RANGE, DEFAULT_VIEWPORT } from 'data/config'
import {
  WorkspaceCategory,
  DEFAULT_WORKSPACE_ID,
  EEZ_DATAVIEW_SLUG,
  MPA_DATAVIEW_SLUG,
  SAR_DATAVIEW_SLUG,
  RFMO_DATAVIEW_SLUG,
  HIGH_SEAS_DATAVIEW_SLUG,
  BASEMAP_DATAVIEW_SLUG,
  FISHING_DATAVIEW_SLUG,
  PRESENCE_DATAVIEW_SLUG,
  VIIRS_MATCH_DATAVIEW_SLUG,
  CLUSTER_ENCOUNTER_EVENTS_DATAVIEW_SLUG,
  DEFAULT_BASEMAP_DATAVIEW_INSTANCE_ID,
  GRATICULES_DATAVIEW_SLUG,
  FAO_AREAS_DATAVIEW_SLUG,
  PROTECTED_SEAS_DATAVIEW_SLUG,
  MPA_DATAVIEW_INSTANCE_ID,
  EEZ_DATAVIEW_INSTANCE_ID,
  BASEMAP_LABELS_DATAVIEW_SLUG,
  PROTECTEDSEAS_DATAVIEW_INSTANCE_ID,
  BASEMAP_DATAVIEW_INSTANCE_ID,
} from 'data/workspaces'
import { ENCOUNTER_EVENTS_SOURCE_ID } from 'features/dataviews/dataviews.utils'
// This id is used for highlighting the dataview with a popup on the right
// update it here if you want to show it again or go to
// apps/fishing-map/src/features/workspace/highlight-panel/highlight-panel.content.ts
// and update the `dataviewInstanceId`
import { HIGHLIGHT_DATAVIEW_INSTANCE_ID } from 'features/workspace/highlight-panel/highlight-panel.content'
import { WorkspaceState } from 'types'

const workspace: Workspace<WorkspaceState> = {
  id: DEFAULT_WORKSPACE_ID,
  app: APP_NAME,
  name: 'Default public Fishing Map workspace in production v1',
  description: '',
  category: WorkspaceCategory.FishingActivity,
  startAt: DEFAULT_TIME_RANGE.start,
  endAt: DEFAULT_TIME_RANGE.end,
  viewport: DEFAULT_VIEWPORT,
  public: true,
  state: {},
  ownerId: 0,
  dataviewInstances: [
    {
      id: DEFAULT_BASEMAP_DATAVIEW_INSTANCE_ID,
      dataviewId: BASEMAP_DATAVIEW_SLUG,
    },
    {
      id: 'fishing-ais',
      config: {
        datasets: ['public-global-fishing-effort:v20201001'],
      },
      dataviewId: FISHING_DATAVIEW_SLUG,
    },
    {
      id: HIGHLIGHT_DATAVIEW_INSTANCE_ID,
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
          'public-norway-fishing-effort:v20220112',
        ],
      },
      dataviewId: FISHING_DATAVIEW_SLUG,
    },
    {
      id: 'presence',
      config: {
        color: '#FF64CE',
        colorRamp: 'magenta',
        visible: false,
      },
      dataviewId: PRESENCE_DATAVIEW_SLUG,
    },
    {
      id: 'viirs',
      config: {
        color: '#FFEA00',
        colorRamp: 'yellow',
        visible: false,
      },
      dataviewId: VIIRS_MATCH_DATAVIEW_SLUG,
      datasetsConfig: [],
    },
    {
      id: 'sar',
      dataviewId: SAR_DATAVIEW_SLUG,
      config: {
        visible: false,
      },
    },
    {
      id: ENCOUNTER_EVENTS_SOURCE_ID,
      dataviewId: CLUSTER_ENCOUNTER_EVENTS_DATAVIEW_SLUG,
      config: {
        visible: false,
      },
    },
    {
      id: 'context-layer-graticules',
      config: {
        visible: true,
      },
      dataviewId: GRATICULES_DATAVIEW_SLUG,
    },
    {
      id: EEZ_DATAVIEW_INSTANCE_ID,
      config: {
        color: '#069688',
        visible: false,
      },
      dataviewId: EEZ_DATAVIEW_SLUG,
    },
    {
      id: MPA_DATAVIEW_INSTANCE_ID,
      config: {
        color: '#1AFF6B',
        visible: false,
      },
      dataviewId: MPA_DATAVIEW_SLUG,
    },
    {
      id: PROTECTEDSEAS_DATAVIEW_INSTANCE_ID,
      config: {
        visible: false,
      },
      dataviewId: PROTECTED_SEAS_DATAVIEW_SLUG,
    },
    {
      id: 'context-layer-fao-areas',
      config: {
        visible: false,
      },
      dataviewId: FAO_AREAS_DATAVIEW_SLUG,
    },
    {
      id: 'context-layer-rfmo',
      config: {
        color: '#6b67e5',
        visible: false,
      },
      dataviewId: RFMO_DATAVIEW_SLUG,
    },
    {
      id: 'context-layer-high-seas',
      config: {
        visible: false,
      },
      dataviewId: HIGH_SEAS_DATAVIEW_SLUG,
    },
    {
      id: BASEMAP_DATAVIEW_INSTANCE_ID,
      config: {
        visible: false,
      },
      dataviewId: BASEMAP_LABELS_DATAVIEW_SLUG,
    },
  ],
}

export default workspace
