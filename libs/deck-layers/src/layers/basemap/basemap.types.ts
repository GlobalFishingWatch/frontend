import type { Feature, Point } from 'geojson'

import type { Locale } from '@globalfishingwatch/api-types'

import type { DeckLayerProps } from '../../types'

export enum BasemapType {
  Satellite = 'satellite',
  Default = 'basemap_default',
  Labels = 'basemap_labels',
}

export type BasemapLayerProperties = {
  /**
   * Rank from -1000 to 1000
   */
  populationRank: number
  type: 'country' | 'state' | 'place' | 'sea'
  size: number
  name: string
} & {
  [K in `name_${Locale}`]?: string
}
export type BasemapLayerFeature = Feature<Point, BasemapLayerProperties>
export type _BasemapLayerProps = DeckLayerProps<{ basemap: BasemapType }>
export type _BasemapLabelsLayerProps = DeckLayerProps<{ locale?: Locale; tilesUrl: string }>
