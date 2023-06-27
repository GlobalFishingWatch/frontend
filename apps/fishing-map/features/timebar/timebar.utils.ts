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

export function getGraphFromGridCellsData(cells: TileCell[]): ActivityTimeseriesFrame[] {
  const resultMap: {
    [timestamp: number]: {
      [category: string]: number
    }
  } = {}

  for (const gridCell of cells) {
    const { timeseries } = gridCell

    for (const category in timeseries) {
      const categoryData = timeseries[category]

      for (const timestamp in categoryData) {
        const value = categoryData[timestamp]

        const numTimestamp = Number(timestamp) // Convert the timestamp to number type

        if (!resultMap[numTimestamp]) {
          resultMap[numTimestamp] = {}
        }

        if (!resultMap[numTimestamp][category]) {
          resultMap[numTimestamp][category] = 0
        }

        resultMap[numTimestamp][category] += value
      }
    }
  }

  const output: ActivityTimeseriesFrame[] = []

  for (const timestamp in resultMap) {
    const numTimestamp = Number(timestamp) // Convert the timestamp to number type
    const dataEntry: ActivityTimeseriesFrame = { date: numTimestamp }

    for (const category in resultMap[timestamp]) {
      dataEntry[category] = resultMap[timestamp][category]
    }

    output.push(dataEntry)
  }

  return output.sort((a, b) => a.date - b.date)
}
