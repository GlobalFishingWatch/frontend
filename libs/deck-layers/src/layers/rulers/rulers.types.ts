import { Color } from '@deck.gl/core'
import { GeoJsonLayerProps } from '@deck.gl/layers'
import { BaseLayerProps } from '../../types'

export type RulerPointProperties = {
  id?: number
  order: 'start' | 'center' | 'end'
  bearing?: number
  text?: string
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
