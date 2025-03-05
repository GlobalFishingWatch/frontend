import type { UrlDataviewInstance } from '@globalfishingwatch/dataviews-client'

import {
  ENCOUNTER_EVENTS_SOURCE_ID,
  LOITERING_EVENTS_SOURCE_ID,
  PORT_VISITS_EVENTS_SOURCE_ID,
} from 'features/dataviews/dataviews.utils'

export const AIS_DATAVIEW_INSTANCE_ID = 'ais'
export const VMS_DATAVIEW_INSTANCE_ID = 'vms'
export const PRESENCE_DATAVIEW_INSTANCE_ID = 'presence'
export const SAR_DATAVIEW_INSTANCE_ID = 'sar'
export const VIIRS_DATAVIEW_INSTANCE_ID = 'viirs'

const REPORT_EVENTS_DATAVIEW_INSTANCES_IDS: string[] = [
  AIS_DATAVIEW_INSTANCE_ID,
  VMS_DATAVIEW_INSTANCE_ID,
  PRESENCE_DATAVIEW_INSTANCE_ID,
  SAR_DATAVIEW_INSTANCE_ID,
  VIIRS_DATAVIEW_INSTANCE_ID,
  ENCOUNTER_EVENTS_SOURCE_ID,
  LOITERING_EVENTS_SOURCE_ID,
  PORT_VISITS_EVENTS_SOURCE_ID,
]

export const REPORT_EVENTS_DATAVIEW_INSTANCES: UrlDataviewInstance[] =
  REPORT_EVENTS_DATAVIEW_INSTANCES_IDS.map((id) => ({
    id,
    config: {
      visible: true,
    },
  }))
