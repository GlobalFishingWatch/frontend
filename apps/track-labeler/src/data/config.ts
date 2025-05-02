import type { DataviewInstance } from '@globalfishingwatch/api-types'
import { DataviewType } from '@globalfishingwatch/api-types'
import { BasemapType } from '@globalfishingwatch/deck-layers'

import type { AppState } from '../types/redux.types'

import { Field } from './models'

export const BASEMAP_DATAVIEW_SLUG = 'basemap'

export const DEFAULT_BASEMAP_DATAVIEW_INSTANCE_ID = 'basemap'
export const DEFAULT_BASEMAP_DATAVIEW_INSTANCE: DataviewInstance = {
  dataviewId: BASEMAP_DATAVIEW_SLUG,
  id: DEFAULT_BASEMAP_DATAVIEW_INSTANCE_ID,
  config: {
    type: DataviewType.Basemap,
    basemap: BasemapType.Default,
  },
}
export const TRACK_FIELDS = [
  Field.lonlat,
  Field.timestamp,
  Field.speed,
  Field.elevation,
  Field.course,
  Field.night,
  Field.distanceFromPort,
]
export const DEFAULT_TOKEN_EXPIRATION = 10 * 60 // In seconds
export const TRACK_START = new Date('2019-07-01T00:00:00.000Z')
export const TRACK_END = new Date()
export const MAP_BACKGROUND_COLOR = '#000000'
export const LABELER_VERSION = 1

export const DEFAULT_VIEWPORT = {
  zoom: 1.49,
  latitude: 19,
  longitude: 26,
}

export type ContextualLayerIds = 'rfmo' | 'eez' | 'mpa' | 'basemap'
export type ContextualLayerTypes =
  | 'cp_rfmo'
  | 'cp_next_port'
  | 'other_rfmos'
  | 'eez'
  | 'mpant'
  | 'bluefin_rfmo'
  | 'landmass'
  | 'graticules'

export const CONTEXT_LAYERS_IDS: { [key in ContextualLayerIds]: ContextualLayerTypes } = {
  rfmo: 'cp_rfmo',
  eez: 'eez',
  mpa: 'mpant',
  basemap: 'landmass',
}

export enum TimebarMode {
  speed = 'speed',
  hours = 'hours',
  bathymetry = 'bathymetry',
}

export const DEFAULT_WORKSPACE: AppState = {
  zoom: 3,
  colorMode: 'labels',
  minSpeed: 0,
  maxSpeed: 15,
  minElevation: -4000,
  maxElevation: 500,
  hiddenLayers: 'eez,mpant,cp_rfmo',
  fromHour: 0,
  toHour: 24,
  latitude: -25.54035,
  fishingPositions: 15,
  longitude: -35.97144,
  project: '1',
  start: '2017-12-01T00:00:00.000Z',
  end: '2018-01-01T00:00:00.000Z',
  //end: new Date().toISOString(),
  timebarMode: 'speed',
  filterMode: 'speed',
  minDistanceFromPort: 0,
  maxDistanceFromPort: 10000,
  importView: false,
}
