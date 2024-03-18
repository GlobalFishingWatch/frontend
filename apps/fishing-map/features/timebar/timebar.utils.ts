import { DateTime } from 'luxon'
import { EventTypes, ApiEvent } from '@globalfishingwatch/api-types'
import {
  TimebarChartChunk,
  TrackEventChunkProps,
  ActivityTimeseriesFrame,
} from '@globalfishingwatch/timebar'
import { FourWingsFeature } from '@globalfishingwatch/deck-loaders'
import { Interval } from '@globalfishingwatch/layer-composer'
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
  features: FourWingsFeature[],
  {
    start,
    end,
    interval,
    sublayers,
  }: { start: number; end: number; interval: Interval; sublayers: number }
): ActivityTimeseriesFrame[] {
  if (!features?.length) {
    return []
  }
  const data: Record<number, ActivityTimeseriesFrame> = {}
  let date = getUTCDateTime(start).toMillis()
  const endPlusOne = Math.min(
    getUTCDateTime(end)
      .plus({ [interval]: 1 })
      .toMillis(),
    DateTime.now().toUTC().toMillis()
  )
  while (date <= endPlusOne) {
    data[date] = { date }
    for (let i = 0; i < sublayers; i++) {
      data[date][i] = 0
    }
    date = Math.min(
      getUTCDateTime(date)
        .plus({ [interval]: 1 })
        .toMillis(),
      DateTime.now().toUTC().toMillis()
    )
  }
  for (const feature of features) {
    const { dates, values } = feature.properties
    dates.forEach((sublayerDates, sublayerIndex) => {
      sublayerDates.forEach((date, dateIndex) => {
        if (data[date]) {
          data[date][sublayerIndex] += values[sublayerIndex][dateIndex]
        }
      })
    })
  }
  return Object.values(data)
}
