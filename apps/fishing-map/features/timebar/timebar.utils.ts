import { DateTime } from 'luxon'
import { EventTypes, ApiEvent } from '@globalfishingwatch/api-types'
import {
  TimebarChartChunk,
  TrackEventChunkProps,
  ActivityTimeseriesFrame,
} from '@globalfishingwatch/timebar'
import { FourwingsFeature, FourwingsInterval } from '@globalfishingwatch/deck-loaders'
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

type GetGraphDataFromFourwingsFeaturesParams = {
  start: number
  end: number
  interval: FourwingsInterval
  sublayers: number
}

// TODO:deck choose a better naming for this as also used in reports
// TODO:deck support
// - [] aggregationOperation
// - [] min and maxVisibleValues
export function getGraphDataFromFourwingsFeatures(
  features: FourwingsFeature[],
  { start, end, interval, sublayers }: GetGraphDataFromFourwingsFeaturesParams
): ActivityTimeseriesFrame[] {
  if (!features?.length || !start || !end) {
    return []
  }
  const data: Record<number, ActivityTimeseriesFrame> = {}
  let date = getUTCDateTime(start).toMillis()
  const now = DateTime.now().toUTC().toMillis()
  const endPlusOne = Math.min(
    getUTCDateTime(end)
      .plus({ [interval]: 1 })
      .toMillis(),
    now
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
      now + 1
    )
  }
  for (const feature of features) {
    const { dates, values } = feature.properties
    if (dates) {
      dates.forEach((sublayerDates, sublayerIndex) => {
        sublayerDates.forEach((date, dateIndex) => {
          if (data[date]) {
            data[date][sublayerIndex] += values[sublayerIndex][dateIndex]
          }
        })
      })
    }
  }
  return Object.values(data)
}
