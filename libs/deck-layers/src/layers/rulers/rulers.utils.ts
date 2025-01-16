import greatCircle from '@turf/great-circle'
import type { Coord} from '@turf/helpers';
import { point } from '@turf/helpers'
import length from '@turf/length'
import { rhumbBearing } from '@turf/turf'
import type { Feature, LineString, MultiLineString, Point, Position } from 'geojson'

import type { RulerData, RulerPointProperties } from './rulers.types'

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
  return greatCircle(start as Coord, end as Coord, { properties: { id: ruler.id }, npoints: 200 })
}

export const getRulerStartAndEndPoints = (
  ruler: RulerData
): Feature<Point, RulerPointProperties>[] => {
  const { start, end, id } = getRulerCoordsPairs(ruler)
  const line = getGreatCircleMultiLine(ruler)
  const lengthLabel = getRulerLengthLabel(line)
  return [
    point(start, { id, order: 'start', lengthLabel }),
    point(end, { id, order: 'end', lengthLabel }),
  ]
}

export const getRulerCenterPointWithLabel = (
  line: Feature<LineString | MultiLineString>
): Feature<Point, RulerPointProperties> => {
  const lineGeomCoords =
    line.geometry.type === 'LineString' ? line.geometry.coordinates : line.geometry.coordinates[0]
  const centerIndex = Math.floor(lineGeomCoords.length / 2)
  const centerPoint = lineGeomCoords[centerIndex] as Position
  const anchorPoints = lineGeomCoords.slice(centerIndex, centerIndex + 2)
  const bearing = rhumbBearing(anchorPoints[0] as Coord, anchorPoints[1] as Coord)
  return point(centerPoint, {
    order: 'center',
    text: getRulerLengthLabel(line),
    bearing: bearing <= 0 ? 270 - bearing : 90 - bearing,
  })
}

export const getRulerLengthLabel = (line: Feature<LineString | MultiLineString>) => {
  const lengthKm = length(line, { units: 'kilometers' })
  const lengthNmi = lengthKm / 1.852
  const precissionKm = lengthKm > 100 ? 0 : lengthKm > 10 ? 1 : 2
  const precissionNmi = lengthNmi > 100 ? 0 : lengthNmi > 10 ? 1 : 2
  const lengthKmFormatted = lengthKm.toFixed(precissionKm)
  const lengthNmiFormatted = lengthNmi.toFixed(precissionNmi)
  return `${lengthKmFormatted}km - ${lengthNmiFormatted}nm`
}
