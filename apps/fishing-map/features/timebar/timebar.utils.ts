import { EventTypes, ApiEvent } from '@globalfishingwatch/api-types'
import {
  TimebarChartChunk,
  TrackEventChunkProps,
  ActivityTimeseriesFrame,
} from '@globalfishingwatch/timebar'
import { FourWingsFeature } from '@globalfishingwatch/deck-loaders'
import { getEventColors, getEventDescription } from 'utils/events'
import { getUTCDateTime } from 'utils/dates'

export const getTimebarChunkEventColor = (ev: TimebarChartChunk<TrackEventChunkProps>) => {
  return ev.type ? getEventColors({ type: ev.type })?.color : 'white'
}

export const parseTrackEventChunkProps = (
  event: ApiEvent,
  eventKey?: string
): ApiEvent & { props: TrackEventChunkProps } => {
  const { description, descriptionGeneric } = getEventDescription({
    start: event.start as number,
    end: event.end as number,
    type: event.type as EventTypes,
    encounterVesselName: event.encounter?.vessel?.name,
    portName: event.port_visit?.intermediateAnchorage?.name,
    portFlag: event.port_visit?.intermediateAnchorage?.flag,
  })
  const { color, colorLabels } = getEventColors({ type: event.type as EventTypes })

  return {
    ...event,
    id: eventKey || event.id,
    start: getUTCDateTime(event.start as string).toMillis(),
    end: getUTCDateTime(event.end as string).toMillis(),
    props: {
      color,
      colorLabels,
      description,
      descriptionGeneric,
      latitude: event.position.lat,
      longitude: event.position.lon,
    },
  }
}

export function getGraphDataFromFourwingsFeatures(
  features: FourWingsFeature[]
): ActivityTimeseriesFrame[] {
  if (!features?.length) {
    return []
  }
  const data: Record<number, ActivityTimeseriesFrame> = {}
  for (const feature of features) {
    const { dates, values } = feature.properties
    dates.forEach((sublayerDates, sublayerIndex) => {
      sublayerDates.forEach((date, dateIndex) => {
        if (!data[date]) {
          data[date] = { date }
        }
        if (!data[date][sublayerIndex]) {
          data[date][sublayerIndex] = 0
        }
        data[date][sublayerIndex] += values[sublayerIndex][dateIndex]
      })
    })
  }
  // TODO insert empty frames for missing timestamps
  // https://github.com/GlobalFishingWatch/frontend/blob/b44b773c760d1472915bf7662631f13dc9cc7c5a/libs/features-aggregate/src/timeseries.ts#L102
  return Object.values(data).sort((a, b) => a.date - b.date)
}
