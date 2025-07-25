// import { HIGHLIGHT_DATAVIEW_INSTANCE_ID } from 'features/workspace/highlight-panel/highlight-panel.content'
import type { Workspace } from '@globalfishingwatch/api-types'
import { WORKSPACE_PRIVATE_ACCESS, WORKSPACE_PUBLIC_ACCESS } from '@globalfishingwatch/api-types'

import { APP_NAME, DEFAULT_TIME_RANGE, DEFAULT_VIEWPORT } from 'data/config'
import { BASE_CONTEXT_LAYERS_DATAVIEW_INSTANCES } from 'data/default-workspaces/context-layers'
import {
  AIS_DATAVIEW_INSTANCE_ID,
  PRESENCE_DATAVIEW_INSTANCE_ID,
  SAR_DATAVIEW_INSTANCE_ID,
  SENTINEL2_DATAVIEW_INSTANCE_ID,
  VIIRS_DATAVIEW_INSTANCE_ID,
  VMS_DATAVIEW_INSTANCE_ID,
} from 'data/highlighted-workspaces/report.dataviews'
import { BATHYMETRY_DATAVIEW_INSTANCE } from 'data/layer-library/layers-environment'
import {
  BASEMAP_DATAVIEW_INSTANCE_ID,
  BASEMAP_DATAVIEW_SLUG,
  BASEMAP_LABELS_DATAVIEW_SLUG,
  CLUSTER_ENCOUNTER_EVENTS_DATAVIEW_SLUG,
  DEFAULT_BASEMAP_DATAVIEW_INSTANCE_ID,
  DEFAULT_WORKSPACE_CATEGORY,
  DEFAULT_WORKSPACE_ID,
  FISHING_DATAVIEW_SLUG_AIS,
  FISHING_DATAVIEW_SLUG_VMS,
  FIXED_SAR_INFRASTRUCTURE,
  GRATICULES_DATAVIEW_SLUG,
  HIGH_SEAS_DATAVIEW_SLUG,
  PRESENCE_DATAVIEW_SLUG,
  SAR_DATAVIEW_SLUG,
  SENTINEL2_DATAVIEW_SLUG,
  VIIRS_MATCH_DATAVIEW_SLUG,
} from 'data/workspaces'
import { ENCOUNTER_EVENTS_SOURCE_ID } from 'features/dataviews/dataviews.utils'
import { OFFSHORE_FIXED_INFRASTRUCTURE_LAYER_ID } from 'features/map/map.config'
import type { WorkspaceState } from 'types'

const workspace: Workspace<WorkspaceState> = {
  id: DEFAULT_WORKSPACE_ID,
  app: APP_NAME,
  name: '',
  description: '',
  viewAccess: WORKSPACE_PUBLIC_ACCESS,
  editAccess: WORKSPACE_PRIVATE_ACCESS,
  category: DEFAULT_WORKSPACE_CATEGORY,
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
      id: AIS_DATAVIEW_INSTANCE_ID,
      config: {
        visible: true,
        datasets: ['public-global-fishing-effort:v3.0'],
        filters: {
          distance_from_port_km: '3',
        },
      },
      dataviewId: FISHING_DATAVIEW_SLUG_AIS,
    },
    {
      id: VMS_DATAVIEW_INSTANCE_ID,
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
          'public-png-fishing-effort:v20230210',
          'public-norway-fishing-effort:v20220112',
        ],
      },
      dataviewId: FISHING_DATAVIEW_SLUG_VMS,
    },
    {
      id: PRESENCE_DATAVIEW_INSTANCE_ID,
      config: {
        color: '#FF64CE',
        colorRamp: 'magenta',
        visible: false,
      },
      dataviewId: PRESENCE_DATAVIEW_SLUG,
    },
    {
      id: SENTINEL2_DATAVIEW_INSTANCE_ID,
      dataviewId: SENTINEL2_DATAVIEW_SLUG,
      config: {
        visible: false,
      },
    },
    {
      id: VIIRS_DATAVIEW_INSTANCE_ID,
      config: {
        color: '#FFEA00',
        colorRamp: 'yellow',
        visible: false,
      },
      dataviewId: VIIRS_MATCH_DATAVIEW_SLUG,
      datasetsConfig: [],
    },
    {
      id: SAR_DATAVIEW_INSTANCE_ID,
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
      ...BATHYMETRY_DATAVIEW_INSTANCE,
      id: 'bathymetry',
      config: { visible: false },
    },
    ...BASE_CONTEXT_LAYERS_DATAVIEW_INSTANCES,
    {
      id: 'context-layer-high-seas',
      config: {
        visible: false,
      },
      dataviewId: HIGH_SEAS_DATAVIEW_SLUG,
    },
    {
      id: OFFSHORE_FIXED_INFRASTRUCTURE_LAYER_ID,
      config: {
        visible: false,
        color: '#8E24A9',
        colorRamp: 'seance',
      },
      dataviewId: FIXED_SAR_INFRASTRUCTURE,
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
