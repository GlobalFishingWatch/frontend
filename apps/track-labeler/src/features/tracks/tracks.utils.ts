import type { ExportData, ExportFeature } from '../../types'
import type { SelectedTrackType } from '../vessels/selectedTracks.slice'

export const extractLabeledTrack = (
  geojson: ExportData
): {
  segments: SelectedTrackType[]
  start: Date
  end: Date
} => {
  const segments: SelectedTrackType[] = []
  let start = 0
  let end = 0 // year 2050
  const selected: SelectedTrackType = {}
  geojson.features.forEach((feature: ExportFeature) => {
    const segmentStart = feature.properties.coordinateProperties.times[0] as number
    if (!start || (segmentStart && start > segmentStart)) {
      start = segmentStart
    }
    const segmentEnd = feature.properties.coordinateProperties.times[
      feature.properties.coordinateProperties.times.length - 1
    ] as number
    if (segmentEnd && end < segmentEnd) {
      end = segmentEnd
    }
    feature.properties.coordinateProperties.labels_id.forEach((label, index: number) => {
      const [lon, lat] = feature.geometry.coordinates[index]
      const timestamp = feature.properties.coordinateProperties.times[index]
      if (!selected.action && label) {
        selected.action = label as string
        selected.startLatitude = lat
        selected.startLongitude = lon
        selected.start = timestamp
        selected.endLatitude = lat
        selected.endLongitude = lon
        selected.end = timestamp
        return
      }
      if (label === selected.action) {
        selected.endLatitude = lat
        selected.endLongitude = lon
        selected.end = timestamp
        return
      }
      if (selected.action && label !== selected.action) {
        segments.push({ ...selected })
        if (label) {
          selected.action = label as string
          selected.startLatitude = lat
          selected.startLongitude = lon
          selected.start = timestamp
          selected.endLatitude = lat
          selected.endLongitude = lon
          selected.end = timestamp
        } else {
          selected.action = undefined
          selected.startLatitude = undefined
          selected.startLongitude = undefined
          selected.start = undefined
          selected.endLatitude = undefined
          selected.endLongitude = undefined
          selected.end = undefined
        }
      }
    })
  })
  if (selected.action) {
    segments.push({ ...selected })
    selected.action = undefined
  }
  return {
    start: new Date(start),
    end: new Date(end),
    segments,
  }
}

export const fixCoordinates = (geojson: ExportData): ExportData => {
  // Hack for renderes like mapbox gl or leaflet to fix antimeridian issues
  // https://macwright.org/2016/09/26/the-180th-meridian.html
  let currentLon: number
  let lonOffset = 0
  return {
    ...geojson,
    features: geojson.features.map((feature: ExportFeature) => {
      return {
        ...feature,
        geometry: {
          ...feature.geometry,
          coordinates: feature.geometry.coordinates.map(([lon, lat]) => {
            if (!lon || !lat) {
              return [lon, lat]
            }
            if (currentLon) {
              if (lon - currentLon < -180) {
                lonOffset += 360
              } else if (lon - currentLon > 180) {
                lonOffset -= 360
              }
            }
            currentLon = lon
            return [lon + lonOffset, lat]
          }),
        },
      }
    }),
  }
}
