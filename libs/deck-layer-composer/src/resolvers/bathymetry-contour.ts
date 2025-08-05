import type { Dataset } from '@globalfishingwatch/api-types'
import { DatasetTypes } from '@globalfishingwatch/api-types'
import { findDatasetByType, resolveEndpoint } from '@globalfishingwatch/datasets-client'
import type { BathymetryContourLayerProps } from '@globalfishingwatch/deck-layers'

import type { DeckResolverFunction } from './types'

export const resolveDeckBathymetryContourLayerProps: DeckResolverFunction<
  BathymetryContourLayerProps
> = (dataview) => {
  const dataset = findDatasetByType(dataview.datasets, DatasetTypes.Context) as Dataset
  const datasetConfig = dataview.datasetsConfig?.[0]
  const filters = dataview.config?.filters
  // const tilesUrl = resolveEndpoint(dataset, datasetConfig, { absolute: true }) as string
  // const tilesUrl = `http://localhost:8002/{z}/{x}/{y}.pbf`
  const tilesUrl = `https://storage.googleapis.com/public-tiles/basemap/bathymetry-contour/contour.pmtiles?cache=1`
  return {
    id: dataview.id,
    tilesUrl,
    filters,
    visible: dataview.config?.visible ?? true,
    category: dataview.category!,
    color: dataview.config?.color as string,
    thickness: dataview.config?.thickness || 1,
  }
}
