import type { Color, PickingInfo } from '@deck.gl/core'
import type { Tile2DHeader } from '@deck.gl/geo-layers/dist/tileset-2d'
import type { GeoJsonLayerProps } from '@deck.gl/layers'
import type { Feature, Point } from 'geojson'

import type { DeckPickingObject } from '../../types'

export type RulerPointProperties = {
  id?: number
  order: 'start' | 'center' | 'end'
  bearing?: number
  text?: string
  lengthLabel?: string
}

export type RulerData = {
  id: number
  start: {
    latitude: number
    longitude: number
  }
  end: {
    latitude: number
    longitude: number
  }
}

export type RulersLayerProps = GeoJsonLayerProps & {
  rulers: RulerData[]
  color?: Color
}

export type RulerFeature = Feature<Point, RulerPointProperties>
export type RulerPickingObject = DeckPickingObject<RulerFeature>
export type RulerPickingInfo = PickingInfo<RulerPickingObject, { tile?: Tile2DHeader }>
