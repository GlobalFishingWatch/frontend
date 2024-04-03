import { Color } from '@deck.gl/core'
import { EventTypes } from '@globalfishingwatch/api-types'
import { hexToDeckColor } from '../../utils'

type EventShape = 'circle' | 'square' | 'diamond' | 'diamondStroke'
export const SHAPES_ORDINALS: Record<EventShape, number> = {
  circle: 0,
  square: 1,
  diamond: 2,
  diamondStroke: 3,
}

export const EVENT_SHAPES: Record<EventTypes, number> = {
  encounter: SHAPES_ORDINALS.diamond,
  loitering: SHAPES_ORDINALS.diamondStroke,
  port_visit: SHAPES_ORDINALS.square,
  fishing: SHAPES_ORDINALS.circle,
  gap: SHAPES_ORDINALS.circle,
}

export const EVENTS_COLORS: Record<string, Color> = {
  encounter: hexToDeckColor('#FAE9A0'),
  loitering: hexToDeckColor('#cfa9f9'),
  port_visit: hexToDeckColor('#99EEFF'),
  highlight: hexToDeckColor('#ffffff'),
}
