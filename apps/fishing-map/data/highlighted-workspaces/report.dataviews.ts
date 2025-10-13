import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import {
  AIS_DATAVIEW_INSTANCE_ID,
  PRESENCE_DATAVIEW_INSTANCE_ID,
  SAR_DATAVIEW_INSTANCE_ID,
  SENTINEL2_DATAVIEW_INSTANCE_ID,
  VIIRS_DATAVIEW_INSTANCE_ID,
  VMS_DATAVIEW_INSTANCE_ID,
} from 'data/dataviews'
import {
  BATHYMETRY_DATAVIEW_INSTANCE,
  SEA_SURFACE_TEMPERATURE_DATAVIEW_INSTANCE,
} from 'data/layer-library/layers-environment'
import {
  ENCOUNTER_EVENTS_SOURCE_ID,
  LOITERING_EVENTS_SOURCE_ID,
  PORT_VISITS_EVENTS_SOURCE_ID,
} from 'features/dataviews/dataviews.utils'

const REPORT_DATAVIEW_INSTANCES_IDS: string[] = [
  AIS_DATAVIEW_INSTANCE_ID,
  VMS_DATAVIEW_INSTANCE_ID,
  PRESENCE_DATAVIEW_INSTANCE_ID,
  SAR_DATAVIEW_INSTANCE_ID,
  SENTINEL2_DATAVIEW_INSTANCE_ID,
  VIIRS_DATAVIEW_INSTANCE_ID,
  ENCOUNTER_EVENTS_SOURCE_ID,
  LOITERING_EVENTS_SOURCE_ID,
  PORT_VISITS_EVENTS_SOURCE_ID,
]

// export const CARRIER_PORTAL_DATAVIEW_INSTANCES: UrlDataviewInstance[] =
//   REPORT_EVENTS_DATAVIEW_INSTANCES_IDS.map((id) => ({
//     id,
//     config: {
//       visible: ENCOUNTER_EVENTS_SOURCE_ID.includes(id),
//     },
//   }))

export const REPORT_DATAVIEW_INSTANCES: UrlDataviewInstance[] = REPORT_DATAVIEW_INSTANCES_IDS.map(
  (id) => ({
    id,
    origin: 'report',
    config: {
      visible: true,
    },
  })
)

export const ENVIRONMENT_REPORT_DATAVIEW_INSTANCES: UrlDataviewInstance[] = [
  ...([AIS_DATAVIEW_INSTANCE_ID, VMS_DATAVIEW_INSTANCE_ID].map((id) => ({
    id,
    origin: 'report',
    config: {
      visible: false,
    },
  })) as UrlDataviewInstance[]),
  ...([BATHYMETRY_DATAVIEW_INSTANCE, SEA_SURFACE_TEMPERATURE_DATAVIEW_INSTANCE].map((dataview) => ({
    ...dataview,
    origin: 'report',
  })) as UrlDataviewInstance[]),
]
