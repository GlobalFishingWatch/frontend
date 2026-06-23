import { uniq } from 'es-toolkit'

import type { Dataset } from '@globalfishingwatch/api-types'
import { DatasetTypes, EXCLUDE_FILTER_ID } from '@globalfishingwatch/api-types'
import { findDatasetByType, resolveEndpoint } from '@globalfishingwatch/datasets-client'
import type { BathymetryContourLayerProps } from '@globalfishingwatch/deck-layers'

import type { DeckResolverFunction } from '../types/resolvers'

const DEPTH_GROUPS: Record<string, number[]> = {
  'pelagic zones': [200, 1000, 4000, 6000],
  '10-100': [10, 20, 30, 40, 50, 60, 70, 80, 90],
  '100-1000': [100, 200, 300, 400, 500, 600, 700, 800, 900],
  '1000-10000': [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000],
}

export const resolveDeckBathymetryContourLayerProps: DeckResolverFunction<
  BathymetryContourLayerProps
> = (dataview) => {
  const dataset = findDatasetByType(dataview.datasets, DatasetTypes.PMTiles) as Dataset
  const datasetConfig = dataview.datasetsConfig?.[0]
  const filters = dataview.config?.filters
  const depthOptions = (
    dataset.filters.contextLayers?.find((f) => f.id === 'depth')?.enum as string[]
  )?.flatMap((s) => Number(s) || [])
  const tilesUrl = resolveEndpoint(dataset, datasetConfig, { absolute: true }) as string

  const resolvedDepths = uniq(
    filters?.depth?.flatMap((d: string) => {
      return DEPTH_GROUPS[d] || Number(d)
    })
  )
  let depths = resolvedDepths
  if (dataview.config?.filterOperators?.depth === EXCLUDE_FILTER_ID && depthOptions) {
    depths = depthOptions.filter((e) => !resolvedDepths.includes(e))
  }

  return {
    id: dataview.id,
    tilesUrl,
    depths,
    visible: dataview.config?.visible ?? true,
    category: dataview.category!,
    color: dataview.config?.color as string,
    thickness: dataview.config?.thickness || 1,
  }
}
