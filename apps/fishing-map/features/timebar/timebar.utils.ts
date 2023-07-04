import { EventTypes } from '@globalfishingwatch/api-types'
import { TimebarChartChunk, TrackEventChunkProps } from '@globalfishingwatch/timebar'
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
