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
   * Rank from 0 to 2000
   */
  populationRank: number
  scalerank: number
  name: string
} & {
  [K in `name_${Locale}`]?: string
}
export type BasemapLayerFeature = Feature<Point, BasemapLayerProperties>
export type _BasemapLayerProps = DeckLayerProps<{ basemap: BasemapType }>
export type _BasemapLabelsLayerProps = DeckLayerProps<{ locale?: Locale; tilesUrl: string }>
