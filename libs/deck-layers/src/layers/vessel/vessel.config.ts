import type { Color } from '@deck.gl/core'

import { ThinningLevels } from '@globalfishingwatch/api-client'
import { EventTypes } from '@globalfishingwatch/api-types'

import { hexToDeckColor } from '../../utils'

export const TRACK_LAYER_TYPE = 'track'
export const EVENT_LAYER_TYPE = 'event'

type EventShape = 'circle' | 'square' | 'diamond' | 'diamondStroke' | 'x'
export const SHAPES_ORDINALS: Record<EventShape, number> = {
  circle: 0,
  square: 1,
  diamond: 2,
  diamondStroke: 3,
  x: 4,
}

export const EVENT_SHAPES: Record<EventTypes, number> = {
  [EventTypes.Encounter]: SHAPES_ORDINALS.diamond,
  [EventTypes.Loitering]: SHAPES_ORDINALS.diamondStroke,
  [EventTypes.Port]: SHAPES_ORDINALS.square,
  [EventTypes.Fishing]: SHAPES_ORDINALS.circle,
  [EventTypes.Gap]: SHAPES_ORDINALS.x,
}

export const EVENTS_COLORS: Record<string, Color> = {
  encounter: hexToDeckColor('#FAE9A0'),
  loitering: hexToDeckColor('#cfa9f9'),
  port_visit: hexToDeckColor('#99EEFF'),
  highlight: hexToDeckColor('#ffffff'),
  gaps: hexToDeckColor('#f45d5e'),
}

export const DEFAULT_FISHING_EVENT_COLOR = [255, 255, 255] as Color
export const DEFAULT_HIGHLIGHT_COLOR_VEC = [1.0, 1.0, 1.0, 1.0]

export const TRACK_DEFAULT_THINNING = ThinningLevels.Aggressive
export const TRACK_DEFAULT_THINNING_CONFIG = {
  0: ThinningLevels.Insane,
  4: ThinningLevels.Aggressive,
}

export const VESSEL_GRAPH_COLORS = [
  '#572EC2',
  '#7932B7',
  '#AD36B4',
  '#CB409C',
  '#E05885',
  '#FC7B79',
  '#FFA369',
  '#FFCC4F',
  '#FFE350',
  '#FDF9BD',
]
