import { EventTypes } from '@globalfishingwatch/api-types'
import {
  TimebarChartChunk,
  TrackEventChunkProps,
  ActivityTimeseriesFrame,
} from '@globalfishingwatch/timebar'
import { TileCell } from '@globalfishingwatch/deck-layers'
import { getEventColors, getEventDescription } from 'utils/events'

export const getTimebarChunkEventColor = (ev: TimebarChartChunk<TrackEventChunkProps>) => {
  return ev.type ? getEventColors({ type: ev.type })?.color : 'white'
}

export const parseTrackEventChunkProps = (
  event: TimebarChartChunk,
  eventKey?: string
): TimebarChartChunk<TrackEventChunkProps> => {
  const { description, descriptionGeneric } = getEventDescription({
    start: event.start,
    end: event.end as number,
    type: event.type as EventTypes,
    encounterVesselName: event.encounter?.vessel?.shipname,
    portName: event.port?.name,
  })
  const { color, colorLabels } = getEventColors({ type: event.type as EventTypes })

  return {
    ...event,
    id: eventKey || event.id,
    props: {
      color,
      colorLabels,
      description,
      descriptionGeneric,
    },
  }
}

const getSublayersAggregateTimeseriesFromGridCellsData = (cells: TileCell[]) => {
  const result: Record<string, Record<number, number>> = {}
  const timestamps = new Set<number>()
  cells.forEach((cell) => {
    const { timeseries } = cell
    Object.keys(timeseries).forEach((sublayer) => {
      const sublayerData = timeseries[sublayer]
      Object.keys(sublayerData).forEach((timestamp) => {
        // Extract the unique timestamps from the timeseries
        timestamps.add(parseInt(timestamp))
        const value = sublayerData[timestamp]
        if (!result[sublayer]) result[sublayer] = {}
        if (!result[sublayer][timestamp]) result[sublayer][timestamp] = 0
        result[sublayer][timestamp] += value
      })
    })
  })
  return { timeseries: result, timestamps }
}

function getGraphDataFromSublayersTimeseries(
  timeseries: Record<string, Record<number, number>>,
  timestamps: Set<number>
): ActivityTimeseriesFrame[] {
  const result: ActivityTimeseriesFrame[] = []
  // Iterate over each timestamp and create timeseries frames
  for (const timestamp of Array.from(timestamps)) {
    const frame: ActivityTimeseriesFrame = { date: timestamp }

    for (const key in timeseries) {
      const data = timeseries[key]
      frame[key] = data[timestamp] || 0
    }

    result.push(frame)
  }

  return result
}

export function getGraphFromGridCellsData(cells: TileCell[]): ActivityTimeseriesFrame[] {
  const { timeseries, timestamps } = getSublayersAggregateTimeseriesFromGridCellsData(cells)
  return getGraphDataFromSublayersTimeseries(timeseries, timestamps).sort((a, b) => a.date - b.date)
}
