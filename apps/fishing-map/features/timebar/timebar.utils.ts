import { DateTime } from 'luxon'
import { ApiEvent } from '@globalfishingwatch/api-types'
import { TrackEventChunkProps } from '@globalfishingwatch/timebar'
import { getEventDescription } from 'utils/events'
import { getUTCDateTime } from 'utils/dates'

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
