import { uniq } from 'es-toolkit'

import type { Dataset } from '@globalfishingwatch/api-types'
import { DatasetTypes, EXCLUDE_FILTER_ID } from '@globalfishingwatch/api-types'
import { findDatasetByType, resolveEndpoint } from '@globalfishingwatch/datasets-client'
import type { BathymetryContourLayerProps } from '@globalfishingwatch/deck-layers'
import { BATHYMETRY_DEPTH_GROUPS } from '@globalfishingwatch/deck-layers/config'

import type { DeckResolverFunction } from '../types/resolvers'

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

  const depthFilter = filters?.depth
  const resolvedDepths = uniq(
    (Array.isArray(depthFilter) ? depthFilter : []).flatMap((d: string) => {
      return BATHYMETRY_DEPTH_GROUPS[d] || Number(d)
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
