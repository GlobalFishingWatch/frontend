import { Color, PickingInfo } from '@deck.gl/core'
import { GeoJsonLayerProps } from '@deck.gl/layers'
import { Feature, Point } from 'geojson'
import { Tile2DHeader } from '@deck.gl/geo-layers/dist/tileset-2d'
import { DeckPickingObject } from '../../types'

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
export type RulerPickingObject = RulerFeature & DeckPickingObject<{}>
export type RulerPickingInfo = PickingInfo<RulerPickingObject, { tile?: Tile2DHeader }>
