import type { Workspace } from '@globalfishingwatch/api-types'
import { WORKSPACE_PRIVATE_ACCESS, WORKSPACE_PUBLIC_ACCESS } from '@globalfishingwatch/api-types'
import { DEFAULT_VIEWPORT } from '@platform/config/map/app'
import {
  AIS_DATAVIEW_INSTANCE_ID,
  BASEMAP_DATAVIEW_SLUG,
  BASEMAP_LABELS_DATAVIEW_INSTANCE_ID,
  BASEMAP_LABELS_DATAVIEW_SLUG,
  CLUSTER_ENCOUNTER_EVENTS_DATAVIEW_SLUG,
  CLUSTER_LOITERING_EVENTS_DATAVIEW_SLUG,
  CLUSTER_PORT_VISIT_EVENTS_DATAVIEW_SLUG,
  DEFAULT_BASEMAP_DATAVIEW_INSTANCE_ID,
  FISHING_AIS_DATAVIEW_SLUG,
  FISHING_VMS_DATAVIEW_SLUG,
  FIXED_INFRASTRUCTURE_DATAVIEW_SLUG,
  GRATICULES_DATAVIEW_SLUG,
  PORTS_AIS_DATAVIEW_SLUG,
  PORTS_VMS_DATAVIEW_SLUG,
  PRESENCE_DATAVIEW_INSTANCE_ID,
  PRESENCE_DATAVIEW_SLUG,
  PRESENCE_REALTIME_DATAVIEW_SLUG,
  REAL_TIME_DATAVIEW_INSTANCE_ID,
  SAR_DATAVIEW_INSTANCE_ID,
  SAR_DATAVIEW_SLUG,
  SENTINEL2_DATAVIEW_INSTANCE_ID,
  SENTINEL2_DATAVIEW_SLUG,
  VIIRS_MATCH_SKYLIGHT_DATAVIEW_SLUG,
  VIIRS_SKYLIGHT_DATAVIEW_INSTANCE_ID,
  VMS_DATAVIEW_INSTANCE_ID,
} from '@platform/config/map/dataviews'
import { DEFAULT_WORKSPACE_CATEGORY, DEFAULT_WORKSPACE_ID } from '@platform/config/map/workspaces'

import { APP_NAME, DEFAULT_TIME_RANGE, IS_REALTIME_ENABLED } from 'data/map/config'
import { BASE_CONTEXT_LAYERS_DATAVIEW_INSTANCES } from 'data/map/default-workspaces/context-layers'
import { BATHYMETRY_DATAVIEW_INSTANCE } from 'data/map/layer-library/layers-environment'
import {
  BATHYMETRY_DATAVIEW_PREFIX,
  ENCOUNTER_EVENTS_SOURCE_ID,
  LOITERING_EVENTS_SOURCE_ID,
  PORT_VISITS_EVENTS_SOURCE_ID,
} from 'features/_map/dataviews/dataviews.utils'
import {
  OFFSHORE_FIXED_INFRASTRUCTURE_LAYER_ID,
  PORTS_LAYER_ID,
} from 'features/_map/map/map.config'
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
    ...(IS_REALTIME_ENABLED
      ? [
          {
            id: REAL_TIME_DATAVIEW_INSTANCE_ID,
            dataviewId: PRESENCE_REALTIME_DATAVIEW_SLUG,
          },
        ]
      : []),
    {
      id: AIS_DATAVIEW_INSTANCE_ID,
      config: {
        visible: true,
        filters: {
          distance_from_port_km: '3',
        },
      },
      dataviewId: FISHING_AIS_DATAVIEW_SLUG,
    },
    {
      id: VMS_DATAVIEW_INSTANCE_ID,
      dataviewId: FISHING_VMS_DATAVIEW_SLUG,
    },
    {
      id: PRESENCE_DATAVIEW_INSTANCE_ID,
      config: {
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
      id: VIIRS_SKYLIGHT_DATAVIEW_INSTANCE_ID,
      config: {
        visible: false,
      },
      dataviewId: VIIRS_MATCH_SKYLIGHT_DATAVIEW_SLUG,
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
      id: LOITERING_EVENTS_SOURCE_ID,
      dataviewId: CLUSTER_LOITERING_EVENTS_DATAVIEW_SLUG,
      config: {
        visible: false,
      },
    },
    // {
    //   id: GAPS_EVENTS_SOURCE_ID,
    //   dataviewId: CLUSTER_GAPS_AIS_OFF_EVENTS_DATAVIEW_SLUG,
    //   config: {
    //     visible: true,
    //     filters: {
    //       start_distance_from_shore_trunc: 1,
    //       duration: ['4', '48'],
    //     },
    //   },
    // },
    {
      id: PORT_VISITS_EVENTS_SOURCE_ID,
      dataviewId: CLUSTER_PORT_VISIT_EVENTS_DATAVIEW_SLUG,
      config: {
        visible: false,
      },
    },
    {
      id: 'context-layer-graticules',
      config: {
        visible: false,
      },
      dataviewId: GRATICULES_DATAVIEW_SLUG,
    },
    {
      ...BATHYMETRY_DATAVIEW_INSTANCE,
      id: BATHYMETRY_DATAVIEW_PREFIX,
      config: { visible: false },
    },
    ...BASE_CONTEXT_LAYERS_DATAVIEW_INSTANCES,
    {
      id: OFFSHORE_FIXED_INFRASTRUCTURE_LAYER_ID,
      config: {
        visible: false,
        color: '#8E24A9',
        colorRamp: 'seance',
      },
      dataviewId: FIXED_INFRASTRUCTURE_DATAVIEW_SLUG,
    },
    {
      id: `${PORTS_LAYER_ID}-ais`,
      config: {
        visible: false,
        color: '#9AEEFF',
      },
      dataviewId: PORTS_AIS_DATAVIEW_SLUG,
    },
    {
      id: `${PORTS_LAYER_ID}-vms`,
      config: {
        visible: false,
        color: '#9AEEFF',
      },
      dataviewId: PORTS_VMS_DATAVIEW_SLUG,
    },
    {
      id: BASEMAP_LABELS_DATAVIEW_INSTANCE_ID,
      config: {
        visible: false,
      },
      dataviewId: BASEMAP_LABELS_DATAVIEW_SLUG,
    },
  ],
}

export default workspace
