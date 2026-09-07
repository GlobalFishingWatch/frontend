import type { PickingInfo } from '@deck.gl/core'
import type { Feature, LineString, MultiLineString, Point } from 'geojson'

import type { DeckLayerProps, DeckPickingObject } from '#types'

export type BathymetryContourLayerProps = DeckLayerProps<{
  tilesUrl: string
  depths?: number[]
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

export type BathymetryContourPickingObject = DeckPickingObject<{
  properties: { elevation: number }
}>

export type BathymetryContourPickingInfo = PickingInfo<BathymetryContourPickingObject>
