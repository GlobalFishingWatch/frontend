import greatCircle from '@turf/great-circle'
import length from '@turf/length'
import { Position } from '@deck.gl/core'
import { Ruler } from '@globalfishingwatch/layer-composer'

export const getRulerCoordsPairs = (ruler: Ruler): { start: Position; end: Position } => {
  return {
    start: [Number(ruler.start.longitude), Number(ruler.start.latitude)],
    end: [Number(ruler.end.longitude), Number(ruler.end.latitude)],
  }
}

export const hasRulerStartAndEnd = (rulers: Ruler[]) =>
  rulers.every((ruler) => ruler.start && ruler.end)
export const getGreatCircleMultiLine = (ruler: Ruler) => {
  const { start, end } = getRulerCoordsPairs(ruler)
  return greatCircle(start, end, { properties: { id: ruler.id } })
}

export const getRulerStartAndEndPoints = (ruler: Ruler) => {
  const { start, end } = getRulerCoordsPairs(ruler)
  return [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        coordinates: start,
        type: 'Point',
      },
    },
    {
      type: 'Feature',
      properties: {},
      geometry: {
        coordinates: end,
        type: 'Point',
      },
    },
  ]
}

const getRulerLength = (ruler: Ruler) => {
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
export const getRulerLengthLabel = (ruler: Ruler) => {
  const lengthKm = getRulerLength(ruler)
  const lengthNmi = lengthKm / 1.852
  const precissionKm = lengthKm > 100 ? 0 : lengthKm > 10 ? 1 : 2
  const precissionNmi = lengthNmi > 100 ? 0 : lengthNmi > 10 ? 1 : 2
  const lengthKmFormatted = lengthKm.toFixed(precissionKm)
  const lengthNmiFormatted = lengthNmi.toFixed(precissionNmi)
  return `${lengthKmFormatted}km - ${lengthNmiFormatted}nm`
}
