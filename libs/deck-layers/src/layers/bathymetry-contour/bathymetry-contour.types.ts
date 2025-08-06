import type { Feature, LineString, MultiLineString, Point } from 'geojson'

import type { DeckLayerProps } from '../../types'

export type BathymetryContourLayerProps = DeckLayerProps<{
  tilesUrl: string
  elevations?: number[]
  color: string
  thickness: number
}>
export type BathymetryContourFeature = Feature<LineString | MultiLineString>
export type BathymetryLabelFeature = Feature<
  Point,
  {
    elevation: number
    bearing: number
    length: number
  }
>
