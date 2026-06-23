import type { Dataset } from '@globalfishingwatch/api-types'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import { findDatasetByType, resolveEndpoint } from '@globalfishingwatch/datasets-client'
import type { BathymetryContourLayerProps } from '@globalfishingwatch/deck-layers'

import type { DeckResolverFunction } from '../types/resolvers'

const PELAGIC_ZONES_ELEVATIONS = [-200, -1000, -4000, -6000]

export const resolveDeckBathymetryContourLayerProps: DeckResolverFunction<
  BathymetryContourLayerProps
> = (dataview) => {
  const dataset = findDatasetByType(dataview.datasets, DatasetTypes.PMTiles) as Dataset
  const datasetConfig = dataview.datasetsConfig?.[0]
  const filters = dataview.config?.filters
  const tilesUrl = resolveEndpoint(dataset, datasetConfig, { absolute: true }) as string
  const rawElevations =
    typeof filters?.elevation === 'string' && filters.elevation !== ''
      ? [filters.elevation]
      : Array.isArray(filters?.elevation)
        ? filters.elevation
        : []
  const elevations = rawElevations
    .flatMap((e: string) => (e === 'pelagic zones' ? PELAGIC_ZONES_ELEVATIONS : Number(e)))
    .filter((n) => !Number.isNaN(n))

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
