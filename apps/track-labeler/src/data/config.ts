import type {
  BasemapGeneratorConfig,
  // CartoPolygonsGeneratorConfig,
} from '@globalfishingwatch/layer-composer'
import * as Generators from '@globalfishingwatch/layer-composer'

import type { ContextLayer } from '../types'
import type { AppState } from '../types/redux.types'

import { Field } from './models'

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

export const BACKGROUND_LAYER = [
  {
    id: 'bathymetry',
    tileset: 'bathymetry',
    description: 'bathymetry',
    type: Generators.GeneratorType.Basemap,
    basemap: Generators.BasemapType.Bathymetry,
  } as BasemapGeneratorConfig,
]
export const DEFAULT_DATAVIEWS = [
  {
    id: 'landmass',
    tileset: 'landmass',
    description: 'landmass',
    type: Generators.GeneratorType.Basemap,
    basemap: Generators.BasemapType.Default,
  } as BasemapGeneratorConfig,

  // {
  //   id: 'cp_rfmo',
  //   type: Generators.Type.CartoPolygons,
  //   cartoTableId: 'cp_rfmo',
  //   color: '#6b67e5',
  // } as CartoPolygonsGeneratorConfig,
  // {
  //   id: 'eez',
  //   name: 'Exclusive Economic Zones',
  //   type: Generators.Type.CartoPolygons,
  //   cartoTableId: 'eez',
  //   color: '#61cb96',
  //   fillColor: '#00ff00',
  // } as CartoPolygonsGeneratorConfig,
  // {
  //   id: 'mpant',
  //   name: 'Marine Protected Areas',
  //   type: Generators.Type.CartoPolygons,
  //   cartoTableId: 'mpant',
  //   color: '#e5777c',
  // } as CartoPolygonsGeneratorConfig,
]
export type ContextualLayerTypes =
  | 'cp_rfmo'
  | 'cp_next_port'
  | 'other_rfmos'
  | 'eez'
  | 'mpant'
  | 'bluefin_rfmo'
  | 'landmass'
  | 'graticules'

export const CONTEXT_LAYERS_IDS: { [key in string]: ContextualLayerTypes } = {
  otherRfmos: 'other_rfmos',
  nextPort: 'cp_next_port',
  rfmo: 'cp_rfmo',
  eez: 'eez',
  mpant: 'mpant',
  bluefinRfmo: 'bluefin_rfmo',
  landmass: 'landmass',
}

export const CONTEXT_LAYERS: ContextLayer[] = [
  {
    id: CONTEXT_LAYERS_IDS.landmass,
    label: 'Landmass',
    color: '#6b67e5',
    description: 'Landmass',
    visible: true,
  },
  {
    id: CONTEXT_LAYERS_IDS.rfmo,
    label: 'Tuna RFMO areas',
    color: '#6b67e5',
    description:
      'RFMO stands for Regional Fishery Management Organization. These organizations are international organizations formed by countries with a shared interest in managing or conserving an area’s fish stock. Source: GFW',
    visible: true,
  },
  // {
  //   id: CONTEXT_LAYERS_IDS.otherRfmos,
  //   label: 'Other RFMO areas',
  //   color: '#d8d454',
  //   description:
  //     'Geographic Area of Competence of South Pacific RFMO, Convention on Conservation of Antarctic Marine Living Resources, North-East Atlantic Fisheries Commission, Northwest Atlantic Fisheries Organization, South-East Atlantic Fisheries Organization, South Indian Ocean Fisheries Agreement, and General Fisheries Commission for the Mediterranean. Source: fao.org/geonetwork',
  // },
  {
    id: CONTEXT_LAYERS_IDS.eez,
    label: 'Exclusive Economic Zones',
    color: '#93c96c',
    description:
      'Exclusive Economic Zones (EEZ) are states’ sovereign waters, which extend 200 nautical miles from the coast. Source: marineregions.org',
    visible: true,
  },
  {
    id: CONTEXT_LAYERS_IDS.mpant,
    label: 'Marine Protected Areas',
    color: '#e5777c',
    description: 'Source: Protected Planet WDPA',
    visible: true,
  },
  // {
  //   id: CONTEXT_LAYERS_IDS.bluefinRfmo,
  //   label: 'Southern bluefin tuna range',
  //   color: '#A758FF',
  //   description:
  //     'Prepared by GFW based on "The Current Status of International Fishery Stocks", 2018, Fisheries Agency and Japan Fisheries Research and Education Agency',
  // },
]

export enum TimebarMode {
  speed = 'speed',
  hours = 'hours',
  bathymetry = 'bathymetry',
}

export const DEFAULT_WORKSPACE: AppState = {
  workspaceDataviews: DEFAULT_DATAVIEWS,
  zoom: 3,
  colorMode: 'labels',
  minSpeed: 0,
  maxSpeed: 15,
  minElevation: -4000,
  maxElevation: 500,
  hiddenLayers: '',
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
