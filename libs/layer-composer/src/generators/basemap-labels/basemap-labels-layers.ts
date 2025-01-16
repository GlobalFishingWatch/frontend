import { Locale } from '@globalfishingwatch/api-types'
import type { LayerSpecification } from '@globalfishingwatch/maplibre-gl'

import { API_GATEWAY, API_GATEWAY_VERSION } from '../../config'
import type { Dictionary } from '../../types';
import { Group } from '../../types'
import { BasemapType } from '../types'

export const layers: Dictionary<LayerSpecification[]> = {
  [BasemapType.Labels]: [
    {
      type: 'raster',
      id: BasemapType.Labels,
      source: BasemapType.Labels,
      metadata: {
        group: Group.Label,
      },
    },
  ],
}

export const getLabelsTilesUrlByLocale = (locale: Locale = Locale.en) => {
  return `${API_GATEWAY}/${API_GATEWAY_VERSION}/tileset/nslabels/tile?locale=${locale}&x={x}&y={y}&z={z}`
}

export const sources: Dictionary<Record<string, any>> = {
  [BasemapType.Labels]: {
    tiles: [getLabelsTilesUrlByLocale()],
    type: 'raster',
    tileSize: 256,
    attribution: 'Google',
  },
}
