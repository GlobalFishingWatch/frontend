import { createSelector } from "@reduxjs/toolkit"
import { DATA } from "features/app/data"
import { PortPositionFeature, PortPositionsGeneratorConfig } from "types"


/**
 * Creates a custom features for the port points
 */
 export const selectPortPoints = createSelector(
    [],(): PortPositionFeature[] => {
      const colors = {
          NA: '#ff0000',
          'MONTEVIDEO OFFSHORE': '#0000ff'
      }
      const points: PortPositionFeature[] = DATA.filter((point) => point.iso3 === 'URY')
      .map((point) => {
        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [point.lon, point.lat],
          },
          properties: {
            id: point.s2id,
            color: colors[point.sublabel] ?? '#ffffff'
          },
        } as PortPositionFeature
      })
      return points
    }
  )
/**
 * Using the custom Mapbox GL features, it return the layer needed to render port points
 */
 export const selectPortPositionLayer = createSelector(
    [selectPortPoints],
    (points): PortPositionsGeneratorConfig => {
      return {
        type: 'geojson',
        data: {
          features: points,
          type: 'FeatureCollection',
        },
      }
    }
  )