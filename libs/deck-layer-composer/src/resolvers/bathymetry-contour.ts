import type { Dataset } from '@globalfishingwatch/api-types'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import { findDatasetByType, resolveEndpoint } from '@globalfishingwatch/datasets-client'
import type { BathymetryContourLayerProps } from '@globalfishingwatch/deck-layers'

import type { DeckResolverFunction } from '../types/resolvers'

export const resolveDeckBathymetryContourLayerProps: DeckResolverFunction<
  BathymetryContourLayerProps
> = (dataview) => {
  const dataset = findDatasetByType(dataview.datasets, DatasetTypes.PMTiles) as Dataset
  const datasetConfig = dataview.datasetsConfig?.[0]
  const filters = dataview.config?.filters
  const tilesUrl = resolveEndpoint(dataset, datasetConfig, { absolute: true }) as string
  let elevations: number[] = []
  if (typeof filters?.elevation === 'string' && filters.elevation !== '') {
    elevations = [Number(filters.elevation)]
  } else if (Array.isArray(filters?.elevation)) {
    elevations = filters?.elevation?.map((e: string) => Number(e)) || []
  }

  return {
    id: dataview.id,
    tilesUrl,
    elevations,
    visible: dataview.config?.visible ?? true,
    category: dataview.category!,
    color: dataview.config?.color as string,
    thickness: dataview.config?.thickness || 1,
  }
}
