import type { Feature, LineString, Point, Position } from 'geojson'

import type { DeckLayerProps } from '../../types'

export type BathymetryContourLayerProps = DeckLayerProps<{
  tilesUrl: string
  filters?: Record<string, any>
  color: string
  thickness: number
}>
export type BathymetryContourFeature = Feature<LineString>
export type BathymetryLabelFeature = Feature<
  Point,
  {
    elevation: number
    angle: number
    length: number
  }
>
