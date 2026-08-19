import type { Feature, FeatureCollection, Position } from 'geojson'

import { COORDINATE_PROPERTY_TIMESTAMP } from '@globalfishingwatch/data-transforms'

import { getUTCDateTime } from 'utils/dates'

// KML 2.2 with Google's gx extension: per-point times as <gx:Track>, which Google Earth animates
// and our own uploader reads back as coordinateProperties.times. Strict core-KML validators reject
// gx:Track — a segment without complete times falls back to <LineString>

const escapeXml = (value: string) =>
  value.replace(
    /[<>&'"]/g,
    (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c] as string
  )

// getUTCDateTime resolves unparseable input to *now*, so drop empties before calling it
const toIsoString = (value: string | number | null | undefined) => {
  if (value === null || value === undefined || value === '') return ''
  if (typeof value === 'number' && !Number.isFinite(value)) return ''
  return getUTCDateTime(value).toISO() as string
}

type TrackLine = {
  coordinates: Position[]
  times: (string | number | null)[]
  name: string
}

const getFeatureLines = (feature: Feature, fallbackName: string): TrackLine[] => {
  const { geometry, properties } = feature
  const coordinateProperties = (properties?.coordinateProperties ?? {}) as Record<string, any>
  const allTimes = coordinateProperties[COORDINATE_PROPERTY_TIMESTAMP] ?? []
  const name = properties?.seg_id ?? properties?.segId ?? properties?.id ?? fallbackName
  if (geometry?.type === 'LineString') {
    return [{ coordinates: geometry.coordinates, times: allTimes, name }]
  }
  if (geometry?.type === 'MultiLineString') {
    return geometry.coordinates.map((coordinates, lineIndex) => ({
      coordinates,
      times: allTimes?.[lineIndex] ?? [],
      name: geometry.coordinates.length > 1 ? `${name} (${lineIndex + 1})` : name,
    }))
  }
  return []
}

const lineString = (coordinates: Position[]) => `<LineString>
      <tessellate>1</tessellate>
      <coordinates>
        ${coordinates.map(([lon, lat, alt]) => `${lon},${lat},${alt ?? 0}`).join(' ')}
      </coordinates>
    </LineString>`

// <gx:Track> pairs each <when> with the <gx:coord> at the same index, so both lists must be
// complete: a segment missing any timestamp degrades to a plain <LineString> instead
const track = (coordinates: Position[], isoTimes: string[]) => `<gx:Track>
      <altitudeMode>clampToGround</altitudeMode>
      ${isoTimes.map((time) => `<when>${time}</when>`).join('\n      ')}
      ${coordinates
        .map(([lon, lat, alt]) => `<gx:coord>${lon} ${lat} ${alt ?? 0}</gx:coord>`)
        .join('\n      ')}
    </gx:Track>`

const lineToPlacemark = ({ coordinates, times, name }: TrackLine) => {
  const isoTimes = coordinates.map((_, index) => toIsoString(times[index]))
  const hasAllTimes = isoTimes.length > 0 && isoTimes.every(Boolean)
  return `<Placemark>
    <name>${escapeXml(name)}</name>
    ${hasAllTimes ? track(coordinates, isoTimes) : lineString(coordinates)}
  </Placemark>`
}

export const geoJsonToKml = (geojson: FeatureCollection, name: string) => {
  const lines = (geojson.features ?? []).flatMap((feature) => getFeatureLines(feature, name))
  return `<?xml version="1.0" encoding="UTF-8"?>
  <kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2">
    <Document>
      <name>${escapeXml(name)}</name>
      ${lines.map(lineToPlacemark).join('\n')}
    </Document>
  </kml>`
}
