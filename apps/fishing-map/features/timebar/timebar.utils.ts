import { DateTime } from 'luxon'
import { ApiEvent } from '@globalfishingwatch/api-types'
import { TrackEventChunkProps } from '@globalfishingwatch/timebar'
import { getEventDescription } from 'utils/events'

export const parseTrackEventChunkProps = (
  event: ApiEvent,
  eventKey: string
): ApiEvent & { props: TrackEventChunkProps } => {
  const { description, descriptionGeneric, color, colorLabels } = getEventDescription({
    start: event.start as string,
    end: event.end as string,
    type: event.type,
    encounterVesselName: event.encounter?.vessel?.name,
    portName: event.port?.name,
  })

  return {
    ...event,
    id: eventKey,
    start: DateTime.fromISO(event.start as string)
      .toUTC()
      .toMillis(),
    end: DateTime.fromISO(event.end as string)
      .toUTC()
      .toMillis(),
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
