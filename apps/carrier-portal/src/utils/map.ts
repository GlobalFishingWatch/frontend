import { fitBounds } from 'viewport-mercator-project'
import flatMap from 'lodash/flatMap'
import { MapModuleBounds, TrackInterface } from 'types/app.types'

export const getCoordinatesForBounds = (
  dimensions: { width: number; height: number },
  bounds: MapModuleBounds,
  padding = 50
) => {
  const { latitude, longitude, zoom } = fitBounds({
    bounds: [
      [bounds.minLng, bounds.minLat],
      [bounds.maxLng, bounds.maxLat],
    ],
    width: dimensions.width,
    height: dimensions.height,
    padding,
  })
  return { coordinates: { latitude, longitude }, zoom }
}

export const getGeojsonBetweenTimestamps = (
  geojson: any,
  starterTimestamp: number,
  finalTimestamp: number
) => {
  if (!geojson || !geojson.features) return null

  const features: TrackInterface[] = flatMap(geojson.features, (feature: any) => {
    const geojsonBetween: {
      coordinates: number[]
      times: number[]
    } = {
      coordinates: [],
      times: [],
    }

    const hasGeometry =
      feature.geometry && feature.geometry.coordinates && feature.geometry.coordinates.length
    const hasTimes =
      feature.properties &&
      feature.properties.coordinateProperties &&
      feature.properties.coordinateProperties.times &&
      feature.properties.coordinateProperties.times.length > 0
    if (hasGeometry && hasTimes) {
      feature.geometry.coordinates.forEach((coordinate: any, coordinateIndex: number) => {
        const timeCoordinate: number =
          feature.properties.coordinateProperties.times[coordinateIndex]
        if (timeCoordinate > starterTimestamp && timeCoordinate <= finalTimestamp) {
          geojsonBetween.coordinates.push(coordinate)
          geojsonBetween.times.push(timeCoordinate)
        }
      })
    }

    if (!geojsonBetween.coordinates.length) return []

    const filteredFeature = {
      ...feature,
      geometry: {
        ...feature.geometry,
        coordinates: geojsonBetween.coordinates,
      },
      properties: {
        ...feature.properties,
        coordinateProperties: {
          ...feature.coordinateProperties,
          times: geojsonBetween.times,
        },
      },
    }

    return filteredFeature
  })
  return { ...geojson, features }
}
