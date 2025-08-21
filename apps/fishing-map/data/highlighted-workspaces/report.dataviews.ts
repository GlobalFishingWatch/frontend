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
    config: {
      visible: true,
    },
  })
)
