import { unparse } from 'papaparse'
import { VesselData } from 'features/vessel/vessel.slice'
import { ActivityEvent } from 'features/vessel/activity/vessels-activity.selectors'

export const VESSEL_CSV_KEYS = ['id', 'mmsi', 'shipname', 'shiptype']
export const EVENTS_CSV_KEYS = ['type', 'start', 'end' /*'position'*/]

export const parseVesselToCSV = (vessel: VesselData) => {
  return unparse([vessel], {
    columns: VESSEL_CSV_KEYS,
  })
}

export const parseEventsToCSV = (events: ActivityEvent[]) => {
  return unparse(events, {
    columns: EVENTS_CSV_KEYS,
  })
}
