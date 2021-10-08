import { DateTime } from 'luxon'
import { Feature, FeatureCollection } from 'geojson'
import { Segment, segmentsToGeoJSON } from '@globalfishingwatch/data-transforms'
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
  iconsPrefix = 'carrier_portal_'
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
        color:
          isEncounterEvent && showAuthorizationStatus
            ? getEncounterAuthColor(authorizationStatus)
            : EVENTS_COLORS[event.type],
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
