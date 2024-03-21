import greatCircle from '@turf/great-circle'
import length from '@turf/length'
import { Position } from '@deck.gl/core'
import { Feature, Point } from '@turf/helpers'
import { RulerData, RulerPointProperties } from '../../types'

export const getRulerCoordsPairs = (
  ruler: RulerData
): { start: Position; end: Position; id: number } => {
  return {
    start: [Number(ruler.start.longitude), Number(ruler.start.latitude)],
    end: [Number(ruler.end.longitude), Number(ruler.end.latitude)],
    id: Number(ruler.id),
  }
}

export const hasRulerStartAndEnd = (rulers: RulerData[]) =>
  rulers.every((ruler) => ruler.start && ruler.end)
export const getGreatCircleMultiLine = (ruler: RulerData) => {
  const { start, end } = getRulerCoordsPairs(ruler)
  return greatCircle(start, end, { properties: { id: ruler.id } })
}

export const getRulerStartAndEndPoints = (
  ruler: RulerData
): Feature<Point, RulerPointProperties>[] => {
  const { start, end, id } = getRulerCoordsPairs(ruler)
  return [
    {
      type: 'Feature',
      properties: { id, order: 'start' } as RulerPointProperties,
      geometry: {
        coordinates: start as number[],
        type: 'Point',
      },
    },
    {
      type: 'Feature',
      properties: { id, order: 'end' },
      geometry: {
        coordinates: end as number[],
        type: 'Point',
      },
    },
  ]
}

const getRulerLength = (ruler: RulerData) => {
  const lengthKm = length(
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          [ruler.start.longitude, ruler.start.latitude],
          [ruler.end.longitude, ruler.end.latitude],
        ],
      },
    },
    { units: 'kilometers' }
  )
  return lengthKm
}
export const getRulerLengthLabel = (ruler: RulerData) => {
  const lengthKm = getRulerLength(ruler)
  const lengthNmi = lengthKm / 1.852
  const precissionKm = lengthKm > 100 ? 0 : lengthKm > 10 ? 1 : 2
  const precissionNmi = lengthNmi > 100 ? 0 : lengthNmi > 10 ? 1 : 2
  const lengthKmFormatted = lengthKm.toFixed(precissionKm)
  const lengthNmiFormatted = lengthNmi.toFixed(precissionNmi)
  return `${lengthKmFormatted}km - ${lengthNmiFormatted}nm`
}
