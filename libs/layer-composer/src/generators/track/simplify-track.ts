import type { Feature, FeatureCollection, LineString, Position } from 'geojson'

import type { Dictionary } from '../../types'

const DEFAULT_POS_MAX_Δ = 0.005 // 500m at equator - https://www.usna.edu/Users/oceano/pguth/md_help/html/approx_equivalents.htm
const COORD_PROPS_MAX_ΔS: Dictionary<number> = {
  // times: 600000, //10mn
  // times: 36000000, //10hr
  // speeds: 1,
  // courses: 20,
}

const COORD_PROPS_ROUND: Dictionary<number> = {
  times: 0,
  speeds: 2,
  courses: 0,
}

const cheapDistance = (coordA: Position, coordB: Position) => {
  const longitudeΔ = coordA[0] - coordB[0]
  const latitudeΔ = coordA[1] - coordB[1]
  return Math.sqrt(longitudeΔ * longitudeΔ + latitudeΔ * latitudeΔ)
}

const round = (value: number, numDecimals: number) => {
  const base = Math.pow(10, numDecimals)
  return Math.round(value * base) / base
}

export const simplifyTrack = (
  track: FeatureCollection<LineString>,
  posMaxΔ = DEFAULT_POS_MAX_Δ
) => {
  const simplifiedTrack: FeatureCollection<LineString> = {
    type: 'FeatureCollection',
    features: [],
  }

  track.features.forEach((feature) => {
    const line = feature.geometry as LineString
    const coordProps = feature.properties?.coordinateProperties || {}

    const simplifiedGeometry: LineString = {
      type: 'LineString',
      coordinates: [],
    }
    const simplifiedCoordProps: Dictionary<number[]> = {}
    const coordPropsKeys = Object.keys(coordProps)
    coordPropsKeys.forEach((key) => (simplifiedCoordProps[key] = []))

    let lastPos: Position
    const lastCoordinateProperties: Dictionary<number> = {}

    const addFrame = (i: number) => {
      const pos = line.coordinates[i]
      simplifiedGeometry.coordinates.push(pos)
      lastPos = pos
      coordPropsKeys.forEach((key) => {
        const coordProp = coordProps[key][i]
        const coordPropValue = round(coordProp, COORD_PROPS_ROUND[key])
        simplifiedCoordProps[key].push(coordPropValue)
        lastCoordinateProperties[key] = coordProp
      })
    }

    line.coordinates.forEach((pos, i) => {
      if (i === 0 || i === line.coordinates.length - 1) {
        addFrame(i)
        return
      }

      const posΔ: number = cheapDistance(pos, lastPos)
      const isPosInfMaxΔ = posΔ < posMaxΔ

      // check that every coordProp Δ is less than max Δ
      const isCoordPropsInfMaxΔ = coordPropsKeys.every((key) => {
        const maxΔ = COORD_PROPS_MAX_ΔS[key]
        if (maxΔ === undefined) {
          return true
        }
        const Δ = Math.abs(coordProps[key][i] - lastCoordinateProperties[key])
        return Δ < maxΔ
      })

      // if every Δ is inferior we can ignore the pt
      if (isPosInfMaxΔ && isCoordPropsInfMaxΔ) {
        return
      }

      // else add it to the track and store it for next Δ calc
      addFrame(i)
    })
    const simplifiedFeature: Feature<LineString> = {
      type: 'Feature',
      geometry: simplifiedGeometry,
      properties: {
        coordinateProperties: simplifiedCoordProps,
      },
    }
    simplifiedTrack.features.push(simplifiedFeature)
  })
  return simplifiedTrack
}
