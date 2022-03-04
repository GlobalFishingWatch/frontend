import { DateTime } from 'luxon'
import { Feature, FeatureCollection } from 'geojson'
import { Segment, segmentsToGeoJSON } from '@globalfishingwatch/data-transforms'
import { EventType } from '@globalfishingwatch/api-types'
import { Dictionary } from '../../types'
import filterTrackByTimerange from '../track/filterTrackByTimerange'
import { AuthorizationOptions, RawEvent } from '../types'

const EVENTS_COLORS: Dictionary<string> = {
  encounter: '#FAE9A0',
  partially: '#F59E84',
  unmatched: '#CE2C54',
  loitering: '#cfa9f9',
  port: '#99EEFF',
  port_visit: '#99EEFF',
  fishing: '#ffffff',
}

const EVENTS_COLORS_OUTLINE: Dictionary<string> = {
  encounter: '#C3C09A',
  partially: '#F59E84',
  unmatched: '#CE2C54',
  loitering: '#A595DD',
  port: '#99EEFF',
  port_visit: '#99EEFF',
  fishing: '#ffffff',
}

const SHAPE_BY_TYPE: Record<EventType, string> = {
  fishing: 'circle',
  encounter: 'encounter',
  loitering: 'loitering',
  port_visit: 'port',
  gap: 'circle',
}
const SHAPE_SIZE_BY_TYPE: Record<EventType, number> = {
  fishing: 0.4,
  encounter: 1,
  loitering: 1,
  port_visit: 1,
  gap: 1,
}

const getEncounterAuthColor = (authorizationStatus: AuthorizationOptions) => {
  switch (authorizationStatus) {
    case 'authorized':
      return EVENTS_COLORS.encounter
    case 'partially':
      return EVENTS_COLORS.partially
    case 'unmatched':
      return EVENTS_COLORS.unmatched
    default:
      return ''
  }
}

const getDateTimeDate = (date: string | number) => {
  return typeof date === 'number' ? DateTime.fromMillis(date) : DateTime.fromISO(date)
}

export const getVesselEventsGeojson = (
  trackEvents: RawEvent[] | null,
  showAuthorizationStatus = true,
  iconsPrefix = 'carrier_portal_',
  trackColor = null
): FeatureCollection => {
  const featureCollection: FeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  }

  if (!trackEvents) return featureCollection
  const trackEventsSorted = [...trackEvents].sort((a, b) => (a.type === 'encounter' ? 1 : -1))
  featureCollection.features = trackEventsSorted.flatMap((event: RawEvent) => {
    if (!event) return []
    const isEncounterEvent = event.type === 'encounter'
    const authorized = event.encounter?.authorized === true
    const authorizationStatus = event?.encounter
      ? event.encounter?.authorizationStatus
      : ('unmatched' as AuthorizationOptions)

    const lng = event.position.lng || event.position.lon || 0

    let color = EVENTS_COLORS[event.type]
    const colorOutline = EVENTS_COLORS_OUTLINE[event.type]
    if (isEncounterEvent && showAuthorizationStatus) {
      color = getEncounterAuthColor(authorizationStatus)
    } else if (event.type === 'fishing') {
      color = trackColor || EVENTS_COLORS[event.type]
    }
    const shape = SHAPE_BY_TYPE[event.type as EventType]
    return {
      type: 'Feature',
      properties: {
        id: event.id,
        type: event.type,
        timestamp: event.start,
        start: getDateTimeDate(event.start).toUTC().toISO(),
        end: getDateTimeDate(event.end).toUTC().toISO(),
        ...(isEncounterEvent && {
          encounterVesselId: event.encounter?.vessel?.id,
          encounterVesselName: event.encounter?.vessel?.name,
          ...(showAuthorizationStatus && {
            authorized,
            authorizationStatus,
          }),
        }),
        icon: `${iconsPrefix}${event.type}`,
        shape,
        shapeHighlight: `${shape}-highlight`,
        shapeSize: SHAPE_SIZE_BY_TYPE[event.type as EventType],
        shapePriority: event.type === 'fishing' ? 0 : 1,
        color,
        colorOutline
      },
      geometry: {
        type: 'Point',
        coordinates: [lng, event.position.lat],
      },
    }
  })

  return featureCollection
}

export const filterFeaturesByTimerange = (features: Feature[], start: string, end: string) => {
  if (start && end) {
    const startMs = new Date(start).getTime()
    const endMs = new Date(end).getTime()
    return features.filter((feature) => {
      return (
        feature.properties &&
        feature.properties.timestamp >= startMs &&
        feature.properties.timestamp <= endMs
      )
    })
  }
  return features
}

export const filterGeojsonByTimerange = (
  geojson: FeatureCollection,
  start: string,
  end: string
): FeatureCollection => {
  if (!geojson || !geojson.features) {
    return {
      type: 'FeatureCollection',
      features: [],
    }
  }
  if (!start || !end) {
    return geojson
  }

  const featuresFiltered = geojson.features.filter((feature) => {
    return feature.properties?.start >= start && feature.properties?.end <= end
  })

  const geojsonFiltered: FeatureCollection = {
    ...geojson,
    features: featuresFiltered,
  }
  return geojsonFiltered
}

export const getVesselEventsSegmentsGeojsonMemoizeEqualityCheck = (
  newArgs: any[],
  lastArgs: any[]
) => {
  return newArgs[0].length === lastArgs[0].length && newArgs[1].length === lastArgs[1].length
}

export const getVesselEventsSegmentsGeojson = (
  track: any,
  events: RawEvent[],
  showAuthorizationStatus = true
): FeatureCollection => {
  const featureCollection: FeatureCollection = {
    type: 'FeatureCollection',
    features: [],
  }

  if (!track || !events) return featureCollection

  const geojson = (track as FeatureCollection).type
    ? (track as FeatureCollection)
    : segmentsToGeoJSON(track as Segment[])
  if (!geojson) return featureCollection
  featureCollection.features = events.flatMap((event: RawEvent) => {
    return filterTrackByTimerange(geojson, event.start, event.end).features.map((feature) => {
      const isEncounterEvent = event.type === 'encounter'
      const authorized = event.encounter?.authorized === true
      const authorizationStatus = event?.encounter
        ? event.encounter?.authorizationStatus
        : ('unmatched' as AuthorizationOptions)
      return {
        ...feature,
        properties: {
          id: event.id,
          type: event.type,
          start: getDateTimeDate(event.start).toUTC().toISO(),
          end: getDateTimeDate(event.end).toUTC().toISO(),
          color:
            isEncounterEvent && showAuthorizationStatus
              ? getEncounterAuthColor(authorizationStatus)
              : EVENTS_COLORS[event.type],
          ...(event.vessel && {
            vesselId: event.vessel.id,
            vesselName: event.vessel.name,
          }),
          ...(isEncounterEvent && {
            encounterVesselId: event.encounter?.vessel.id,
            encounterVesselName: event.encounter?.vessel.name,
            ...(showAuthorizationStatus && {
              authorized,
              authorizationStatus,
            }),
          }),
        },
      }
    })
  })
  return featureCollection
}

type FeaturesByType = { 'fishing': Feature[], 'other': Feature[] }

export const groupFeaturesByType = (
  features: Feature[],
): FeaturesByType => {
  return {
    fishing: features.filter(e => e.properties?.type === 'fishing'),
    other: features.filter(e => e.properties?.type !== 'fishing')
    }
  }
