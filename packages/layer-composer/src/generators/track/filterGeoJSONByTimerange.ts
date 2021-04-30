import {
  FeatureCollection,
  Feature,
  Geometry,
  GeoJsonProperties,
  LineString,
  Position,
} from 'geojson'

interface SegmentData {
  coordinates: Position[]
  times: number[]
}

// TODO TS types wont work with MultiPoint geoms
const filterGeoJSONByTimerange = (
  geojson: FeatureCollection,
  start: number,
  end: number
): FeatureCollection => {
  if (!geojson || !geojson.features)
    return {
      type: 'FeatureCollection',
      features: [],
    }

  const featuresFiltered: Feature<Geometry, GeoJsonProperties>[] = geojson.features.reduce(
    (filteredFeatures: Feature<Geometry, GeoJsonProperties>[], feature) => {
      const hasTimes =
        feature.properties &&
        feature.properties.coordinateProperties &&
        feature.properties.coordinateProperties.times &&
        feature.properties.coordinateProperties.times.length > 0
      if (hasTimes) {
        const filtered: SegmentData = (feature.geometry as LineString).coordinates.reduce(
          (filteredCoordinates, coordinate, index) => {
            const timeCoordinate: number = feature.properties!.coordinateProperties.times[index]
            const isInTimeline = timeCoordinate >= start && timeCoordinate <= end
            if (isInTimeline) {
              ;(filteredCoordinates.coordinates as Position[]).push(coordinate)
              ;(filteredCoordinates.times as number[]).push(timeCoordinate)
            }
            return filteredCoordinates
          },
          { coordinates: [], times: [] }
        )
        if (!filtered.coordinates.length) return filteredFeatures

        //
        const geometry: LineString = {
          type: 'LineString',
          coordinates: filtered.coordinates,
        }

        const properties: GeoJsonProperties = {
          ...feature.properties,
          coordinateProperties: {
            times: filtered.times,
          },
        }

        const filteredFeature: Feature = {
          ...feature,
          geometry,
          properties,
        }
        filteredFeatures.push(filteredFeature)
      }
      return filteredFeatures
    },
    []
  )
  const geojsonFiltered: FeatureCollection = {
    ...geojson,
    features: featuresFiltered,
  }
  return geojsonFiltered
}

export default filterGeoJSONByTimerange
